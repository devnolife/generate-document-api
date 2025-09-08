# 📄 **Generate Document API - Dynamic Multi-Prodi System**  

Dibuat oleh **devnolife**

## 📌 **Deskripsi**  

Generate Document API adalah aplikasi berbasis Node.js yang memungkinkan pengguna untuk menghasilkan dokumen berdasarkan template yang telah ditentukan. Aplikasi ini menggunakan **Express.js** sebagai server, **Prisma** untuk interaksi database, dan **Docxtemplater** untuk pembuatan dokumen.

### 🆕 **Fitur Terbaru: Dynamic Field Detection**
Sistem terbaru menggunakan **deteksi field dinamis dari database**, menggantikan sistem hardcoded sebelumnya. Setiap program studi dapat memiliki template dan field yang berbeda-beda, dan konfigurasi disimpan di database.

### 📋 **Supported Prodi**

| Prodi | Code | Template Path | Fields Khusus |
|-------|------|---------------|---------------|
| Teknik Informatika | `informatika` | `templates/informatika/kkp.docx` | - |
| Teknik Pengairan | `pengairan` | `templates/pengairan/kkp.docx` | - |
| Teknik Elektro | `elektro` | `templates/elektro/kkp.docx` | - |
| Arsitektur | `arsitektur` | `templates/arsitektur/kkp.docx` | - |
| Perencanaan Wilayah & Kota | `pwk` | `templates/pwk/kkp.docx` | - |

---

## 🏗️ **Struktur Proyek**

```
generate-document-api/
├── api/                          # API utilities dan integrations
│   └── index.js
├── auth/                         # Authentication & validation
│   └── index.js
├── controllers/                  # Request handlers
│   └── index.js
├── prisma/                       # Database configuration
│   ├── index.js
│   ├── schema.prisma
│   ├── seed.js                   # Original seeder
│   ├── seed-documents.js         # Dynamic document seeder
│   └── migrations/
├── routes/                       # API routes
│   ├── index.js                  # Main routes
│   └── document-config.js        # Dynamic field endpoints
├── services/                     # Business logic
│   ├── index.js
│   └── fields.js                 # Dynamic field processing
├── session/                      # Session management
│   └── index.js
├── templates/                    # Document templates per prodi
│   ├── informatika/kkp.docx
│   ├── elektro/kkp.docx
│   ├── arsitektur/kkp.docx
│   ├── pengairan/kkp.docx
│   ├── pwk/kkp.docx
│   ├── output/                   # Generated documents
│   └── qr-code/                  # QR code assets
├── test/                         # Testing suite
│   └── test-dynamic-fields.js
├── utils/                        # Utility functions
│   ├── generate-date.js          # Date processing
│   ├── generate-document.js      # Document generation
│   ├── generate-fields.js        # 🆕 Dynamic field generation
│   └── generate-qrcode.js        # QR code generation
├── package.json
├── server.js                     # Main server
├── .env                          # Environment variables
└── readme.md
```

---

## 🚀 **Instalasi & Setup**

### 1️⃣ Clone Repository  

```bash
git clone https://github.com/devnolife/generate-document-api.git
cd generate-document-api
```

### 2️⃣ Instalasi Dependencies  

```bash
npm install
```

**Main Dependencies:**
- `express` - Web framework
- `@prisma/client` - Database ORM client
- `prisma` - Database toolkit
- `docxtemplater` - Document template engine
- `docxtemplater-image-module-free` - Image module for docx
- `moment` & `moment-hijri` - Date processing
- `qrcode` - QR code generation
- `cors` - Cross-origin resource sharing

### 3️⃣ Konfigurasi Database  

Buat file `.env` di direktori root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/generate_document_db"
```

### 4️⃣ Setup Database  

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database dengan data dokumen dinamis
node prisma/seed-documents.js
```

### 5️⃣ Jalankan Server  

```bash
npm run dev
```

Server akan berjalan di **http://localhost:8080**

---

## 🗄️ **Database Schema**

### **Table: documents**
Menyimpan konfigurasi tipe dokumen untuk setiap prodi.

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| type | string | Jenis dokumen (kkp, surat_tugas, etc) |
| prodi | string | Kode program studi |
| template_path | string | Path ke template .docx |
| description | text | Deskripsi dokumen |
| created_at | timestamp | Waktu dibuat |

