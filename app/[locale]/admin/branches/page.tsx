import { getBranches } from '@/actions/branch';
import { Link } from '@/i18n/routing';
import { Plus, Trash2, MapPin, Phone, Mail, MessageCircle, Pencil } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function BranchesPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Branches');
    const tTable = await getTranslations('Branches.table');
    const result = await getBranches();
    const branches = result.success ? result.data : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <Link
                    href="/admin/branches/create"
                    className="flex items-center gap-2 bg-tvm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    {t('add_new')}
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {branches?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">{t('empty_state')}</p>
                        <p className="text-sm">{t('empty_subtitle')}</p>
                    </div>
                ) : (
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('name')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('wilaya')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('contact')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('staff_count')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">{tTable('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {branches?.map((branch: any) => (
                                <tr key={branch.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{branch.name}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            <MapPin className="w-3 h-3" />
                                            {branch.wilaya}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="text-sm space-y-1">
                                            <div className="font-medium text-gray-900">{branch.contactName || '-'}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {branch.contactPhone && (
                                                    <span className="flex items-center gap-1" title="Phone">
                                                        <Phone className="w-3 h-3" /> {branch.contactPhone}
                                                    </span>
                                                )}
                                                {branch.contactWhatsapp && (
                                                    <span className="flex items-center gap-1 text-green-600" title="WhatsApp">
                                                        <MessageCircle className="w-3 h-3" /> {branch.contactWhatsapp}
                                                    </span>
                                                )}
                                            </div>
                                            {branch.contactEmail && (
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {branch.contactEmail}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${branch.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {branch.balance.toLocaleString()} MRU
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{branch._count?.users || 0} Members</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link href={`/admin/branches/${branch.id}/edit`} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition" title={t('edit')}>
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
