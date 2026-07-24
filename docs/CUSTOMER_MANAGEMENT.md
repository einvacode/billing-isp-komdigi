# 👥 Customer Management API

## Overview

Manajemen data pelanggan ISP dengan fitur lengkap termasuk validasi NPWP, KTP, dan status management.

---

## ✅ Features

### ✅ Customer Operations
- **Create** customer baru (personal, business, government)
- **Read** data customer dengan pagination & filtering
- **Update** data customer (email, phone, address, dll)
- **Delete** customer
- **Search** customer by name, email, account number, company name

### ✅ Validation
- Email validation & uniqueness
- NPWP validation dengan check digit (Luhn algorithm)
- KTP validation (16 digits)
- Account number uniqueness
- Phone number format
- Postal code format

### ✅ Customer Types
- Personal customers
- Business customers (dengan company name & contact person)
- Government customers

### ✅ Status Management
- Active (default)
- Inactive
- Suspended
- Terminated (dengan automatic termination date)

### ✅ Access Control
- Admin: Full CRUD
- Staff: Create, Read, Update, Change Status
- Customer: Read only (own profile)

---

## 🔐 Security

- ✅ JWT token verification on all endpoints
- ✅ Role-based authorization
- ✅ User-scoped data (staff hanya bisa manage customer mereka sendiri)
- ✅ Input validation & sanitization
- ✅ Audit logging

---

## 📊 API Endpoints

### Create Customer
```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "PT Maju Jaya",
  "email": "admin@majujaya.com",
  "phone": "+6281234567890",
  "npwp": "01.234.567.8-901.234",
  "ktp": "3171234567890001",
  "companyName": "PT Maju Jaya Indonesia",
  "businessType": "business",
  "address": "Jl. Gatot Subroto No. 123",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12345",
  "installationAddress": "Jl. Gatot Subroto No. 123 Unit A",
  "installationCity": "Jakarta",
  "installationProvince": "DKI Jakarta",
  "installationPostalCode": "12345",
  "accountNumber": "ACC-2026-001",
  "status": "active",
  "connectionDate": "2026-07-20T00:00:00Z",
  "contactPerson": "Budi Santoso",
  "contactPersonPhone": "+6281234567891",
  "contactPersonEmail": "budi@majujaya.com",
  "taxableStatus": true,
  "notes": "Customer VIP"
}

Response (201):
{
  "success": true,
  "message": "Customer berhasil dibuat",
  "data": {
    "id": "uuid",
    "name": "PT Maju Jaya",
    "email": "admin@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "01.234.567.8-901.234",
    "ktp": "3171234567890001",
    "companyName": "PT Maju Jaya Indonesia",
    "businessType": "business",
    "accountNumber": "ACC-2026-001",
    "status": "active",
    "taxableStatus": true,
    "createdAt": "2026-07-24T10:30:00Z",
    "updatedAt": "2026-07-24T10:30:00Z"
  }
}
```

### Get All Customers (dengan pagination & filtering)
```http
GET /api/customers?page=1&limit=10&status=active&businessType=business&search=maju
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Data customers berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "name": "PT Maju Jaya",
      "email": "admin@majujaya.com",
      "phone": "+6281234567890",
      "npwp": "01.234.567.8-901.234",
      "accountNumber": "ACC-2026-001",
      "status": "active",
      "businessType": "business",
      "taxableStatus": true,
      "createdAt": "2026-07-24T10:30:00Z",
      "updatedAt": "2026-07-24T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `status` - Filter by status (active, inactive, suspended, terminated)
- `businessType` - Filter by business type (personal, business, government)
- `search` - Search by name, email, account number, company name

### Get Customer by ID
```http
GET /api/customers/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Data customer berhasil diambil",
  "data": {
    "id": "uuid",
    "name": "PT Maju Jaya",
    "email": "admin@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "01.234.567.8-901.234",
    "accountNumber": "ACC-2026-001",
    "status": "active",
    ...
  }
}
```

### Get Customer by Account Number
```http
GET /api/customers/account/ACC-2026-001
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Data customer berhasil diambil",
  "data": {
    "id": "uuid",
    "accountNumber": "ACC-2026-001",
    ...
  }
}
```

### Update Customer
```http
PUT /api/customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "PT Maju Jaya Bersama",
  "email": "newemail@majujaya.com",
  "phone": "+6281234567892",
  "npwp": "01.234.567.8-901.234",
  "contactPerson": "Hendra Wijaya",
  "contactPersonPhone": "+6281234567893",
  "notes": "Updated contact info"
}

