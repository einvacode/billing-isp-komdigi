# 👥 Customer Management API Documentation

## Overview

Sistem manajemen customer untuk ISP Billing dengan fitur:
- CRUD (Create, Read, Update, Delete) customer
- NPWP validation dan tracking
- Customer status management (active, inactive, suspended, blocked)
- Credit limit dan balance tracking
- Multiple addresses (service & billing)
- Bank account management
- Customer statistics

---

## 🏛️ Database Schema

### Customer Table

```sql
Columns:
- id (UUID, PK)
- customerCode (VARCHAR 50, UNIQUE) - Auto-generated
- customerName (VARCHAR 255) - Required
- customerType (ENUM: personal, business) - Default: personal
- businessType (VARCHAR 100) - Jenis usaha
- email (VARCHAR 100, UNIQUE) - Required
- phone (VARCHAR 20) - Required
- npwp (VARCHAR 15, UNIQUE) - Optional but unique
- npwpValidated (BOOLEAN) - Flag validasi NPWP
- npwpValidationDate (DATETIME) - Kapan NPWP divalidasi
- identity (VARCHAR 20) - No. KTP/SIM/Paspor
- identityType (ENUM: ktp, sim, passport)
- address (TEXT) - Alamat service - Required
- province, city, zipCode - Lokasi service
- billingAddress (TEXT) - Alamat billing (opsional)
- billingProvince, billingCity, billingZipCode
- contactPerson (VARCHAR 100) - PIC
- contactPersonPhone (VARCHAR 20)
- bankAccountName (VARCHAR 100)
- bankAccountNumber (VARCHAR 30)
- bankName (VARCHAR 100)
- status (ENUM: active, inactive, suspended, blocked)
- creditLimit (DECIMAL 15,2) - Batas kredit
- currentBalance (DECIMAL 15,2) - Saldo piutang
- registrationDate (DATETIME)
- lastActivityDate (DATETIME)
- notes (TEXT) - Catatan internal
- createdBy, updatedBy (UUID) - Audit trail
- createdAt, updatedAt (DATETIME)
```

---

## ✅ NPWP Validation

### Format NPWP
- **Total digit:** 15 digit
- **Format:** `XX.XXX.XXX.X.XXX.XXX` (dengan separator)
- **Contoh valid:** `12.345.678.9-012.345`

### Validasi Dilakukan
✅ Format (15 digit angka)
✅ Uniqueness (tidak boleh duplikat)
✅ Automatic flagging saat registrasi
✅ Validation timestamp tracking

---

## 🔑 API Endpoints

### 1. Create Customer
```http
POST /api/customers
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "customerName": "PT Maju Jaya",
  "customerType": "business",
  "businessType": "Trading",
  "email": "admin@majujaya.com",
  "phone": "+6281234567890",
  "npwp": "12.345.678.9-012.345",
  "identity": "3275012345678901",
  "identityType": "ktp",
  "address": "Jl. Merdeka No. 123, Jakarta",
  "province": "DKI Jakarta",
  "city": "Jakarta Pusat",
  "zipCode": "10110",
  "billingAddress": "Jl. Sudirman No. 456, Jakarta",
  "billingProvince": "DKI Jakarta",
  "billingCity": "Jakarta Selatan",
  "billingZipCode": "12190",
  "contactPerson": "Budi Santoso",
  "contactPersonPhone": "+6281234567891",
  "bankAccountName": "PT Maju Jaya",
  "bankAccountNumber": "1234567890",
  "bankName": "Bank Mandiri",
  "creditLimit": 50000000,
  "notes": "Customer prioritas tier 1"
}

Response (201):
{
  "success": true,
  "message": "Customer berhasil dibuat",
  "data": {
    "id": "uuid-xxx",
    "customerCode": "CUST-2026-0001",
    "customerName": "PT Maju Jaya",
    "customerType": "business",
    "email": "admin@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "12.345.678.9-012.345",
    "npwpValidated": true,
    "npwpValidationDate": "2026-07-24T15:30:00Z",
    "status": "active",
    "creditLimit": 50000000,
    "currentBalance": 0,
    "registrationDate": "2026-07-24T15:30:00Z",
    "createdAt": "2026-07-24T15:30:00Z"
  }
}
```