**Unique constraint:** `(type, prodi)` - Satu prodi hanya punya satu template per tipe dokumen.

### **Table: document_fields**  
Menyimpan konfigurasi field untuk setiap dokumen.

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| document_id | int | FK ke documents |
| field_name | string | Nama field (kepada, tempat_tujuan, etc) |
| field_type | string | Tipe field (string, date_hijriyah, table, etc) |
| is_required | boolean | Apakah field wajib diisi |
| default_value | text | Nilai default field |
| created_at | timestamp | Waktu dibuat |

---

## 🎨 **Field Types yang Didukung**

Sistem mendukung berbagai tipe field dengan processing yang sesuai:

| Field Type | Description | Contoh Input | Output |
|------------|-------------|--------------|--------|
| `string` | Text biasa | "PT. Tech Indonesia" | "PT. Tech Indonesia" |
| `text` | Text panjang | "Deskripsi proyek..." | "Deskripsi proyek..." |
| `date_hijriyah` | Tanggal Hijriyah | "1445/06/15" | "15 Jumadil Akhir 1445 H" |
| `date_masehi` | Tanggal Masehi | "2024-01-15" | "2024-01-15" |
| `table` | Array data mahasiswa | `[{nama, nim, semester}]` | `[{no: 1, nama, nim, semester}]` |
| `array` | Array umum | `["item1", "item2"]` | `["item1", "item2"]` |
| `number` | Angka | 123 | 123 |
| `boolean` | True/False | true | true |

---

## 🛠️ **API Endpoints**

### **🔹 Generate Document (Multi-Prodi)**

#### `POST /api/generate-document/{type}/{prodi}`
Generate dokumen dengan prodi spesifik.

**Example Request:**
```bash
POST /api/generate-document/kkp/informatika
Content-Type: application/json

{
  "kepada": "PT. Tech Indonesia",
  "tempat_tujuan": "Jakarta",
  "tanggal_hijriyah": "1445/06/15",
  "tanggal_masehi": "2024-01-15",
  "tableData": [
    {
      "nama": "Ahmad Rahman",
      "nim": "2019001",
      "semester": "6"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filePath": "/path/to/informatika_kkp_1694168876543.docx",
    "no_surat": "001/KKP/2024",
    "prodi": "informatika",
    "message": "Dokumen KKP untuk prodi informatika berhasil dibuat"
  }
}
```

### **🔹 Dynamic Field Configuration**

#### `GET /api/document-config/types`
Mendapatkan semua tipe dokumen yang tersedia.

**Response:**
```json
{
  "success": true,
  "data": {
    "kkp": [
      {
        "prodi": "informatika",
        "description": "Template surat KKP untuk Program Studi Informatika",
        "template_path": "templates/informatika/kkp.docx"
      },
      {
        "prodi": "elektro",
        "description": "Template surat KKP untuk Program Studi Teknik Elektro", 
        "template_path": "templates/elektro/kkp.docx"
      }
    ]
  }
}
```

#### `GET /api/document-config/fields/{type}?prodi=xxx`
Mendapatkan field yang tersedia untuk tipe dokumen tertentu.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "kkp",
      "prodi": "informatika",
      "template_path": "templates/informatika/kkp.docx",
      "description": "Template surat KKP untuk Program Studi Informatika",
      "fields": [
        {
          "field_name": "kepada",
          "field_type": "string",
          "is_required": true,
          "default_value": null
        },
        {
          "field_name": "nama_prodi",
          "field_type": "string",
          "is_required": false,
          "default_value": "Informatika"
        },
        {
          "field_name": "tableData",
          "field_type": "table",
          "is_required": true,
          "default_value": null
        }
      ]
    }
  ]
}
```

#### `POST /api/document-config/generate/{type}/{prodi}`
Test endpoint untuk generate fields (debugging).

### **🔹 Legacy Endpoints (Backward Compatible)**

#### `GET /api/templates`
Mendapatkan daftar semua template yang tersedia.

#### `GET /api/templates/{type}/{prodi}/fields`
Mendapatkan field yang diperlukan untuk template tertentu.

#### `POST /api/generate-document/{type}`
Generate dokumen (default ke prodi informatika).

---

## 🧪 **Testing & Development**

### **Manual Testing**
Jalankan test suite untuk memastikan sistem berfungsi:

```bash
node test/test-dynamic-fields.js
```

### **API Testing Commands**

```bash
# 1. Get all document types
curl -X GET "http://localhost:8080/api/document-config/types"

