'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export function Header() {
    const t = useTranslations('Common');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === 'ar' ? 'fr' : 'ar';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <header className="bg-tvm-blue text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Logo / Title Area */}
                <div className="flex items-center gap-3">
                    {/* Placeholder for Logo if needed, using text for now */}
                    <div className="text-2xl font-bold leading-tight text-center md:text-start">
                        {t('title')}
                    </div>
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition text-sm font-medium"
                    >
                        <Globe size={18} />
                        {locale === 'ar' ? 'Français' : 'العربية'}
                    </button>
                </div>
            </div>
        </header>
    );
}
