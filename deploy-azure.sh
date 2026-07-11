#!/bin/bash

# ==============================================================================
# SCRIPT DEPLOYMENT LARAVEL KE AZURE APP SERVICE MENGGUNAKAN AZURE CLI
# ==============================================================================
# Pastikan Anda telah menginstal Azure CLI (`az`) dan utility `zip` di sistem Anda.
# Jalankan script ini dengan perintah: chmod +x deploy-azure.sh && ./deploy-azure.sh
# ==============================================================================

# Keluar dari script jika terjadi error di salah satu baris perintah
set -e

# --- KONFIGURASI VARIABEL AZURE (Sesuaikan dengan akun Azure Anda) ---
RESOURCE_GROUP="rg-hallogic-production"       # Nama Resource Group di Azure
LOCATION="southeastasia"                      # Lokasi server Azure (misal: eastus, southeastasia)
PLAN_NAME="plan-hallogic-service"             # Nama App Service Plan
APP_NAME="hallogic-app"                       # Nama Web App Anda (harus unik di Azure)
PHP_VERSION="8.4"                             # Versi PHP yang digunakan di Azure App Service
RUN_MIGRATIONS="true"                         # Jalankan migrasi database otomatis saat startup
SUBSCRIPTION_ID=""                            # (Opsional) ID Subscription Azure Anda jika memiliki lebih dari satu

# --- OPSI PEMBUATAN DATABASE MYSQL (Azure Database for MySQL Flexible Server) ---
CREATE_DATABASE="true"                        # Set ke "true" jika ingin membuat database MySQL otomatis di Azure
DB_SERVER_NAME="hallogic-mysql-srv"           # Nama server MySQL (harus unik secara global di Azure, gunakan lowercase, angka, dan dash)
DB_ADMIN_USER="dbadmin"                       # Username Administrator database
DB_ADMIN_PASSWORD=""                          # Password Administrator (kosongkan untuk generate acak otomatis)

# --- ENVIRONMENT SECRETS MANUAL (Hanya diisi jika CREATE_DATABASE="false") ---
APP_KEY_PROD="base64:YV85tjo7Klq5aXOvHk93tPMAax/mmbFqLdwZoUyNQuE=" # Masukkan APP_KEY produksi Anda
DB_CONNECTION_PROD="mysql"                    # Koneksi database (mysql, pgsql, sqlite)
DB_HOST_PROD=""                               # Host database produksi (kosongkan jika menggunakan CREATE_DATABASE="true")
DB_PORT_PROD="3306"                           # Port database
DB_DATABASE_PROD="hallogic"                   # Nama database produksi (untuk CREATE_DATABASE="true", ini nama DB yang akan dibuat)
DB_USERNAME_PROD=""                           # Username database (kosongkan jika menggunakan CREATE_DATABASE="true")
DB_PASSWORD_PROD=""                           # Password database (kosongkan jika menggunakan CREATE_DATABASE="true")

echo "=========================================================="
echo "    MEMULAI PROSES DEPLOYMENT LARAVEL KE AZURE"
echo "=========================================================="

# 1. VERIFIKASI UTILITY YANG DIBUTUHKAN
echo "[1/8] Memeriksa kebutuhan sistem lokal..."
if ! command -v az &> /dev/null; then
    echo "ERROR: Azure CLI ('az') tidak terinstal. Silakan instal terlebih dahulu."
    exit 1
fi

if ! command -v zip &> /dev/null; then
    echo "ERROR: Utility 'zip' tidak terinstal. Silakan instal terlebih dahulu (e.g. sudo apt install zip)."
    exit 1
fi
echo "✓ Semua utility yang dibutuhkan terinstal."

# 2. LOGIN AZURE & PILIH SUBSCRIPTION
echo "[2/8] Memeriksa koneksi login Azure..."
# Mengecek apakah user sudah login ke Azure CLI
if ! az account show &> /dev/null; then
    echo "Anda belum login ke Azure. Membuka browser untuk login..."
    az login
else
    echo "✓ Anda sudah terhubung ke akun Azure."
fi

# Set Subscription jika diisi oleh user
if [ -n "$SUBSCRIPTION_ID" ]; then
    echo "Mengatur subscription aktif ke: $SUBSCRIPTION_ID"
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# 3. BUAT / PASTIKAN RESOURCE AZURE ADA
echo "[3/8] Memverifikasi Resource Group, App Service Plan, dan Web App..."

# Cek apakah Resource Group sudah ada, jika belum buat baru
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo "Resource Group tidak ditemukan. Membuat Resource Group baru di $LOCATION..."
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
else
    echo "✓ Resource Group '$RESOURCE_GROUP' siap."
fi

# Cek apakah App Service Plan sudah ada, jika belum buat baru (default menggunakan Linux SKU B1)
if ! az appservice plan show --name "$PLAN_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "App Service Plan tidak ditemukan. Membuat Plan baru (Linux, SKU B1)..."
    az appservice plan create \
        --name "$PLAN_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --is-linux \
        --sku B1
else
    echo "✓ App Service Plan '$PLAN_NAME' siap."
fi

