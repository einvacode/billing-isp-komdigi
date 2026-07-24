# 👥 Customer Management Implementation

## Overview

Sistem manajemen pelanggan dengan validasi NPWP, dukungan untuk perorangan dan badan usaha, serta fitur verifikasi data.

---

## ✅ Features

### Customer Types
- **Individual** (Perorangan) - Email & nomor telepon
- **Business** (Badan Usaha) - NPWP, nama badan usaha, jenis usaha

### Validation
- ✅ Email format validation
- ✅ Phone number validation (08XXXXXXXXX or +62XXXXXXXXX)
- ✅ NPWP format validation (XX.XXX.XXX.X-XXX.XXX)
- ✅ Unique email & NPWP per customer
- ✅ Required fields validation

### Features
- ✅ Auto-generated customer number (CUST-YYYY-XXXXXX)
- ✅ NPWP verification workflow
- ✅ Billing address (optional, different from main address)
- ✅ Contact person management
- ✅ Customer status management (active, inactive, suspended, cancelled)
- ✅ Pagination & filtering
- ✅ Full audit trail (createdBy, updatedBy, verifiedBy)

---

## 📊 Database Schema

### Customers Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| customerNumber | String (Unique) | Format: CUST-YYYY-XXXXXX |
| customerName | String | Nama pelanggan / perusahaan |
| email | String (Unique) | Email pelanggan |
| phone | String | Nomor telepon |
| npwp | String (Unique, Optional) | Format: XX.XXX.XXX.X-XXX.XXX |
| npwpName | String | Nama sesuai NPWP |
| customerType | Enum | 'individual' \| 'business' |
| businessType | String | Jenis usaha (PT, CV, dll) |
| businessLicense | String | Nomor izin usaha / SIUP |
| address | Text | Alamat utama |
| city | String | Kota / Kabupaten |
| province | String | Provinsi |
| postalCode | String | Kode pos |
| contactPerson | String | Nama contact person |
| contactPersonPhone | String | Nomor telepon contact person |
| billingAddress | Text | Alamat penagihan (optional) |
| billingCity | String | Kota penagihan |
| billingProvince | String | Provinsi penagihan |
| billingPostalCode | String | Kode pos penagihan |
| status | Enum | 'active' \| 'inactive' \| 'suspended' \| 'cancelled' |
| registrationDate | DateTime | Tanggal registrasi |
| joinDate | DateTime | Tanggal mulai berlangganan |
| notes | Text | Catatan tambahan |
| isVerified | Boolean | Status verifikasi NPWP |
| verifiedAt | DateTime | Waktu verifikasi |
| verifiedBy | UUID | User yang melakukan verifikasi |
| createdBy | UUID | User yang membuat record |
| updatedBy | UUID | User yang mengubah record |
| createdAt | DateTime | Timestamp pembuatan |
| updatedAt | DateTime | Timestamp update |

---

## 🔌 API Endpoints

### Protected Endpoints (All require authentication)

#### 1. Create Customer
```http
POST /api/customers
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "customerName": "PT Maju Jaya Telekomunikasi",
  "email": "contact@majujaya.com",
  "phone": "+6281234567890",
  "customerType": "business",
  "npwp": "12.345.678.9-123.456",
  "npwpName": "PT MAJU JAYA TELEKOMUNIKASI",
  "businessType": "PT",
  "businessLicense": "1234567890123456",
  "address": "Jl. Sudirman No. 123, Blok A",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12190",
  "contactPerson": "Budi Santoso",
  "contactPersonPhone": "+6282345678901",
  "billingAddress": "Jl. Gatot Subroto No. 456",
  "billingCity": "Jakarta",
  "billingProvince": "DKI Jakarta",
  "billingPostalCode": "12930",
  "notes": "Pelanggan korporat, pembayaran via transfer"
}

Response (201):
{
  "success": true,
  "message": "Pelanggan berhasil dibuat",
  "data": {
    "id": "uuid",
    "customerNumber": "CUST-2026-123456",
    "customerName": "PT Maju Jaya Telekomunikasi",
    "email": "contact@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "12.345.678.9-123.456",
    "npwpName": "PT MAJU JAYA TELEKOMUNIKASI",
    "customerType": "business",
    "businessType": "PT",
    "businessLicense": "1234567890123456",
    "address": "Jl. Sudirman No. 123, Blok A",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12190",
    "contactPerson": "Budi Santoso",
    "contactPersonPhone": "+6282345678901",
    "status": "active",
    "isVerified": false,
    "registrationDate": "2026-07-24T15:35:00Z",
    "joinDate": "2026-07-24T15:35:00Z",
    "createdAt": "2026-07-24T15:35:00Z",
    "updatedAt": "2026-07-24T15:35:00Z"
  }
}
```

