'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getCollection } from '@/lib/collection';
import { Item } from '@/lib/data';
import '../page.css'; // Reuse global structural styles

export default function CollectionPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setItems(getCollection());
        setLoading(false);
    }, []);

    return (
        <div className="layout-root">
            <Navbar />

            <main className="main-stage container">
                <div className="hero-section" style={{ marginBottom: '3rem' }}>
                    <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Your Collection</h1>
                    <p className="hero-subtitle">Assets you have acquired from the ecosystem.</p>
                </div>

                {loading ? (
                    <div className="text-muted">Loading collection...</div>
                ) : items.length === 0 ? (
                    <div className="panel flex-center" style={{ padding: '4rem 2rem', width: '100%', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '2rem' }}>⊘</div>
                        <h3 style={{ fontSize: '1.25rem' }}>No Assets Found</h3>
                        <p className="text-muted">You haven't extracted any media yet. Head to the Gacha page to roll.</p>
                        <a href="/" className="btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>Go to Gacha</a>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: '2rem', 
                        width: '100%' 
                    }}>
                        {items.map((item, idx) => (
                            <div key={item.instanceId || `${item.id}-${idx}`} className="panel" style={{ overflow: 'hidden', padding: '0', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                                    {item.type === 'video' && item.iframe ? (
                                        <div 
                                            className="collection-video"
                                            dangerouslySetInnerHTML={{ __html: item.iframe }}
                                            style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
                                        />
                                    ) : (
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1 }}>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className={`rarity-text-${item.rarity}`} style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                            {item.rarity}
                                        </span>
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {item.instanceId ? new Date(parseInt(item.instanceId.split('-').pop() || '0')).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
