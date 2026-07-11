#!/bin/bash

# Pastikan script ini menggunakan LF line endings (Linux/Unix format)
echo "=== MEMULAI STARTUP SCRIPT CUSTOM LARAVEL ==="

# 1. Salin konfigurasi Nginx kustom ke folder konfigurasi aktif
if [ -f "/home/site/wwwroot/azure/nginx.conf" ]; then
    echo "Menyalin konfigurasi Nginx kustom..."
    cp /home/site/wwwroot/azure/nginx.conf /etc/nginx/sites-available/default
    
    echo "Reloading Nginx service..."
    service nginx reload
else
    echo "PERINGATAN: Konfigurasi Nginx kustom tidak ditemukan di /home/site/wwwroot/azure/nginx.conf"
fi

# 2. Pindah ke direktori root aplikasi
cd /home/site/wwwroot

# 3. Jalankan migrasi database secara otomatis (bersifat opsional tapi direkomendasikan)
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Menjalankan migrasi database..."
    php artisan migrate --force
fi

# 4. Bersihkan dan bangun cache Laravel untuk performa produksi
echo "Membangun cache konfigurasi dan rute Laravel..."
php artisan optimize:clear
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# 5. Konfigurasi symbolic link untuk storage
echo "Mengonfigurasi symbolic link untuk storage..."
if [ -e "public/storage" ] || [ -L "public/storage" ]; then
    echo "Menghapus link/folder public/storage yang sudah ada..."
    rm -rf public/storage
fi
php artisan storage:link

# 6. Hapus file public/hot reload jika ada
if [ -f "public/hot" ]; then
    echo "Menghapus file public/hot reload..."
    rm -f public/hot
fi

echo "=== STARTUP SCRIPT SELESAI ==="