# Cek apakah Web App sudah ada, jika belum buat baru dengan runtime PHP
if ! az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "Web App '$APP_NAME' tidak ditemukan. Membuat Web App baru dengan PHP $PHP_VERSION..."
    az webapp create \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$PLAN_NAME" \
        --runtime "PHP|$PHP_VERSION"
else
    echo "✓ Web App '$APP_NAME' siap."
fi

# Cek apakah perlu membuat database MySQL Flexible Server otomatis
if [ "$CREATE_DATABASE" = "true" ]; then
    echo "Memverifikasi database MySQL Flexible Server..."
    
    # Cek apakah server MySQL sudah ada
    if ! az mysql flexible-server show --resource-group "$RESOURCE_GROUP" --name "$DB_SERVER_NAME" &> /dev/null; then
        echo "Server MySQL '$DB_SERVER_NAME' tidak ditemukan. Membuat baru..."
        
        # Generate password jika kosong
        if [ -z "$DB_ADMIN_PASSWORD" ]; then
            # Coba baca password dari .env lokal sebagai default
            ENV_PASS=$(grep '^DB_PASSWORD=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" || echo "")
            if [ -n "$ENV_PASS" ]; then
                DB_ADMIN_PASSWORD="$ENV_PASS"
                echo "Menggunakan password dari .env lokal: $DB_ADMIN_PASSWORD"
            else
                # Generate password acak yang kuat (huruf besar, kecil, angka, dan spesial)
                DB_ADMIN_PASSWORD=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 12)$(tr -dc '!#%^' < /dev/urandom | head -c 4)
                echo "Password Admin MySQL di-generate otomatis: $DB_ADMIN_PASSWORD"
                echo "PENTING: Simpan password ini baik-baik!"
            fi
        fi
        
        # Buat flexible-server (menggunakan Standard_B1ms, tier termurah dan hemat biaya)
        az mysql flexible-server create \
            --resource-group "$RESOURCE_GROUP" \
            --name "$DB_SERVER_NAME" \
            --location "$LOCATION" \
            --admin-user "$DB_ADMIN_USER" \
            --admin-password "$DB_ADMIN_PASSWORD" \
            --database-name "$DB_DATABASE_PROD" \
            --sku-name Standard_B1ms \
            --yes
            
        # Tambahkan aturan firewall agar Azure Services (termasuk App Service) bisa mengakses DB ini
        echo "Mengonfigurasi firewall rule agar App Service dapat mengakses database..."
        az mysql flexible-server firewall-rule create \
            --resource-group "$RESOURCE_GROUP" \
            --name "$DB_SERVER_NAME" \
            --rule-name AllowAllAzureServices \
            --start-ip-address 0.0.0.0 \
            --end-ip-address 0.0.0.0
    else
        echo "✓ Server MySQL '$DB_SERVER_NAME' siap."
        # Jika server sudah ada dan DB_ADMIN_PASSWORD kosong di script, coba baca dari .env lokal
        if [ -z "$DB_ADMIN_PASSWORD" ]; then
            ENV_PASS=$(grep '^DB_PASSWORD=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" || echo "")
            if [ -n "$ENV_PASS" ]; then
                DB_ADMIN_PASSWORD="$ENV_PASS"
                echo "Mendeteksi database sudah ada. Menggunakan password dari .env lokal."
            else
                echo "ERROR: Server MySQL sudah ada tetapi DB_ADMIN_PASSWORD kosong di script dan tidak ditemukan di .env."
                echo "Silakan isi DB_ADMIN_PASSWORD di bagian atas script."
                exit 1
            fi
        fi
        
        # Menyelaraskan password database Azure agar cocok dengan password lokal
        echo "Menyelaraskan password database di Azure dengan password lokal..."
        az mysql flexible-server update \
            --resource-group "$RESOURCE_GROUP" \
            --name "$DB_SERVER_NAME" \
            --admin-password "$DB_ADMIN_PASSWORD"
    fi
    
    # Matikan require_secure_transport agar Laravel dapat terhubung tanpa konfigurasi sertifikat SSL lokal
    echo "Memastikan kewajiban SSL (require_secure_transport=OFF) dinonaktifkan pada server MySQL..."
    az mysql flexible-server parameter set \
        --resource-group "$RESOURCE_GROUP" \
        --server-name "$DB_SERVER_NAME" \
        --name require_secure_transport \
        --value OFF
    
    # Otomatis isi variabel koneksi produksi dengan info server yang telah siap
    DB_CONNECTION_PROD="mysql"
    DB_HOST_PROD="$DB_SERVER_NAME.mysql.database.azure.com"
    DB_PORT_PROD="3306"
    DB_USERNAME_PROD="$DB_ADMIN_USER"
    DB_PASSWORD_PROD="$DB_ADMIN_PASSWORD"
fi

# 4. KONFIGURASI WEB APP SETTINGS
echo "[4/8] Mengonfigurasi pengaturan Azure Web App..."

# Pastikan file startup.sh memiliki permission execute sebelum di-zip
chmod +x azure/startup.sh

# Mengatur startup command agar mengarah ke startup script custom kita
echo "Mengatur startup script ke '/home/site/wwwroot/azure/startup.sh'..."
az webapp config set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --startup-file "/home/site/wwwroot/azure/startup.sh"

# Menambahkan environment variables esensial Laravel ke Azure
echo "Mengatur environment variables dasar Laravel..."

# Definisikan settings dasar
SETTINGS_ARGS=(
    APP_ENV=production
    APP_DEBUG=false
    RUN_MIGRATIONS="$RUN_MIGRATIONS"
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
    ENABLE_ORYX_BUILD=true
)

# Masukkan APP_KEY jika sudah diset
if [ -n "$APP_KEY_PROD" ]; then
    SETTINGS_ARGS+=(APP_KEY="$APP_KEY_PROD")
fi

# Masukkan database secrets jika host database diset
if [ -n "$DB_HOST_PROD" ]; then
    SETTINGS_ARGS+=(
        DB_CONNECTION="$DB_CONNECTION_PROD"
        DB_HOST="$DB_HOST_PROD"
        DB_PORT="$DB_PORT_PROD"
        DB_DATABASE="$DB_DATABASE_PROD"
        DB_USERNAME="$DB_USERNAME_PROD"
        DB_PASSWORD="$DB_PASSWORD_PROD"
    )
fi

az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --settings "${SETTINGS_ARGS[@]}"

# 5. KOMPILASI ASET SECARA LOKAL (Vite/React)
echo "[5/8] Mengompilasi aset frontend (Vite/React) secara lokal..."
npm install
npm run build

# 6. MEMBUAT ZIP ARCHIVE UNTUK DEPLOYMENT
echo "[6/8] Membuat file ZIP deployment (deploy.zip)..."
ZIP_FILE="deploy.zip"

# Hapus deploy.zip lama jika ada
rm -f "$ZIP_FILE"

# Mengompresi seluruh isi proyek, mengecualikan node_modules, vendor (akan diinstal otomatis di Azure), git history, folder tes, dan file lokal/sensitif
zip -r "$ZIP_FILE" . -x \
    "node_modules/*" \
    "vendor/*" \
    ".git/*" \
    "tests/*" \
    ".env" \
    "deploy.zip" \
    "deploy-azure.sh" \
    "public/storage*" \
    "public/hot" \
    "storage/logs/*" \
    "storage/app/public/*" \
    "storage/framework/cache/*" \
    "storage/framework/sessions/*" \
    "storage/framework/views/*" \
    ".phpunit.result.cache"

echo "✓ File $ZIP_FILE berhasil dibuat."

# 7. UPLOAD & DEPLOY ZIP KE AZURE APP SERVICE
echo "[7/8] Mengunggah dan melakukan deploy ke Azure App Service..."
az webapp deploy \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --src-path "$ZIP_FILE" \
    --type zip

echo "✓ Upload dan deployment berhasil selesai!"

# 8. MEMBERSIHKAN FILE TEMPORER
echo "[8/8] Melakukan pembersihan file temporer..."
rm -f "$ZIP_FILE"

echo "=========================================================="
echo "          DEPLOYMENT BERHASIL SELESAI!"
echo "=========================================================="
echo "URL Aplikasi Anda: https://$APP_NAME.azurewebsites.net"
echo ""

# Periksa apakah secrets sudah terisi
if [ -z "$APP_KEY_PROD" ] || [ -z "$DB_HOST_PROD" ]; then
    echo "PENTING: Beberapa environment secrets belum dikonfigurasi secara otomatis."
    echo "Silakan jalankan perintah Azure CLI lengkap di bawah ini untuk mengatur secrets Anda:"
    echo ""
    echo "az webapp config appsettings set \\"
    echo "    --resource-group \"$RESOURCE_GROUP\" \\"
    echo "    --name \"$APP_NAME\" \\"
    echo "    --settings \\"
    
    if [ -z "$APP_KEY_PROD" ]; then
        # Mengambil app key dari mesin lokal sebagai referensi/default jika ada
        LOCAL_KEY=$(grep '^APP_KEY=' .env | cut -d '=' -f2- || echo "")
        if [ -n "$LOCAL_KEY" ]; then
            echo "        APP_KEY=\"$LOCAL_KEY\" \\"
        else
            echo "        APP_KEY=\"<isi-app-key-produksi>\" \\"
        fi
    else
        echo "        APP_KEY=\"$APP_KEY_PROD\" \\"
    fi

    echo "        DB_CONNECTION=\"$DB_CONNECTION_PROD\" \\"
    echo "        DB_HOST=\"<host_database_azure>\" \\"
    echo "        DB_PORT=\"$DB_PORT_PROD\" \\"
    echo "        DB_DATABASE=\"<nama_database>\" \\"
    echo "        DB_USERNAME=\"<username_database>\" \\"
    echo "        DB_PASSWORD=\"<password_database>\""
    echo ""
    echo "Atau Anda dapat mengaturnya melalui Azure Portal di menu: Settings -> Configuration -> Application settings."
else
    echo "✓ Semua environment secrets telah berhasil dikonfigurasi ke Azure App Service!"
fi
echo "=========================================================="
