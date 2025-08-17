# 📡 API Documentation

## 📋 **Overview**

InvoiceGen Pro provides a RESTful API for managing users, clients, and invoices. All API endpoints require authentication except for registration and login.

## 🔗 **Base URL**
- **Development**: `http://localhost:5001/api`
- **Production**: `https://your-backend.railway.app/api`

## 🔐 **Authentication**

### **JWT Token Authentication**
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **Token Expiration**
- **Default**: 7 days
- **Refresh**: Re-login required after expiration

---

## 👤 **Authentication Endpoints**

### **POST /auth/register**
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "free",
    "invoiceCount": 0,
    "monthlyInvoiceLimit": 5
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Validation errors
- `409`: Email already exists

### **POST /auth/login**
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "free"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid credentials
- `404`: User not found

### **GET /auth/me**
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "free",
    "invoiceCount": 3,
    "monthlyInvoiceLimit": 5
  }
}
```

---

## 👥 **Client Endpoints**

### **GET /clients**
Get all clients for the authenticated user.

**Query Parameters:**
- `search` (optional): Search by name, email, or company
- `status` (optional): Filter by status (active/inactive)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "clients": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Michael Chen",
      "email": "michael@techcorp.com",
      "company": "TechCorp Industries",
      "phone": "(555) 987-6543",
      "address": {
        "street": "456 Corporate Blvd",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94105",
        "country": "United States"
      },
      "preferredPaymentTerms": "Net 30",
      "taxExempt": false,
      "totalInvoiced": 15000.00,
      "totalPaid": 12000.00,
      "outstandingBalance": 3000.00,
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalClients": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### **POST /clients**
Create a new client.

**Request Body:**
```json
{
  "name": "Emma Rodriguez",
  "email": "emma@startupxyz.com",
  "company": "StartupXYZ",
  "phone": "(555) 234-5678",
  "address": {
    "street": "789 Innovation Dr",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "country": "United States"
  },
  "preferredPaymentTerms": "Net 15",
  "taxExempt": true,
  "notes": "Fast-growing startup, needs quick turnaround"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "client": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "Emma Rodriguez",
    "email": "emma@startupxyz.com",
    "company": "StartupXYZ",
    "totalInvoiced": 0,
    "totalPaid": 0,
    "outstandingBalance": 0,
    "status": "active",
    "createdAt": "2024-01-16T14:20:00Z"
  }
}
```

### **GET /clients/:id**
Get a specific client by ID.

**Response (200):**
```json
{
  "success": true,
  "client": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Michael Chen",
    "email": "michael@techcorp.com",
    // ... full client data
  }
}
```

### **PUT /clients/:id**
Update a client.

**Request Body:** (Same as POST, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "client": {
    // ... updated client data
  }
}
```

### **DELETE /clients/:id**
Delete a client.

**Response (200):**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

### **GET /clients/stats**
Get client statistics for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total": {
      "count": 5,
      "totalInvoiced": 45000.00,
      "totalPaid": 38000.00,
      "outstanding": 7000.00
    },
    "byStatus": {
      "active": 4,
      "inactive": 1
    },
    "topClients": [
      {
        "name": "TechCorp Industries",
        "totalInvoiced": 15000.00,
        "totalPaid": 12000.00
      }
    ]
  }
}
```

---

## 📄 **Invoice Endpoints**

### **GET /invoices**
Get all invoices for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status
- `clientEmail` (optional): Filter by client
- `search` (optional): Search by invoice number or client
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "invoices": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "invoiceNumber": "INV-001",
      "clientName": "Michael Chen",
      "clientEmail": "michael@techcorp.com",
      "items": [
        {
          "description": "E-commerce Website Development",
          "quantity": 1,
          "unitPrice": 8500.00,
          "total": 8500.00
        }
      ],
      "subtotal": 8500.00,
      "taxRate": 8.25,
      "taxAmount": 701.25,
      "total": 9201.25,
      "status": "sent",
      "dueDate": "2024-02-15T00:00:00Z",
      "issueDate": "2024-01-16T00:00:00Z",
      "sentAt": "2024-01-16T15:30:00Z",
      "createdAt": "2024-01-16T15:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalInvoices": 1
  }
}
```

### **POST /invoices**
Create a new invoice.

**Request Body:**
```json
{
  "clientName": "Michael Chen",
  "clientEmail": "michael@techcorp.com",
  "clientAddress": {
    "street": "456 Corporate Blvd",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "United States"
  },
  "items": [
    {
      "description": "Website Development",
      "quantity": 1,
      "unitPrice": 5000.00
    },
    {
      "description": "SEO Optimization",
      "quantity": 5,
      "unitPrice": 200.00
    }
  ],
  "taxRate": 8.25,
  "dueDate": "2024-02-15",
  "notes": "Payment due within 30 days",
  "paymentTerms": "Net 30"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "invoice": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "invoiceNumber": "INV-002",
    "subtotal": 6000.00,
    "taxAmount": 495.00,
    "total": 6495.00,
    "status": "draft",
    "createdAt": "2024-01-17T10:00:00Z"
  }
}
```

### **GET /invoices/:id**
Get a specific invoice by ID.

### **PUT /invoices/:id**
Update an invoice (only if status is 'draft').

### **DELETE /invoices/:id**
Delete an invoice (only if status is 'draft').

### **POST /invoices/:id/send**
Send an invoice (changes status from 'draft' to 'sent').

**Response (200):**
```json
{
  "success": true,
  "message": "Invoice sent successfully",
  "invoice": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "status": "sent",
    "sentAt": "2024-01-17T14:30:00Z"
  }
}
```

### **POST /invoices/:id/mark-paid**
Mark an invoice as paid.

**Response (200):**
```json
{
  "success": true,
  "message": "Invoice marked as paid",
  "invoice": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "status": "paid",
    "paidAt": "2024-01-20T09:15:00Z"
  }
}
```

### **GET /invoices/stats**
Get invoice statistics.

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totals": {
      "invoices": 10,
      "amount": 45000.00,
      "paid": 38000.00,
      "outstanding": 7000.00
    },
    "byStatus": {
      "draft": { "count": 2, "totalAmount": 3000.00 },
      "sent": { "count": 3, "totalAmount": 7000.00 },
      "paid": { "count": 5, "totalAmount": 35000.00 }
    },
    "recentActivity": [
      {
        "invoiceNumber": "INV-010",
        "action": "paid",
        "amount": 2500.00,
        "date": "2024-01-20T09:15:00Z"
      }
    ]
  }
}
```

---

## ❌ **Error Responses**

### **Standard Error Format**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### **HTTP Status Codes**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

---

## 🔧 **Rate Limiting**

### **Limits**
- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **Per IP address**: Applied globally

### **Rate Limit Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

---

## 📝 **Request/Response Examples**

### **cURL Examples**

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Clients:**
```bash
curl -X GET http://localhost:5001/api/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Invoice:**
```bash
curl -X POST http://localhost:5001/api/invoices \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "clientEmail": "john@example.com",
    "items": [{"description": "Service", "quantity": 1, "unitPrice": 1000}],
    "taxRate": 8.25,
    "dueDate": "2024-02-15"
  }'
```

---

**🎯 This API provides complete functionality for managing invoices, clients, and user authentication in InvoiceGen Pro.**