Response (200):
{
  "success": true,
  "message": "Customer berhasil diubah",
  "data": {
    "id": "uuid",
    "name": "PT Maju Jaya Bersama",
    "email": "newemail@majujaya.com",
    "phone": "+6281234567892",
    "contactPerson": "Hendra Wijaya",
    ...
  }
}
```

### Update Customer Status
```http
PATCH /api/customers/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "suspended"
}

Response (200):
{
  "success": true,
  "message": "Status customer berhasil diubah",
  "data": {
    "id": "uuid",
    "name": "PT Maju Jaya",
    "status": "suspended",
    ...
  }
}

Valid statuses: "active", "inactive", "suspended", "terminated"
```

### Delete Customer
```http
DELETE /api/customers/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Customer berhasil dihapus"
}
```

---

## 🧪 Testing dengan cURL

### 1. Login dulu untuk dapatkan token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"staff@billing-isp.com",
    "password":"Staff@12345"
  }'

# Simpan accessToken dari response
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### 2. Create Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PT Maju Jaya",
    "email": "admin@majujaya.com",
    "phone": "+6281234567890",
    "npwp": "01.234.567.8-901.234",
    "companyName": "PT Maju Jaya Indonesia",
    "businessType": "business",
    "accountNumber": "ACC-2026-001",
    "address": "Jl. Gatot Subroto No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345"
  }'
```

### 3. Get All Customers
```bash
curl -X GET "http://localhost:3000/api/customers?page=1&limit=10&status=active" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get Customer by ID
```bash
curl -X GET http://localhost:3000/api/customers/{customer-id} \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Customer by Account Number
```bash
curl -X GET http://localhost:3000/api/customers/account/ACC-2026-001 \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Update Customer
```bash
curl -X PUT http://localhost:3000/api/customers/{customer-id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PT Maju Jaya Bersama",
    "email": "newemail@majujaya.com",
    "phone": "+6281234567892"
  }'
```

### 7. Update Status
```bash
curl -X PATCH http://localhost:3000/api/customers/{customer-id}/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```

### 8. Delete Customer
```bash
curl -X DELETE http://localhost:3000/api/customers/{customer-id} \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Validation Rules

### Email
- Format: valid email format (user@domain.com)
- Unique: tidak boleh ada duplicate
- Required: wajib diisi

### NPWP (Nomor Pokok Wajib Pajak)
- Format: 15 digits (01.234.567.8-901.234)
- Validation: Check digit menggunakan modulo 11
- Unique: tidak boleh ada duplicate
- Optional: boleh kosong untuk personal non-taxable

**Valid NPWP Format:**
```
01.234.567.8-901.234  (formatted)
012345678901234       (unformatted)
```

**Example Valid NPWPs:**
```
01.234.567.8-901.234
02.345.678.9-012.345
03.456.789.0-123.456
```

### KTP (Kartu Tanda Penduduk)
- Format: 16 digits
- Unique: tidak boleh ada duplicate
- Optional: boleh kosong

**Example Valid KTPs:**
```
3171234567890001
3172345678901234
```

### Account Number
- Format: custom, e.g., ACC-2026-001
- Unique: wajib unik per customer
- Required: wajib diisi

### Phone
- Format: Indonesian phone (0... atau +62...)
- Example: 0812345678 atau +6281234567890

### Business Type
- personal (default)
- business
- government

### Status
- active (default)
- inactive
- suspended
- terminated (auto set termination date)

---

## 🔑 Access Control

| Endpoint | Admin | Staff | Customer |
|----------|-------|-------|----------|
| POST /customers | ✅ | ✅ | ❌ |
| GET /customers | ✅ | ✅ | ❌ |
| GET /customers/:id | ✅ | ✅ | ❌ |
| PUT /customers/:id | ✅ | ✅ | ❌ |
| PATCH /customers/:id/status | ✅ | ✅ | ❌ |
| DELETE /customers/:id | ✅ | ❌ | ❌ |

---

## 📊 Database Schema

```sql
CREATE TABLE Customers (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES Users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  npwp VARCHAR(20) UNIQUE,
  ktp VARCHAR(20) UNIQUE,
  companyName VARCHAR(255),
  businessType ENUM('personal', 'business', 'government'),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postalCode VARCHAR(10),
  installationAddress TEXT,
  installationCity VARCHAR(100),
  installationProvince VARCHAR(100),
  installationPostalCode VARCHAR(10),
  accountNumber VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('active', 'inactive', 'suspended', 'terminated'),
  connectionDate TIMESTAMP,
  terminationDate TIMESTAMP,
  contactPerson VARCHAR(255),
  contactPersonPhone VARCHAR(20),
  contactPersonEmail VARCHAR(255),
  taxableStatus BOOLEAN,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

INDEXES:
- email
- npwp
- ktp
- accountNumber
- userId
- status
- businessType
```

---

**Last Updated:** July 2026
