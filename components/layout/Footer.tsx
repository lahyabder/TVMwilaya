'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Common');

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
                <p>© {new Date().getFullYear()} - التلقزة الموريتانية / Télévision de Mauritanie</p>
            </div>
        </footer>
    );
}
