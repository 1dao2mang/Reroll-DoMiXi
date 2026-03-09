'use client';
import { useState, useRef } from 'react';
import * as tus from 'tus-js-client';
import Navbar from '@/components/Navbar';
import '../page.css';
import { useRouter } from 'next/navigation';

export default function AdminUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError('');
            setStatus('');
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a video file to upload.');
            return;
        }

        setError('');
        setStatus('Requesting upload ticket...');
        setLoading(true);
        setProgress(0);

        try {
            const ticketRes = await fetch('/api/player4me/ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: selectedFile.name, size: selectedFile.size })
            });

            if (!ticketRes.ok) throw new Error('Failed to retrieve authentication ticket');
            const { ticket, uploadUrl } = await ticketRes.json();
            
            const endpoint = uploadUrl || 'https://player4me.com/api/v1/videos/upload';
            setStatus('Uploading video...');

            const upload = new tus.Upload(selectedFile, {
                endpoint: endpoint,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                metadata: {
                    filename: selectedFile.name,
                    filetype: selectedFile.type,
                },
                headers: {
                    ...(ticket && { 'Ticket-ID': ticket }),
                },
                onError: (err) => {
                    setError('Upload failed: ' + err.message);
                    setLoading(false);
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                    setProgress(Number(percentage));
                },
                onSuccess: () => {
                    setStatus('Upload complete! Video is now on Player4me.');
                    setLoading(false);
                    setSelectedFile(null); // Reset after success
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            });

            upload.start();

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="layout-root">
            <Navbar />
            
            <main className="main-stage container flex-center">
                <div className="panel" style={{ padding: '2.5rem', maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                    <p className="text-muted">Upload media securely to the ecosystem.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* File Input Area */}
                    <div 
                        style={{
                            border: '1px dashed var(--border-focus)',
                            borderRadius: 'var(--radius-md)',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: selectedFile ? 'var(--bg-elevated)' : 'transparent',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            accept="video/mp4,video/x-m4v,video/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            disabled={loading}
                        />
                        {selectedFile ? (
                            <div>
                                <strong style={{ display: 'block', marginBottom: '0.5rem', wordBreak: 'break-all' }}>{selectedFile.name}</strong>
                                <span className="text-muted">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                        ) : (
                            <div className="text-muted">
                                <strong>Click to select a video</strong> or drag and drop<br/>
                                <span style={{ fontSize: '0.75rem' }}>MP4, M4V up to 2GB</span>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    {error && <div style={{ color: 'var(--error-color)', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                    {status && <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', textAlign: 'center' }}>{status}</div>}

                    {/* Progress Bar */}
                    {loading && (
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-color)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ 
                                width: `${progress}%`, 
                                height: '100%', 
                                background: 'var(--text-primary)',
                                transition: 'width 0.2s ease-out',
                            }} />
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <button className="btn-primary" onClick={handleUpload} disabled={loading || !selectedFile} style={{ width: '100%' }}>
                            {loading ? `Uploading... ${progress}%` : 'Upload to Cloud'}
                        </button>
                        
                        <button type="button" onClick={() => router.push('/')} className="btn-secondary" disabled={loading} style={{ width: '100%' }}>
                            Return to Storage
                        </button>
                    </div>
                </div>
            </div>
            </main>
        </div>
    );
}
