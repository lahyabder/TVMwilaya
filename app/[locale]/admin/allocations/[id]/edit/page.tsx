'use client';

import { updateAllocation, getAllocation } from '@/actions/allocation';
import { getBranches } from '@/actions/branch';
import { useFormStatus } from 'react-dom';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, use } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Allocations.create');

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

export default function EditAllocationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const t = useTranslations('Allocations.create');
    const [branches, setBranches] = useState<any[]>([]);
    const [allocation, setAllocation] = useState<any>(null);

    useEffect(() => {
        getBranches().then(res => {
            if (res.success) setBranches(res.data || []);
        });
        getAllocation(id).then(res => {
            if (res.success && res.data) {
                setAllocation(res.data);
            }
        });
    }, [id]);

    if (!allocation) return <div className="p-8">Loading...</div>;

    const updateAllocationWithId = updateAllocation.bind(null, id);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Edit Allocation</h1>
                <Link href="/admin/allocations" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                    <ArrowRight className="w-4 h-4" />
                    {t('back')}
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={updateAllocationWithId as any} className="space-y-6">

                    <div>
                        <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">{t('branch_label')}</label>
                        <select
                            name="branchId"
                            id="branchId"
                            required
                            defaultValue={allocation.branchId}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">{t('amount_label')}</label>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                required
                                step="0.01"
                                defaultValue={allocation.amount}
                                placeholder={t('amount_placeholder')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">{t('reference_label')}</label>
                            <input
                                type="text"
                                name="reference"
                                id="reference"
                                required
                                defaultValue={allocation.reference}
                                placeholder={t('reference_placeholder')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                dir="auto"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">{t('notes_label')}</label>
                        <textarea
                            name="notes"
                            id="notes"
                            rows={3}
                            defaultValue={allocation.notes || ''}
                            placeholder={t('notes_placeholder')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            dir="auto"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
