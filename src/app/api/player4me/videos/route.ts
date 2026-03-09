import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path where the cache JSON will be stored locally (so it survives server restarts)
const CACHE_FILE_PATH = path.join(process.cwd(), '.player4me_cache.json');

export async function GET(req: Request) {
    try {
        const adminToken = process.env.PLAYER4ME_API_TOKEN;
        if (!adminToken) {
            return NextResponse.json({ error: 'Missing PLAYER4ME_API_TOKEN' }, { status: 500 });
        }

        // 1. Try to read from the persistent file cache FIRST
        try {
            const fileContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
            if (fileContent) {
                const cachedData = JSON.parse(fileContent);
                // Return cache directly without hitting Player4me at all
                console.log('Serving videos from local file cache');
                return NextResponse.json(cachedData);
            }
        } catch (err: any) {
            // File doesn't exist yet, we will fetch it
            if (err.code !== 'ENOENT') {
                console.error('Cache read error:', err);
            }
        }

        const url = new URL(req.url);
        // Pass any query params (like ?page=1) upstream
        const res = await fetch(`https://player4me.com/api/v1/video/manage${url.search}`, {
            headers: {
                'api-token': adminToken,
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 } // Ask Next.js to also heavily cache this upstream
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText);
        }

        const data = await res.json();
        
        // 2. Save the successful response to the persistent file
        try {
            await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data), 'utf-8');
            console.log('Saved new videos to local file cache');
        } catch (writeErr) {
            console.error('Failed to write to cache file:', writeErr);
        }
        
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Videos API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch videos' }, { status: 500 });
    }
}
