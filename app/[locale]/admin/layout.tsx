'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Home, MapPin, Users, PieChart, FileText, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { use } from 'react';

// Layout can be async in Server Components, but this file has 'use client' at top?
// Ah, 'use client' means it's a Client Component. Client Components CANNOT be async.
// But they receive params as a Promise in Next.js 15?
// Actually, for Client Components, params are still passed as props, but we might need to use `use(params)` if it's a promise?
// Wait, layout.tsx is usually a Server Component unless specified.
// I see 'use client' at line 1.
// If it is a client component, it cannot be async.
// However, the error said: "Route ... used params.locale. params is a Promise".
// If it's a Client Component, we should use `use(params)` or just standard props if Next.js unwraps it for client components?
// No, Next.js 15 treats params as Promise even for Client Components in some contexts or maybe I should strictly make it a Server Component and put the interactive parts in a Sidebar component?
// Retaining 'use client' for now, but handling params as Promise using React.use().

export default function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params); // unwrapping with React.use()
    const t = useTranslations('AdminLayout');
    const tNav = useTranslations('AdminLayout.nav');
    const tCommon = useTranslations('Common');
    const pathname = usePathname();

    const navigation = [
        { name: tNav('dashboard'), href: '/admin', icon: Home },
        { name: tNav('branches'), href: '/admin/branches', icon: MapPin },
        { name: tNav('users'), href: '/admin/users', icon: Users },
        { name: tNav('allocations'), href: '/admin/allocations', icon: PieChart },
        { name: tNav('expenses'), href: '/admin/expenses', icon: FileText },
        { name: tNav('settings'), href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50 direction-rtl">
            {/* Sidebar */}
            <div className="w-64 bg-tvm-blue text-white shadow-xl flex flex-col">
                <div className="p-6 border-b border-blue-800">
                    <h1 className="text-xl font-bold">{t('title')}</h1>
                    <p className="text-xs text-blue-200 mt-1">{t('subtitle')}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-800 text-white shadow-sm'
                                        : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5", locale === 'ar' ? 'ml-3' : 'mr-3')} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-blue-800">
                    <button
                        // onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:text-white transition-colors"
                    >
                        <LogOut className={clsx("w-5 h-5", locale === 'ar' ? 'ml-3' : 'mr-3')} />
                        {tCommon('logout')}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex justify-between items-center">
                    <h2 className="text-gray-800 text-lg font-medium">
                        {t('portal_title')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            {t('role_admin')}
                        </div>
                        <div className="w-8 h-8 bg-tvm-blue/10 text-tvm-blue rounded-full flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
