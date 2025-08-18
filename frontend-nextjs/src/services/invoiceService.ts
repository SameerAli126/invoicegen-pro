import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  userId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  sentAt?: string;
  viewedAt?: string;
  paidAt?: string;
  notes?: string;
  paymentTerms: string;
  remindersSent: number;
  lastReminderSent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  clientName: string;
  clientEmail: string;
  clientAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items: Omit<InvoiceItem, 'total'>[];
  taxRate?: number;
  dueDate: string;
  notes?: string;
  paymentTerms?: string;
}

export interface InvoiceListResponse {
  message: string;
  invoices: Invoice[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface InvoiceResponse {
  message: string;
  invoice: Invoice;
}

export interface InvoiceStats {
  byStatus: {
    [status: string]: {
      count: number;
      totalAmount: number;
    };
  };
  totals: {
    invoices: number;
    amount: number;
  };
}

class InvoiceService {
  // Get all invoices
  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<InvoiceListResponse> {
    try {
      const response = await api.get('/invoices', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }

  // Get single invoice
  async getInvoice(id: string): Promise<InvoiceResponse> {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invoice');
    }
  }

  // Create new invoice
  async createInvoice(data: CreateInvoiceData): Promise<InvoiceResponse> {
    try {
      const response = await api.post('/invoices', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create invoice');
    }
  }

  // Update invoice
  async updateInvoice(id: string, data: Partial<CreateInvoiceData>): Promise<InvoiceResponse> {
    try {
      const response = await api.put(`/invoices/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update invoice');
    }
  }

  // Delete invoice
  async deleteInvoice(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete invoice');
    }
  }

  // Send invoice
  async sendInvoice(id: string): Promise<InvoiceResponse> {
    try {
      const response = await api.post(`/invoices/${id}/send`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send invoice');
    }
  }

  // Mark invoice as paid
  async markAsPaid(id: string): Promise<InvoiceResponse> {
    try {
      const response = await api.post(`/invoices/${id}/mark-paid`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark invoice as paid');
    }
  }

  // Get invoice statistics
  async getInvoiceStats(): Promise<{ message: string; stats: InvoiceStats }> {
    try {
      const response = await api.get('/invoices/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invoice statistics');
    }
  }

  // Get status badge color
  getStatusColor(status: Invoice['status']): string {
    switch (status) {
      case 'draft':
        return 'bg-secondary-100 text-secondary-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-purple-100 text-purple-800';
      case 'paid':
        return 'bg-success-100 text-success-800';
      case 'overdue':
        return 'bg-danger-100 text-danger-800';
      case 'cancelled':
        return 'bg-secondary-100 text-secondary-600';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Check if invoice is overdue
  isOverdue(invoice: Invoice): boolean {
    return invoice.status !== 'paid' && 
           invoice.status !== 'cancelled' && 
           new Date(invoice.dueDate) < new Date();
  }

  // Get days until due or overdue
  getDaysUntilDue(invoice: Invoice): number {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Get invoice age in days
  getInvoiceAge(invoice: Invoice): number {
    const today = new Date();
    const createdDate = new Date(invoice.createdAt);
    const diffTime = today.getTime() - createdDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Create and export a singleton instance
const invoiceService = new InvoiceService();
export default invoiceService;
