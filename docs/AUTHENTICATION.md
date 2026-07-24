# 🔐 Authentication Implementation

## Overview

Sistem autentikasi menggunakan JWT (JSON Web Token) dengan dua jenis token:
- **Access Token**: Short-lived token (7 hari) untuk akses API
- **Refresh Token**: Long-lived token (30 hari) untuk mendapatkan access token baru

---

## ✅ Features

### ✅ User Registration
- Register user baru dengan email & password
- Validasi email format
- Validasi password (minimal 8 karakter)
- Password di-hash dengan bcryptjs
- Default role: 'customer'

### ✅ User Login
- Login dengan email & password
- Verifikasi email & password
- Check apakah akun aktif
- Generate access & refresh token
- Update last login timestamp

### ✅ Token Management
- Generate access token (short-lived)
- Generate refresh token (long-lived)
- Refresh access token menggunakan refresh token
- Token validation middleware

### ✅ User Profile
- Get current user profile
- Update profile (name, phone)
- Change password (old password verification)

### ✅ Access Control
- Role-based authorization (Admin, Staff, Customer)
- Token verification middleware
- Role-specific route protection

---

## 🔑 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123",
  "passwordConfirm": "Password@123",
  "name": "John Doe",
  "phone": "+6281234567890"
}

Response (201):
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123"
}

Response (200):
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    }
  }
}
```

#### 3. Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "success": true,
  "message": "Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer"
    }
  }
}
```

---

### Protected Endpoints (Authentication Required)

#### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response (200):
{
  "success": true,
  "message": "Profile berhasil diambil",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+6281234567890",
    "role": "customer",
    "isActive": true,
    "lastLogin": "2026-07-24T10:30:00Z",
    "createdAt": "2026-07-20T08:15:00Z",
    "updatedAt": "2026-07-24T10:30:00Z"
  }
}
```

#### 5. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+6281234567891"
}

Response (200):
{
  "success": true,
  "message": "Profile berhasil diubah",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "phone": "+6281234567891",
    "role": "customer"
  }
}
```

#### 6. Change Password
```http
POST /api/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@456",
  "newPasswordConfirm": "NewPassword@456"
}

Response (200):
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

#### 7. Logout
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response (200):
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 🔐 Default Test Credentials

```
Admin:
  Email: admin@billing-isp.com
  Password: Admin@12345
  Role: admin

Staff:
  Email: staff@billing-isp.com
  Password: Staff@12345
  Role: staff

Customer:
  Email: customer@billing-isp.com
  Password: Customer@12345
  Role: customer
```

---

## 🧪 Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@1234",
    "passwordConfirm":"Test@1234",
    "name":"Test User",
    "phone":"+6281234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@1234"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## 🛡️ Security Features

### Password Security
- ✅ Minimum 8 characters
- ✅ Hashed with bcryptjs (salt rounds: 10)
- ✅ Never returned in API responses
- ✅ Password verification on login

### Token Security
- ✅ Signed with JWT_SECRET
- ✅ Token expiration (access: 7 days, refresh: 30 days)
- ✅ Separate secrets for access & refresh tokens
- ✅ Token validation on every protected request

### Account Security
- ✅ Email uniqueness validation
- ✅ Account active status check
- ✅ Last login tracking
- ✅ Audit logging for auth events

---

**Last Updated:** July 2026