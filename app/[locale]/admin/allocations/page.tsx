import { getAllocations } from '@/actions/allocation';
import { Link } from '@/i18n/routing';
import { Plus, Trash2, PieChart, Calendar, FileText, Pencil } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getFormatter } from 'next-intl/server';

export default async function AllocationsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Allocations');
    const tTable = await getTranslations('Allocations.table');
    const format = await getFormatter();

    const result = await getAllocations();
    const allocations = result.success ? result.data : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <Link
                    href="/admin/allocations/create"
                    className="flex items-center gap-2 bg-tvm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    {t('add_new')}
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {allocations?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">{t('empty_state')}</p>
                    </div>
                ) : (
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('reference')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('branch')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('amount')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('date')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('notes')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">{tTable('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {allocations?.map((alloc: any) => (
                                <tr key={alloc.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        {alloc.reference}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                                            {alloc.branch.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-600">
                                        {format.number(alloc.amount, { style: 'currency', currency: 'MRU' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {format.dateTime(new Date(alloc.date), { dateStyle: 'medium' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm italic max-w-xs truncate">
                                        {alloc.notes || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link href={`/admin/allocations/${alloc.id}/edit`} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition" title={t('edit')}>
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
