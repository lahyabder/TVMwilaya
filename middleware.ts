import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => token != null
        },
        pages: {
            signIn: '/login'
        }
    }
);

export default function middleware(req: NextRequest) {
    // 1. Identify if it's an API route or public asset (skip both) 
    //    (Already handled by config.matcher mostly, but safe to check)

    const pathname = req.nextUrl.pathname;

    // 2. If it's the Admin Portal, enforce Auth
    //    We check against /admin or /ar/admin or /fr/admin
    const isAdminRoute =
        pathname.startsWith('/admin') ||
        pathname.match(/^\/(ar|fr)\/admin/);

    if (isAdminRoute) {
        return (authMiddleware as any)(req);
    }

    // 3. Otherwise, just do i18n routing (public pages like /login, /about, /)
    return intlMiddleware(req);
}

export const config = {
    // Match only internationalized pathnames
    // Skip /api, /_next, files with extensions
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
