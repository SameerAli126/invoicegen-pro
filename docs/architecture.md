# 🏗️ System Architecture

## 📋 **Overview**

InvoiceGen Pro is built using a modern full-stack architecture with React frontend, Node.js backend, and MongoDB database. This document explains the technical architecture and design decisions.

## 🎯 **Architecture Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express.js    │    │ • MongoDB Atlas │
│ • TypeScript    │    │ • JWT Auth      │    │ • Mongoose ODM  │
│ • Tailwind CSS  │    │ • RESTful API   │    │ • 512MB Optimized│
│ • Axios         │    │ • Middleware    │    │ • Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Deployment    │    │   Security      │    │   Monitoring    │
│                 │    │                 │    │                 │
│ • Netlify       │    │ • JWT Tokens    │    │ • Error Logging │
│ • Railway       │    │ • bcrypt Hash   │    │ • Performance   │
│ • Production    │    │ • Rate Limiting │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 **Frontend Architecture**

### **Technology Stack**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **React Router v6**: Client-side routing and navigation
- **Axios**: HTTP client for API communication

### **Component Architecture**
```
src/
├── components/
│   ├── UI/                 # Reusable UI components
│   │   ├── Button.tsx      # Styled button component
│   │   ├── Input.tsx       # Form input component
│   │   ├── Card.tsx        # Container component
│   │   └── Modal.tsx       # Modal dialog component
│   ├── Client/             # Client-specific components
│   │   ├── ClientForm.tsx  # Client creation/editing
│   │   └── ClientList.tsx  # Client listing
│   ├── Invoice/            # Invoice-specific components
│   │   ├── InvoiceForm.tsx # Invoice creation/editing
│   │   └── InvoiceList.tsx # Invoice listing
│   └── Onboarding/         # User onboarding
│       └── WelcomeModal.tsx
├── pages/                  # Page-level components
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Invoices.tsx        # Invoice management
│   ├── Clients.tsx         # Client management
│   └── Settings.tsx        # User settings
├── services/               # API service layer
│   ├── authService.ts      # Authentication API
│   ├── invoiceService.ts   # Invoice API
│   └── clientService.ts    # Client API
└── utils/                  # Utility functions
    └── helpers.ts
```

### **State Management**
- **React Context**: User authentication state
- **Local State**: Component-specific state with useState
- **Service Layer**: API calls and data transformation
- **Local Storage**: JWT token persistence

### **Design System**
- **Color Palette**: Primary, secondary, success, warning, danger
- **Typography**: Consistent font sizes and weights
- **Spacing**: Tailwind spacing scale (4px base)
- **Components**: Reusable UI components with consistent styling

---

## ⚡ **Backend Architecture**

### **Technology Stack**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

### **API Architecture**
```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── invoiceController.js # Invoice CRUD operations
│   │   └── clientController.js  # Client CRUD operations
│   ├── models/             # Database schemas
│   │   ├── User.js         # User model
│   │   ├── Invoice.js      # Invoice model
│   │   └── Client.js       # Client model
│   ├── routes/             # API route definitions
│   │   ├── auth.js         # Authentication routes
│   │   ├── invoices.js     # Invoice routes
│   │   └── clients.js      # Client routes
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── validation.js   # Input validation
│   │   └── errorHandler.js # Error handling
│   └── utils/              # Utility functions
│       ├── generateToken.js
│       └── validators.js
└── server.js               # Application entry point
```

### **RESTful API Design**
```
Authentication:
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
GET    /api/auth/me          # Get current user

Clients:
GET    /api/clients          # List clients
POST   /api/clients          # Create client
GET    /api/clients/:id      # Get client
PUT    /api/clients/:id      # Update client
DELETE /api/clients/:id      # Delete client
GET    /api/clients/stats    # Client statistics

Invoices:
GET    /api/invoices         # List invoices
POST   /api/invoices         # Create invoice
GET    /api/invoices/:id     # Get invoice
PUT    /api/invoices/:id     # Update invoice
DELETE /api/invoices/:id     # Delete invoice
POST   /api/invoices/:id/send      # Send invoice
POST   /api/invoices/:id/mark-paid # Mark as paid
GET    /api/invoices/stats   # Invoice statistics
```

### **Middleware Stack**
1. **CORS**: Cross-origin resource sharing
2. **Helmet**: Security headers
3. **Morgan**: HTTP request logging
4. **Express.json**: JSON body parsing
5. **Rate Limiting**: API rate limiting
6. **Authentication**: JWT token verification
7. **Validation**: Input validation and sanitization
8. **Error Handling**: Centralized error handling

---

