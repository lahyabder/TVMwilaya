import createMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // 1. Check if it's an admin route (e.g., /ar/admin/..., /fr/admin/..., /admin/...)
    // matches /:locale/admin/* or /admin/*
    const isAdminRoute = pathname.match(/^\/(ar|fr)\/admin/) || pathname.startsWith('/admin');

    if (isAdminRoute) {
        const authCookie = req.cookies.get('tvm_auth');

        // If no cookie, redirect to login
        if (!authCookie || authCookie.value !== 'admin') {
            // Determine locale to redirect to (default to 'ar')
            const localeMatch = pathname.match(/^\/(ar|fr)/);
            const locale = localeMatch ? localeMatch[1] : 'ar';

            const loginUrl = new URL(`/${locale}/login`, req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 2. Otherwise, just do i18n routing
    return intlMiddleware(req);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
