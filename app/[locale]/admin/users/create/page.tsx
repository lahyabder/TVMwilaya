'use client';

import { createUser } from '@/actions/user';
import { getBranches } from '@/actions/branch';
import { useFormStatus } from 'react-dom';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Users.create');

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-tvm-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
            {pending ? t('saving') : t('save_btn')}
        </button>
    );
}

export default function CreateUserPage() {
    const t = useTranslations('Users.create');
    const [role, setRole] = useState('BRANCH_MANAGER');
    const [branches, setBranches] = useState<any[]>([]);

    useEffect(() => {
        // Fetch branches client-side for dropdown (simplification, could be passed as props)
        // Actually, let's just fetch them via server action inside useEffect for now
        // A better pattern is to fetch in Parent and pass down, but let's keep it simple
        // Note: getBranches is a server action, safe to call
        getBranches().then(res => {
            if (res.success) setBranches(res.data || []);
        });
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <Link href="/admin/users" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                    <ArrowRight className="w-4 h-4" />
                    {t('back')}
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={createUser as any} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('name_label')}</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder={t('name_placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            dir="auto"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('email_label')}</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder={t('email_placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('password_label')}</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">{t('role_label')}</label>
                        <select
                            name="role"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="BRANCH_MANAGER">{t('role_manager')}</option>
                            <option value="ADMIN_FINANCE">{t('role_admin')}</option>
                        </select>
                    </div>

                    {role === 'BRANCH_MANAGER' && (
                        <div>
                            <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">{t('branch_label')}</label>
                            <select
                                name="branchId"
                                id="branchId"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                                <option value="">{t('select_branch')}</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name} ({branch.wilaya})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