## 🗄️ **Database Architecture**

### **MongoDB Collections**

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  role: "free" | "premium",
  invoiceCount: Number,
  monthlyInvoiceLimit: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Clients Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  name: String,
  email: String,
  company: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferredPaymentTerms: String,
  taxExempt: Boolean,
  totalInvoiced: Number,
  totalPaid: Number,
  outstandingBalance: Number,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

#### **Invoices Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  invoiceNumber: String (unique, indexed),
  clientName: String,
  clientEmail: String,
  clientAddress: Object,
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  subtotal: Number,
  taxRate: Number,
  taxAmount: Number,
  total: Number,
  status: "draft" | "sent" | "viewed" | "paid" | "overdue",
  dueDate: Date,
  issueDate: Date,
  sentAt: Date,
  paidAt: Date,
  notes: String,
  paymentTerms: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Database Optimization**

#### **Indexes**
```javascript
// Users
{ email: 1 }  // Unique index for login

// Clients
{ userId: 1 }  // User's clients
{ userId: 1, email: 1 }  // Prevent duplicate emails per user

// Invoices
{ userId: 1 }  // User's invoices
{ userId: 1, status: 1 }  // Filter by status
{ invoiceNumber: 1 }  // Unique invoice numbers
{ userId: 1, createdAt: -1 }  // Recent invoices first
```

#### **Storage Optimization**
- **512MB Limit**: Optimized for MongoDB Atlas free tier
- **Efficient Schemas**: Minimal data duplication
- **Calculated Fields**: Real-time calculations instead of storage
- **Data Validation**: Prevent invalid data storage

---

## 🔒 **Security Architecture**

### **Authentication Flow**
```
1. User Registration/Login
   ↓
2. Password Hashing (bcrypt)
   ↓
3. JWT Token Generation
   ↓
4. Token Storage (localStorage)
   ↓
5. API Request Authentication
   ↓
6. Token Verification (middleware)
   ↓
7. Protected Resource Access
```

### **Security Measures**
- **JWT Authentication**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation middleware
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: Helmet.js security headers
- **Environment Variables**: Sensitive data protection

---

## 📊 **Data Flow Architecture**

### **Client-Server Communication**
```
Frontend Component
       ↓
Service Layer (API calls)
       ↓
HTTP Request (Axios)
       ↓
Backend Route Handler
       ↓
Controller Logic
       ↓
Database Operation (Mongoose)
       ↓
Response Processing
       ↓
JSON Response
       ↓
Frontend State Update
       ↓
UI Re-render
```

### **Real-time Features**
- **Dashboard Analytics**: Real-time calculations
- **Invoice Status**: Immediate status updates
- **Client Statistics**: Live financial tracking
- **Form Validation**: Real-time input validation

---

## 🚀 **Deployment Architecture**

### **Production Environment**
```
Internet
    ↓
CDN (Netlify)
    ↓
Frontend (React Build)
    ↓
API Gateway
    ↓
Backend (Railway)
    ↓
Database (MongoDB Atlas)
```

### **Environment Separation**
- **Development**: Local development environment
- **Staging**: Testing environment (optional)
- **Production**: Live production environment

### **CI/CD Pipeline**
```
Git Push (production branch)
    ↓
Automatic Build Trigger
    ↓
Build Process (npm run build)
    ↓
Deployment (Netlify/Railway)
    ↓
Live Application Update
```

---

## ⚡ **Performance Architecture**

### **Frontend Optimization**
- **Code Splitting**: React lazy loading
- **Bundle Optimization**: Webpack optimization
- **Caching**: Browser caching strategies
- **Compression**: Gzip compression
- **CDN**: Content delivery network

### **Backend Optimization**
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Response caching strategies
- **Compression**: Response compression
- **Rate Limiting**: Resource protection

### **Database Optimization**
- **Query Optimization**: Efficient MongoDB queries
- **Index Strategy**: Strategic index placement
- **Data Modeling**: Optimized schema design
- **Connection Management**: Efficient connections

---

## 🔧 **Scalability Considerations**

### **Horizontal Scaling**
- **Stateless Backend**: Easy horizontal scaling
- **Database Sharding**: MongoDB sharding support
- **Load Balancing**: Multiple backend instances
- **CDN Distribution**: Global content delivery

### **Vertical Scaling**
- **Resource Optimization**: Efficient resource usage
- **Memory Management**: Optimized memory usage
- **CPU Optimization**: Efficient processing
- **Storage Optimization**: Minimal storage footprint

---

**🎯 This architecture provides a solid foundation for a scalable, maintainable, and secure invoicing application that can grow with business needs.**
