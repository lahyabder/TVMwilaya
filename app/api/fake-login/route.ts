import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const FAKE_USERS = [
    { email: "admin@tvm.local", password: "123456", role: "admin" },
    { email: "user@tvm.local", password: "123456", role: "user" }
];

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = FAKE_USERS.find(u => u.email === email && u.password === password);

        if (user) {
            // Set httpOnly cookie
            const cookieStore = await cookies();
            cookieStore.set('tvm_auth', user.role, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });

            return NextResponse.json({ ok: true, role: user.role });
        }

        return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
    }
}
