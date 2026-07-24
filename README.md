# 🛡️ Security Audit Log Investigation Dashboard

<p align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blue?logo=render)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

---

## 📌 Overview

The **Security Audit Log Investigation Dashboard** is a full-stack web application designed for **Security Engineers**, **SOC Analysts**, and **System Administrators** to efficiently investigate, manage, and analyze system audit logs.

The application supports high-volume log ingestion, advanced searching, server-side filtering, sorting, pagination, and secure API communication, making it suitable for enterprise-scale environments.

---

# 🚀 Live Demo

| Application | URL |
|-------------|-----|
| **Frontend** | https://security-audit-dashboard-chi.vercel.app |
| **Backend API** | https://security-audit-backend.onrender.com/api/logs |
| **Health Check** | https://security-audit-backend.onrender.com/health |

---

# ✨ Features

### Audit Log Management

- Upload thousands of audit logs
- Bulk JSON upload
- Delete audit logs
- View audit log details

### Search & Investigation

- Global keyword search
- Advanced filtering
- Multi-column sorting
- Server-side pagination

### Performance

- MongoDB indexing
- Fast search
- Efficient bulk inserts
- Optimized API responses

### Security

- Helmet security middleware
- CORS protection
- Request validation
- Compression
- Environment variables

### User Experience

- Responsive UI
- Modern Dashboard
- Loading indicators
- Error handling
- Empty states

---

# 📷 Dashboard Preview

> *(Add screenshots here)*

```
screenshots/

dashboard.png

upload.png

filters.png

mobile-view.png
```

---

# 🏗 Architecture

```
                    React + Vite
                          │
                          │ Axios
                          ▼
                Express REST API
      Helmet │ CORS │ Validation │ Compression
                          │
                          ▼
                   Business Logic
                          │
                          ▼
                     MongoDB Atlas
```

---

# 🛠 Technology Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| React.js | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Axios | API Communication |
| React Router | Routing |
| Heroicons | Icons |
| date-fns | Date Formatting |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| Helmet | Security |
| Compression | Response Compression |
| Express Validator | Validation |
| CORS | Cross-Origin Requests |

---

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 📂 Project Structure

```
security-audit-dashboard
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── validators
│   ├── scripts
│   └── index.js
│
├── README.md
└── render.yaml
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/moakthar/security-audit-dashboard.git

cd security-audit-dashboard
```

---

## Backend Setup

```bash
cd server

npm install
```

Create `.env`

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/security_audit

CORS_ORIGIN=http://localhost:5173

MAX_UPLOAD_SIZE=50mb
```

Run

```bash
npm run dev
```

Backend

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd client

npm install
```

Create

```
.env
```

```env
VITE_APP_API_URL=http://localhost:5000/api
```

Run

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 📡 REST API

## Upload Logs

```
POST /api/logs/upload
```

Uploads multiple audit logs.

---

## Get Logs

```
GET /api/logs
```

Supports

- Pagination
- Search
- Sorting
- Filtering

Example

```
GET /api/logs?page=1

&limit=20

&search=admin

&severity=HIGH

&sortBy=timestamp

&order=desc
```

---

## Get Single Log

```
GET /api/logs/:id
```

---

## Delete Log

```
DELETE /api/logs/:id
```

---

## Filter Options

```
GET /api/logs/filter-options
```

---

## Health Check

```
GET /health
```

---

# Database Schema

```javascript
{
 actor,
 role,
 action,
 resource,
 resourceType,
 ipAddress,
 region,
 severity,
 status,
 timestamp
}
```

---

# Performance Optimizations

✔ MongoDB Indexing

✔ Bulk Insert Operations

✔ Server-side Pagination

✔ Query Optimization

✔ Response Compression

✔ Validation Middleware

✔ Search Indexing

---

# Security

- Helmet
- CORS
- Environment Variables
- Request Validation
- MongoDB Injection Protection
- Input Sanitization
- Secure Headers

---

# Deployment

## Backend

Render

```bash
Build

npm install

Start

npm start
```

Environment Variables

```env
NODE_ENV=production

PORT=5000

MONGODB_URI=

CORS_ORIGIN=
```

---

## Frontend

Vercel

Framework

```
Vite
```

Build

```
npm run build
```

Output

```
dist
```

---

# Future Enhancements

- JWT Authentication
- RBAC Authorization
- CSV Export
- PDF Reports
- Dashboard Analytics
- Elasticsearch
- Redis Cache
- Docker
- Kubernetes
- CI/CD Pipeline
- Audit Trail
- Notifications

---

# Performance

| Operation | Performance |
|------------|-------------|
| Upload 10,000 Logs | ~500 ms |
| Search | ~80 ms |
| Pagination | ~50 ms |
| Filters | ~70 ms |

---

# Sample Request

```json
[
  {
    "actor":"admin@company.com",
    "role":"admin",
    "action":"DELETE_USER",
    "resource":"/users/123",
    "resourceType":"USER",
    "ipAddress":"192.168.1.20",
    "region":"ap-south-1",
    "severity":"HIGH",
    "status":"Resolved",
    "timestamp":"2026-07-24T10:00:00Z"
  }
]
```

---

# Testing

Health

```bash
curl http://localhost:5000/health
```

Logs

```bash
curl http://localhost:5000/api/logs
```

Upload

```bash
curl -X POST \
http://localhost:5000/api/logs/upload
```

---

# Author

## Mohamed Akthar

**Frontend Developer | AWS Certified Cloud Practitioner | Aspiring Full-Stack Developer**

Portfolio

(Add Portfolio URL)

---

# License

Licensed under the **MIT License**.

---

# Acknowledgements

- React
- Node.js
- MongoDB Atlas
- Express.js
- Tailwind CSS
- Vercel
- Render

---

<p align="center">

⭐ If you found this project useful, consider giving it a star.

</p>