# 2. Get fields for KKP Informatika
curl -X GET "http://localhost:8080/api/document-config/fields/kkp?prodi=informatika"

# 3. Generate KKP document for Elektro
curl -X POST "http://localhost:8080/api/generate-document/kkp/elektro" \
  -H "Content-Type: application/json" \
  -d '{
    "kepada": "PLN Indonesia",
    "tempat_tujuan": "Bandung",
    "tableData": [
      {"nama": "John Doe", "nim": "2019003", "semester": "6"}
    ]
  }'

# 4. Get templates list
curl -X GET "http://localhost:8080/api/templates"

# 5. Get required fields for specific template
curl -X GET "http://localhost:8080/api/templates/kkp/arsitektur/fields"
```

---

## 🔧 **System Architecture**

### **🆕 Dynamic Field System**
Sistem baru menggunakan pendekatan database-driven untuk konfigurasi field:

**Sebelum (Hardcoded):**
```javascript
switch (type) {
  case 'kkp': 
    return { kepada, tempat_tujuan, nama_prodi, ... };
}
```

**Sesudah (Dynamic dari Database):**
```javascript
const document = await prisma.documents.findFirst({
  where: { type, prodi },
  include: { document_fields: true }
});

// Process fields berdasarkan field_type dari database
for (const field of document.document_fields) {
  // Dynamic field processing
}
```

### **Core Functions**

#### `generateFields(type, prodi, body)`
Generate fields berdasarkan konfigurasi database.

```javascript
const result = await generateFields('kkp', 'informatika', {
  kepada: 'PT. Tech',
  tableData: [{nama: 'John', nim: '123'}]
});
```

#### `getAvailableFields(type, prodi?)`
Mendapatkan daftar field yang tersedia.

```javascript
const fields = await getAvailableFields('kkp', 'informatika');
```

#### `getAllDocumentTypes()`
Mendapatkan semua tipe dokumen yang tersedia.

```javascript
const types = await getAllDocumentTypes();
```

---

## 🚀 **Menambah Tipe Dokumen Baru**

Untuk menambahkan tipe dokumen atau prodi baru:

### 1️⃣ Tambah Data ke Database

```javascript
// Tambahkan ke seed file atau manual via Prisma
await prisma.documents.create({
  data: {
    type: 'surat_tugas',
    prodi: 'informatika', 
    template_path: 'templates/informatika/surat_tugas.docx',
    description: 'Surat Tugas Informatika',
    document_fields: {
      create: [
        { 
          field_name: 'nama_pembimbing', 
          field_type: 'string', 
          is_required: true 
        },
        { 
          field_name: 'lokasi_tugas', 
          field_type: 'string', 
          is_required: true 
        }
      ]
    }
  }
});
```

### 2️⃣ Upload Template File
Upload file template ke `templates/informatika/surat_tugas.docx`

### 3️⃣ Test API
Sistem otomatis mendeteksi konfigurasi baru tanpa perlu mengubah kode!

```bash
curl -X GET "http://localhost:8080/api/document-config/fields/surat_tugas?prodi=informatika"
```

---

## 🎯 **Benefits Sistem Baru**

### ✅ **Fleksibilitas**
- Mudah menambah field baru tanpa ubah kode
- Support multiple prodi dengan konfigurasi berbeda
- Konfigurasi terpusat di database

### ✅ **Skalabilitas**  
- Mudah menambah prodi baru
- Support berbagai tipe dokumen
- Template path dinamis per prodi

### ✅ **Maintainability**
- Konfigurasi terpisah dari business logic
- Field processing berdasarkan tipe data
- Include metadata untuk setiap dokumen

### ✅ **Backward Compatibility**
- Endpoint lama masih berfungsi
- Migration bertahap dari sistem lama

---

## 🛠️ **Dependencies**

### **Production Dependencies**
- **Express.js** - Web framework untuk Node.js
- **Prisma** - Database ORM dan toolkit  
- **Docxtemplater** - Template engine untuk dokumen .docx
- **Docxtemplater Image Module** - Module untuk insert gambar/QR
- **Moment.js** - Date/time processing library
- **Moment Hijri** - Hijri calendar support
- **QRCode** - QR code generation
- **Form-Data** - Multipart form data handling
- **CORS** - Cross-origin resource sharing
- **PizZip** - ZIP file processing untuk docx
- **Jimp** - Image processing
- **FS-Extra** - Enhanced file system utilities

### **Development Dependencies**
- **Prisma CLI** - Database schema management

---

## 🔑 **Scripts**

```bash
npm run dev          # Jalankan server dalam mode development dengan watch
npm run seed         # Jalankan original seeder  
npm test             # Jalankan test suite (belum diimplementasi)
```

**Custom Commands:**
```bash
node prisma/seed-documents.js           # Seed dynamic document configuration
node test/test-dynamic-fields.js        # Test dynamic field system
npx prisma studio                       # Open Prisma Studio untuk manage data
npx prisma migrate dev                  # Jalankan database migrations
```

---

## 🔍 **Utilities & Services**

### **Utils:**
- **`generate-date.js`** - Date processing (Hijri & Masehi)
- **`generate-document.js`** - Document generation dengan Docxtemplater  
- **`generate-fields.js`** - 🆕 Dynamic field processing dari database
- **`generate-qrcode.js`** - QR code generation dengan image

### **Services:**
- **`fields.js`** - Business logic untuk field processing
- **`index.js`** - Main document service

### **Controllers:**
- **`index.js`** - Request handlers untuk semua endpoints

### **Routes:**
- **`index.js`** - Main API routes
- **`document-config.js`** - 🆕 Dynamic field configuration endpoints

---

## 🔐 **Environment Variables**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/generate_document_db"

# Server (optional)
PORT=8080
NODE_ENV=development

# API Integrations (optional) 
WHATSAPP_API_URL="https://whatsapp.devnolife.site"
FILE_UPLOAD_API_URL="https://api.devnolife.site"
SURAT_NUMBER_API_URL="https://devnolife.site/api/no-surat"
```

