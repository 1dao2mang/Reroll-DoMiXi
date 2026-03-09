import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (password === correctPassword) {
            const cookieStore = await cookies();
            cookieStore.set('admin_auth', 'true', { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Sai mật khẩu!' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Yêu cầu không hợp lệ' }, { status: 400 });
    }
}
