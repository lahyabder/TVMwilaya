'use client';

import { useTranslations } from 'next-intl';

export default function AdminPage() {
    return (
        <div className="bg-white p-8 rounded-lg shadow border border-gray-100">
            <h1 className="text-3xl font-bold text-tvm-blue mb-4">لوحة تحكم الإدارة المالية</h1>
            <p className="text-gray-600">Admin Finance Dashboard - Protected Route</p>
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded border border-green-100">
                تم تسجيل الدخول بنجاح بصلاحية: <strong>ADMIN_FINANCE</strong>
            </div>
        </div>
    );
}