---

## 📊 **Performance & Monitoring**

### **Database Queries**
- Menggunakan Prisma untuk optimized queries
- Include relations untuk mengurangi N+1 queries
- Database indexing pada unique constraints

### **File Processing**
- Template caching untuk performa
- Efficient document generation dengan stream processing
- QR code generation dengan image optimization

---

## 🤝 **Contributing**

Kontribusi sangat diterima! Ikuti langkah berikut:

### **Development Workflow:**
1. Fork repository
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Make changes dan test
4. Commit changes: `git commit -m 'Add: deskripsi fitur'`
5. Push ke branch: `git push origin feature/nama-fitur`
6. Create Pull Request

### **Coding Standards:**
- Gunakan camelCase untuk variables dan functions
- Gunakan async/await untuk asynchronous operations
- Include error handling di semua functions
- Add comments untuk business logic yang kompleks
- Test endpoints sebelum commit

---

## 🐛 **Troubleshooting**

### **Common Issues:**

**Database Connection Error:**
```bash
# Check DATABASE_URL format
# Ensure PostgreSQL is running
# Check network connectivity
```

**Template Not Found:**
```bash
# Check file exists di templates/{prodi}/{type}.docx
# Verify template_path di database
# Check file permissions
```

**Field Not Recognized:**
```bash
# Check field configuration di database
# Verify field_name spelling
# Check field_type support
```

**Document Generation Failed:**
```bash
# Check template syntax (Docxtemplater format)
# Verify data format matches field requirements  
# Check QR code generation dependencies
```

---

## 📋 **Roadmap**

### **Planned Features:**
- [ ] Web-based template editor
- [ ] Field validation berdasarkan field_type
- [ ] Template versioning system
- [ ] Batch document generation
- [ ] Document preview sebelum generate
- [ ] Advanced field types (dropdown, multiselect)
- [ ] Template inheritance system
- [ ] Audit logging untuk document generation

### **Performance Improvements:**
- [ ] Template caching system
- [ ] Background job processing untuk bulk generation
- [ ] CDN integration untuk template storage
- [ ] Redis caching untuk metadata

---

## 📜 **License**  

Proyek ini dilisensikan di bawah **ISC License**.

---

## 📞 **Support & Contact**

**Developer:** devnolife  
**Repository:** [github.com/devnolife/generate-document-api](https://github.com/devnolife/generate-document-api)

Untuk bug report atau feature request, silakan buat issue di GitHub repository.

---

**🎉 Generate Document API - Dynamic Multi-Prodi System siap digunakan!**