#### 2. Get All Customers (with Pagination & Filtering)
```http
GET /api/customers?limit=10&offset=0&status=active&customerType=business&search=maju
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Data pelanggan berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "customerNumber": "CUST-2026-123456",
      "customerName": "PT Maju Jaya Telekomunikasi",
      "email": "contact@majujaya.com",
      "phone": "+6281234567890",
      "status": "active",
      "customerType": "business",
      "isVerified": true
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

#### 3. Get Customer by ID
```http
GET /api/customers/{id}
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Data pelanggan berhasil diambil",
  "data": {
    "id": "uuid",
    "customerNumber": "CUST-2026-123456",
    "customerName": "PT Maju Jaya Telekomunikasi",
    "email": "contact@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "12.345.678.9-123.456",
    "npwpName": "PT MAJU JAYA TELEKOMUNIKASI",
    "customerType": "business",
    "businessType": "PT",
    "businessLicense": "1234567890123456",
    "address": "Jl. Sudirman No. 123, Blok A",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12190",
    "contactPerson": "Budi Santoso",
    "contactPersonPhone": "+6282345678901",
    "billingAddress": "Jl. Gatot Subroto No. 456",
    "status": "active",
    "registrationDate": "2026-07-24T15:35:00Z",
    "joinDate": "2026-07-24T15:35:00Z",
    "isVerified": true,
    "verifiedAt": "2026-07-24T16:00:00Z",
    "notes": "Pelanggan korporat, pembayaran via transfer"
  }
}
```

#### 4. Update Customer
```http
PUT /api/customers/{id}
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "customerName": "PT Maju Jaya Telekomunikasi Indonesia",
  "phone": "+6281234567891",
  "contactPerson": "Ani Wijaya",
  "notes": "Update kontak person"
}

Response (200):
{
  "success": true,
  "message": "Data pelanggan berhasil diubah",
  "data": { ... }
}
```

#### 5. Verify NPWP (Admin Only)
```http
POST /api/customers/{id}/verify-npwp
Authorization: Bearer ADMIN_TOKEN

Response (200):
{
  "success": true,
  "message": "NPWP berhasil diverifikasi"
}
```

#### 6. Change Customer Status
```http
PUT /api/customers/{id}/status
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "suspended"
}

Response (200):
{
  "success": true,
  "message": "Status pelanggan berhasil diubah menjadi suspended"
}
```

#### 7. Delete Customer (Soft Delete, Admin Only)
```http
DELETE /api/customers/{id}
Authorization: Bearer ADMIN_TOKEN

Response (200):
{
  "success": true,
  "message": "Pelanggan berhasil dihapus"
}
```

---

## 🔐 Access Control

| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| /api/customers | POST | admin, staff | Buat pelanggan baru |
| /api/customers | GET | admin, staff, customer | Lihat daftar pelanggan |
| /api/customers/:id | GET | admin, staff, customer | Lihat detail pelanggan |
| /api/customers/:id | PUT | admin, staff | Update pelanggan |
| /api/customers/:id | DELETE | admin | Hapus pelanggan |
| /api/customers/:id/verify-npwp | POST | admin | Verifikasi NPWP |
| /api/customers/:id/status | PUT | admin, staff | Ubah status pelanggan |

---

## 🧪 Testing Examples

### Create Business Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "PT Telkom Indonesia",
    "email": "pt.telkom@example.com",
    "phone": "+6281234567890",
    "customerType": "business",
    "npwp": "00.000.000.0-000.000",
    "npwpName": "PT TELKOM INDONESIA",
    "businessType": "PT",
    "businessLicense": "1234567890123456",
    "address": "Jl. Jendral Sudirman Kav. 52-53",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12190"
  }'
```

### Create Individual Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "phone": "+6281234567890",
    "customerType": "individual",
    "address": "Jl. Kemang Timur No. 45",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12730"
  }'
```

### Get All Customers (Filter by Status)
```bash
curl -X GET "http://localhost:3000/api/customers?status=active&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verify NPWP
```bash
curl -X POST http://localhost:3000/api/customers/{customer_id}/verify-npwp \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Change Status to Suspended
```bash
curl -X PUT http://localhost:3000/api/customers/{customer_id}/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```

---

## ✅ Validation Rules

### Email
- Format: valid email address (user@example.com)
- Unique per customer
- Required

### Phone Number
- Format: 08XXXXXXXXXX or +62XXXXXXXXXX
- 9-12 digits
- Required

### NPWP
- Format: XX.XXX.XXX.X-XXX.XXX (contoh: 12.345.678.9-123.456)
- Unique per customer
- Optional untuk perorangan, required untuk badan usaha
- Length: 18 characters with separators

### Customer Number (Auto-generated)
- Format: CUST-YYYY-XXXXXX
- Example: CUST-2026-123456
- Unique per customer

---

## 📝 Notes

1. **Soft Delete**: Customers are soft-deleted by changing status to 'cancelled'
2. **NPWP Verification**: Currently marks as verified, but ready for API integration with Kemenkeu
3. **Billing Address**: Optional field for customers with different billing address
4. **Audit Trail**: All changes tracked with createdBy, updatedBy, verifiedBy fields
5. **Pagination**: Default limit 10, supports custom limit & offset

---

**Last Updated:** July 2026
