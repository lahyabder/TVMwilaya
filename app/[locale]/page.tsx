import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
    const t = useTranslations('Auth');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-3xl font-bold text-tvm-blue mb-2">{t('welcome')}</h1>
                <p className="text-gray-600 mb-8">{t('login_subtitle')}</p>

                {/* Login Button */}
                <Link
                    href="/login"
                    className="block w-full py-2.5 px-4 bg-tvm-blue text-white rounded font-medium hover:bg-blue-700 transition"
                >
                    {t('sign_in')}
                </Link>
            </div>
        </div>
    );
}
