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

export interface Client {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
  status: 'active' | 'inactive';
  totalInvoiced: number;
  totalPaid: number;
  invoiceCount: number;
  lastInvoiceDate?: string;
  lastPaymentDate?: string;
  preferredPaymentTerms: string;
  customPaymentTerms?: string;
  taxId?: string;
  taxExempt: boolean;
  outstandingBalance: number;
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
  preferredPaymentTerms?: string;
  customPaymentTerms?: string;
  taxId?: string;
  taxExempt?: boolean;
}

export interface ClientListResponse {
  message: string;
  clients: Client[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface ClientResponse {
  message: string;
  client: Client;
}

export interface ClientStats {
  active: {
    count: number;
    totalInvoiced: number;
    totalPaid: number;
  };
  inactive: {
    count: number;
    totalInvoiced: number;
    totalPaid: number;
  };
  total: {
    count: number;
    totalInvoiced: number;
    totalPaid: number;
    outstanding: number;
  };
}

class ClientService {
  // Get all clients
  async getClients(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ClientListResponse> {
    try {
      const response = await api.get('/clients', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch clients');
    }
  }

  // Get single client
  async getClient(id: string): Promise<ClientResponse> {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch client');
    }
  }

  // Create new client
  async createClient(data: CreateClientData): Promise<ClientResponse> {
    try {
      const response = await api.post('/clients', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create client');
    }
  }

  // Update client
  async updateClient(id: string, data: Partial<CreateClientData>): Promise<ClientResponse> {
    try {
      const response = await api.put(`/clients/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update client');
    }
  }

  // Delete client
  async deleteClient(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete client');
    }
  }

  // Get client statistics
  async getClientStats(): Promise<{ message: string; stats: ClientStats }> {
    try {
      const response = await api.get('/clients/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch client statistics');
    }
  }

  // Get clients with outstanding balances
  async getClientsWithOutstandingBalance(): Promise<{ message: string; clients: Client[] }> {
    try {
      const response = await api.get('/clients/outstanding');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch clients with outstanding balances');
    }
  }

  // Update client financial statistics
  async updateClientStats(id: string): Promise<ClientResponse> {
    try {
      const response = await api.post(`/clients/${id}/update-stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update client statistics');
    }
  }

  // Get status badge color
  getStatusColor(status: Client['status']): string {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
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

  // Get client initials for avatar
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  // Get client display name (company or name)
  getDisplayName(client: Client): string {
    return client.company || client.name;
  }

  // Format address for display
  formatAddress(client: Client): string {
    const parts = [];
    if (client.address.street) parts.push(client.address.street);
    if (client.address.city) parts.push(client.address.city);
    if (client.address.state) parts.push(client.address.state);
    if (client.address.zipCode) parts.push(client.address.zipCode);
    if (client.address.country && client.address.country !== 'United States') {
      parts.push(client.address.country);
    }
    return parts.join(', ');
  }

  // Get payment terms display
  getPaymentTermsDisplay(client: Client): string {
    if (client.preferredPaymentTerms === 'Custom' && client.customPaymentTerms) {
      return client.customPaymentTerms;
    }
    return client.preferredPaymentTerms;
  }

  // Calculate client health score (0-100)
  getClientHealthScore(client: Client): number {
    let score = 50; // Base score

    // Payment history (40 points)
    if (client.totalInvoiced > 0) {
      const paymentRatio = client.totalPaid / client.totalInvoiced;
      score += paymentRatio * 40;
    }

    // Recent activity (20 points)
    if (client.lastPaymentDate) {
      const daysSincePayment = Math.floor(
        (Date.now() - new Date(client.lastPaymentDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePayment < 30) score += 20;
      else if (daysSincePayment < 90) score += 10;
    }

    // Invoice frequency (20 points)
    if (client.invoiceCount > 0) {
      const accountAge = Math.floor(
        (Date.now() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const invoiceFrequency = client.invoiceCount / Math.max(accountAge / 30, 1);
      score += Math.min(invoiceFrequency * 5, 20);
    }

    // Outstanding balance penalty
    if (client.outstandingBalance > 0 && client.totalInvoiced > 0) {
      const outstandingRatio = client.outstandingBalance / client.totalInvoiced;
      score -= outstandingRatio * 30;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Get health score color
  getHealthScoreColor(score: number): string {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  }
}

// Create and export a singleton instance
const clientService = new ClientService();
export default clientService;
