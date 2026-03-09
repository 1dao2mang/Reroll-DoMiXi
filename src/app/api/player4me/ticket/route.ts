import { NextResponse } from 'next/server';

// Get TUS upload url and token from Player4me
export async function POST(req: Request) {
    try {
        const adminToken = process.env.PLAYER4ME_API_TOKEN;
        if (!adminToken) {
            return NextResponse.json({ error: 'Missing PLAYER4ME_API_TOKEN' }, { status: 500 });
        }

        // Technically the openAPI says `GET /api/v1/video/upload`, so let's call it from Server
        const res = await fetch('https://player4me.com/api/v1/video/upload', {
            method: 'GET',
            headers: {
                'api-token': adminToken,
                'Accept': 'application/json'
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        const data = await res.json();
        
        // Return standard ticket info to frontend
        return NextResponse.json({
            uploadUrl: data.tusUrl,
            ticket: data.accessToken
        });
    } catch (error: any) {
        console.error('Ticket error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create ticket' }, { status: 500 });
    }
}