### 2. Get All Customers
```http
GET /api/customers?page=1&limit=10&status=active&search=PT&sortBy=customerName&sortOrder=ASC
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Customer list retrieved",
  "data": [
    {
      "id": "uuid-xxx",
      "customerCode": "CUST-2026-0001",
      "customerName": "PT Maju Jaya",
      "email": "admin@majujaya.com",
      "phone": "+6281234567890",
      "npwp": "12.345.678.9-012.345",
      "status": "active",
      "creditLimit": 50000000,
      "currentBalance": 0,
      "registrationDate": "2026-07-24T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

**Query Parameters:**
- `page` (default: 1) - Halaman
- `limit` (default: 10, max: 100) - Jumlah per halaman
- `status` (default: active) - Filter status (active, inactive, suspended, blocked)
- `search` - Cari berdasarkan code/name/email/phone/npwp
- `sortBy` (default: createdAt) - Field untuk sorting
- `sortOrder` (default: DESC) - ASC atau DESC

---

### 3. Get Customer by ID
```http
GET /api/customers/:id
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Customer retrieved",
  "data": {
    "id": "uuid-xxx",
    "customerCode": "CUST-2026-0001",
    "customerName": "PT Maju Jaya",
    "customerType": "business",
    "businessType": "Trading",
    "email": "admin@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "12.345.678.9-012.345",
    "npwpValidated": true,
    "identity": "3275012345678901",
    "identityType": "ktp",
    "address": "Jl. Merdeka No. 123, Jakarta",
    "province": "DKI Jakarta",
    "city": "Jakarta Pusat",
    "zipCode": "10110",
    "billingAddress": "Jl. Sudirman No. 456, Jakarta",
    "billingProvince": "DKI Jakarta",
    "billingCity": "Jakarta Selatan",
    "billingZipCode": "12190",
    "contactPerson": "Budi Santoso",
    "contactPersonPhone": "+6281234567891",
    "bankAccountName": "PT Maju Jaya",
    "bankAccountNumber": "1234567890",
    "bankName": "Bank Mandiri",
    "status": "active",
    "creditLimit": 50000000,
    "currentBalance": 0,
    "registrationDate": "2026-07-24T15:30:00Z",
    "lastActivityDate": "2026-07-24T15:30:00Z",
    "notes": "Customer prioritas tier 1",
    "createdAt": "2026-07-24T15:30:00Z",
    "updatedAt": "2026-07-24T15:30:00Z"
  }
}
```

---

### 4. Update Customer
```http
PUT /api/customers/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "customerName": "PT Maju Jaya Indonesia",
  "phone": "+6281234567892",
  "contactPerson": "Siti Nurhaliza",
  "creditLimit": 75000000,
  "notes": "Updated: upgrade ke tier premium"
}

Response (200):
{
  "success": true,
  "message": "Customer berhasil diubah",
  "data": { ...updated customer data... }
}
```

---

### 5. Suspend Customer
```http
POST /api/customers/:id/suspend
Authorization: Bearer TOKEN (Admin/Staff only)
Content-Type: application/json

{
  "reason": "Non-payment for 3 months"
}

Response (200):
{
  "success": true,
  "message": "Customer account berhasil disuspend",
  "data": {
    ...customer data...,
    "status": "suspended"
  }
}
```

---

### 6. Reactivate Customer
```http
POST /api/customers/:id/reactivate
Authorization: Bearer TOKEN (Admin/Staff only)

Response (200):
{
  "success": true,
  "message": "Customer account berhasil diaktifkan",
  "data": {
    ...customer data...,
    "status": "active"
  }
}
```

---

### 7. Delete Customer (Soft Delete)
```http
DELETE /api/customers/:id
Authorization: Bearer TOKEN (Admin only)

Response (200):
{
  "success": true,
  "message": "Customer berhasil dihapus"
}
```

---

### 8. Get Customer Statistics
```http
GET /api/customers/stats/overview
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Customer stats retrieved",
  "data": {
    "active": {
      "total": 150,
      "totalBalance": 500000000,
      "totalCreditLimit": 2500000000
    },
    "byStatus": [
      { "status": "active", "count": 150 },
      { "status": "inactive", "count": 20 },
      { "status": "suspended", "count": 5 },
      { "status": "blocked", "count": 2 }
    ],
    "byType": [
      { "type": "business", "count": 120 },
      { "type": "personal", "count": 57 }
    ]
  }
}
```

---

## 🧪 Testing dengan cURL

### Create Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "PT Maju Jaya",
    "customerType": "business",
    "email": "admin@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "12.345.678.9-012.345",
    "address": "Jl. Merdeka No. 123, Jakarta",
    "creditLimit": 50000000
  }'
```

### Get All Customers
```bash
curl -X GET "http://localhost:3000/api/customers?page=1&limit=10&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Customer by ID
```bash
curl -X GET http://localhost:3000/api/customers/CUSTOMER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Customer
```bash
curl -X PUT http://localhost:3000/api/customers/CUSTOMER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "PT Maju Jaya Indonesia",
    "creditLimit": 75000000
  }'
```

### Suspend Customer
```bash
curl -X POST http://localhost:3000/api/customers/CUSTOMER_ID/suspend \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Non-payment for 3 months"}'
```

### Get Statistics
```bash
curl -X GET http://localhost:3000/api/customers/stats/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✨ Features

### ✅ Customer Creation
- Auto-generated customer code (CUST-YYYY-NNNN)
- NPWP validation (15 digit format)
- Email & NPWP uniqueness check
- Support untuk personal & business customers
- Multiple addresses (service & billing)
- Credit limit tracking

### ✅ Customer Search & Filtering
- Search by: customer code, name, email, phone, NPWP
- Filter by status: active, inactive, suspended, blocked
- Pagination support (max 100 per page)
- Sorting by any field

### ✅ Customer Status Management
- Active: Customer dapat digunakan
- Inactive: Customer dihapus (soft delete)
- Suspended: Customer di-suspend sementara
- Blocked: Customer diblokir

### ✅ Audit Trail
- createdBy & updatedBy tracking
- createdAt & updatedAt timestamps
- Notes untuk mencatat perubahan penting

### ✅ Access Control
- All endpoints require authentication
- Delete/Suspend/Reactivate: Admin only
- Create/Read/Update: Authenticated users

---

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Customer name, email, phone, dan address wajib diisi"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Customer tidak ditemukan"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

**Last Updated:** July 2026
