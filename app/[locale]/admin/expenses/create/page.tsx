'use client';

import { createExpense } from '@/actions/expense';
import { getBranches } from '@/actions/branch';
import { useFormStatus } from 'react-dom';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Expenses.create');

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

export default function CreateExpensePage() {
    const t = useTranslations('Expenses.create');
    const [branches, setBranches] = useState<any[]>([]);

    useEffect(() => {
        getBranches().then(res => {
            if (res.success) setBranches(res.data || []);
        });
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <Link href="/admin/expenses" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                    <ArrowRight className="w-4 h-4" />
                    {t('back')}
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={createExpense as any} className="space-y-6">

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
                        <p className="text-xs text-gray-500 mt-1">Note: Managers will rely on their assigned branch.</p>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">{t('description_label')}</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            required
                            placeholder={t('description_placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            dir="auto"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">{t('amount_label')}</label>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                required
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">{t('category_label')}</label>
                            <select
                                name="category"
                                id="category"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                                <option value="OPERATIONAL">Operational</option>
                                <option value="TRAVEL">Travel</option>
                                <option value="SUPPLIES">Supplies</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
