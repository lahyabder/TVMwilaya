'use client';

import { createBranch } from '@/actions/branch';
import { useFormStatus } from 'react-dom';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('Branches.create');

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

export default function CreateBranchPage() {
    const t = useTranslations('Branches.create');

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <Link href="/admin/branches" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                    <ArrowRight className="w-4 h-4" />
                    {t('back')}
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={createBranch as any} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
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
                            <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">{t('wilaya_label')}</label>
                            <input
                                type="text"
                                name="wilaya"
                                id="wilaya"
                                required
                                placeholder={t('wilaya_placeholder')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                dir="auto"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('contact_info')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">{t('contact_name')}</label>
                                <input type="text" name="contactName" id="contactName" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" dir="auto" />
                            </div>
                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">{t('contact_phone')}</label>
                                <input type="text" name="contactPhone" id="contactPhone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" dir="ltr" />
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">{t('contact_email')}</label>
                                <input type="email" name="contactEmail" id="contactEmail" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" dir="ltr" />
                            </div>
                            <div>
                                <label htmlFor="contactWhatsapp" className="block text-sm font-medium text-gray-700 mb-1">{t('contact_whatsapp')}</label>
                                <input type="text" name="contactWhatsapp" id="contactWhatsapp" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" dir="ltr" />
                            </div>
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
