'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
// import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(t('error'));
                setLoading(false);
            } else {
                // Fetch session to check role
                const response = await fetch('/api/auth/session');
                const session = await response.json();

                const role = session?.user?.role;

                if (role === 'BRANCH_MANAGER') {
                    // Redirect Branch Manager to Expenses or create expense? or their branch view
                    // Let's send them to their expenses for now, or just /admin/expenses
                    router.push('/admin/expenses');
                } else {
                    // Admin goes to dashboard
                    router.push('/admin');
                }

                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-tvm-blue text-center mb-6">{t('welcome')}</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-tvm-blue"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-tvm-blue"
                            dir="ltr"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-tvm-blue text-white rounded hover:bg-tvm-blue-light transition disabled:opacity-50"
                    >
                        {loading ? t('loading') : t('sign_in')}
                    </button>
                </form>
            </div>
        </div>
    );
}
