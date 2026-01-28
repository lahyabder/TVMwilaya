import { getExpenses, updateExpenseStatus } from '@/actions/expense';
import { Link } from '@/i18n/routing';
import { Plus, Check, X, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getFormatter } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

async function approve(id: string) {
    'use server';
    await updateExpenseStatus(id, 'APPROVED');
    revalidatePath('/admin/expenses');
}

async function reject(id: string) {
    'use server';
    await updateExpenseStatus(id, 'REJECTED');
    revalidatePath('/admin/expenses');
}

export default async function ExpensesPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Expenses');
    const tTable = await getTranslations('Expenses.table');
    const tStatus = await getTranslations('Expenses.status');
    const format = await getFormatter();

    const result = await getExpenses();
    const expenses = result.success ? result.data : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <Link
                    href="/admin/expenses/create"
                    className="flex items-center gap-2 bg-tvm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    {t('add_new')}
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {expenses?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">{t('empty_state')}</p>
                    </div>
                ) : (
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('description')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('branch')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('amount')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('status')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('by')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">{tTable('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {expenses?.map((expense: any) => (
                                <tr key={expense.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{expense.description}</span>
                                            <span className="text-xs text-gray-500">{expense.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                                            {expense.branch?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {format.number(expense.amount, { style: 'currency', currency: 'MRU' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {tStatus(expense.status.toLowerCase())}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {expense.user?.name || '-'}
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            {format.dateTime(new Date(expense.date), { dateStyle: 'short' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {expense.status === 'PENDING' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={approve.bind(null, expense.id)}>
                                                    <button className="text-green-600 hover:bg-green-50 p-1.5 rounded transition" title="Approve">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </form>
                                                <form action={reject.bind(null, expense.id)}>
                                                    <button className="text-red-500 hover:bg-red-50 p-1.5 rounded transition" title="Reject">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        )}
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
