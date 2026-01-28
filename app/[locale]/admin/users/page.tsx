import { getUsers } from '@/actions/user';
import { Link } from '@/i18n/routing';
import { Plus, Trash2, User as UserIcon, Shield, MapPin, Pencil } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function UsersPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    // Await params in Server Component
    const { locale } = await params;
    const t = await getTranslations('Users');
    const tTable = await getTranslations('Users.table');
    const result = await getUsers();
    const users = result.success ? result.data : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="flex items-center gap-2 bg-tvm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    {t('add_new')}
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {users?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">{t('empty_state')}</p>
                    </div>
                ) : (
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('name')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('role')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('branch')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">{tTable('email')}</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">{tTable('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN_FINANCE'
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'bg-green-50 text-green-700'
                                            }`}>
                                            <Shield className="w-3 h-3" />
                                            {user.role === 'ADMIN_FINANCE' ? 'Admin' : 'Manager'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.branch ? (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                {user.branch.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link href={`/admin/users/${user.id}/edit`} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition" title={t('edit')}>
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
