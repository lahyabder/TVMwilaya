#!/bin/bash
set -e

echo "➡️ بدء التحديث..."

cd /var/www/TVMwilaya

git pull origin main

echo "📦 تثبيت الحزم..."
npm install

echo "🏗️ بناء المشروع..."
npm run build

echo "♻️ إعادة تشغيل التطبيق..."
pm2 restart tvm-app

echo "✅ تم التحديث بنجاح"


