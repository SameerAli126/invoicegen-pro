import type { User } from '../services/authService';
import type { Client, ClientStats, CreateClientData } from '../services/clientService';
import type { CreateInvoiceData, Invoice, InvoiceStats } from '../services/invoiceService';

type Pagination = {
  current: number;
  pages: number;
  total: number;
};

let demoEnabled = false;
let demoUser: User | null = null;
let demoInvoices: Invoice[] = [];
let demoClients: Client[] = [];
let invoiceSequence = 1;

const createDemoUser = (): User => ({
  _id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'premium',
  subscriptionStatus: 'active',
  invoiceCount: 0,
  monthlyInvoiceLimit: 9999,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const paginate = <T>(items: T[], page = 1, limit = 10) => {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: {
      current: page,
      pages,
      total
    } as Pagination
  };
};

const calculateInvoiceTotals = (items: Invoice['items'], taxRate: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = Math.round((subtotal * taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, total };
};

const computeFullAddress = (address: Client['address']) => {
  const parts = [address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean);
  return parts.join(', ');
};

const refreshDemoUserInvoiceCount = () => {
  if (!demoUser) {
    return;
  }
  demoUser.invoiceCount = demoInvoices.length;
  demoUser.updatedAt = new Date().toISOString();
};

const recalcClientStats = (clientEmail: string) => {
  const client = demoClients.find((item) => item.email === clientEmail);
  if (!client) {
    return;
  }

  const related = demoInvoices.filter((invoice) => invoice.clientEmail === clientEmail);
  const totalInvoiced = related.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = related
    .filter((invoice) => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  client.totalInvoiced = totalInvoiced;
  client.totalPaid = totalPaid;
  client.invoiceCount = related.length;
  client.lastInvoiceDate = related.length
    ? related.reduce((latest, invoice) => (invoice.createdAt > latest ? invoice.createdAt : latest), related[0].createdAt)
    : null;
  client.lastPaymentDate = related
    .filter((invoice) => invoice.paidAt)
    .reduce((latest, invoice) => (invoice.paidAt && invoice.paidAt > latest ? invoice.paidAt : latest), client.lastPaymentDate || null);
  client.outstandingBalance = client.totalInvoiced - client.totalPaid;
  client.fullAddress = computeFullAddress(client.address);
};

export const enableDemo = () => {
  demoEnabled = true;
  demoUser = createDemoUser();
  demoInvoices = [];
  demoClients = [];
  invoiceSequence = 1;
  return demoUser;
};

export const disableDemo = () => {
  demoEnabled = false;
  demoUser = null;
  demoInvoices = [];
  demoClients = [];
  invoiceSequence = 1;
};

export const isDemoEnabled = () => demoEnabled;

export const getDemoUser = () => demoUser;

export const updateDemoUser = (updates: Partial<User>) => {
  if (!demoUser) {
    demoUser = createDemoUser();
  }
  demoUser = { ...demoUser, ...updates, updatedAt: new Date().toISOString() };
  return demoUser;
};

export const getDemoClients = (options?: { page?: number; limit?: number; status?: string; search?: string }) => {
  let result = [...demoClients];
  if (options?.status && options.status !== 'all') {
    result = result.filter((client) => client.status === options.status);
  }
  if (options?.search) {
    const query = options.search.toLowerCase();
    result = result.filter((client) =>
      [client.name, client.email, client.company].filter(Boolean).some((value) => value!.toLowerCase().includes(query))
    );
  }

  return paginate(result, options?.page || 1, options?.limit || 10);
};

export const getDemoClientsRaw = () => [...demoClients];

export const getDemoClientById = (clientId: string) => demoClients.find((client) => client._id === clientId) || null;

export const createDemoClient = (data: CreateClientData, userId: string) => {
  const now = new Date().toISOString();
  const address = {
    street: data.address?.street || '',
    city: data.address?.city || '',
    state: data.address?.state || '',
    zipCode: data.address?.zipCode || '',
    country: data.address?.country || 'United States'
  };

  const client: Client = {
    _id: `demo-client-${Date.now()}`,
    userId,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone,
    company: data.company,
    address,
    notes: data.notes,
    status: 'active',
    totalInvoiced: 0,
    totalPaid: 0,
    invoiceCount: 0,
    lastInvoiceDate: undefined,
    lastPaymentDate: undefined,
    preferredPaymentTerms: data.preferredPaymentTerms || 'Net 30',
    customPaymentTerms: data.customPaymentTerms,
    taxId: data.taxId,
    taxExempt: data.taxExempt || false,
    outstandingBalance: 0,
    fullAddress: computeFullAddress(address),
    createdAt: now,
    updatedAt: now
  };

  demoClients.unshift(client);
  return client;
};

export const updateDemoClient = (clientId: string, data: Partial<CreateClientData>) => {
  const client = demoClients.find((item) => item._id === clientId);
  if (!client) {
    return null;
  }

  if (data.name) client.name = data.name.trim();
  if (data.email) client.email = data.email.trim().toLowerCase();
  if (data.phone !== undefined) client.phone = data.phone;
  if (data.company !== undefined) client.company = data.company;
  if (data.notes !== undefined) client.notes = data.notes;
  if (data.preferredPaymentTerms !== undefined) client.preferredPaymentTerms = data.preferredPaymentTerms;
  if (data.customPaymentTerms !== undefined) client.customPaymentTerms = data.customPaymentTerms;
  if (data.taxId !== undefined) client.taxId = data.taxId;
  if (data.taxExempt !== undefined) client.taxExempt = data.taxExempt;
  if (data.address) {
    client.address = {
      ...client.address,
      ...data.address
    };
  }

  client.fullAddress = computeFullAddress(client.address);
  client.updatedAt = new Date().toISOString();
  return client;
};

export const deleteDemoClient = (clientId: string) => {
  demoClients = demoClients.filter((client) => client._id !== clientId);
};

export const getDemoClientStats = (): ClientStats => {
  const active = demoClients.filter((client) => client.status === 'active');
  const inactive = demoClients.filter((client) => client.status === 'inactive');
  const activeTotals = active.reduce(
    (acc, client) => {
      acc.totalInvoiced += client.totalInvoiced;
      acc.totalPaid += client.totalPaid;
      return acc;
    },
    { count: active.length, totalInvoiced: 0, totalPaid: 0 }
  );
  const inactiveTotals = inactive.reduce(
    (acc, client) => {
      acc.totalInvoiced += client.totalInvoiced;
      acc.totalPaid += client.totalPaid;
      return acc;
    },
    { count: inactive.length, totalInvoiced: 0, totalPaid: 0 }
  );

  const totalInvoiced = activeTotals.totalInvoiced + inactiveTotals.totalInvoiced;
  const totalPaid = activeTotals.totalPaid + inactiveTotals.totalPaid;

  return {
    active: activeTotals,
    inactive: inactiveTotals,
    total: {
      count: demoClients.length,
      totalInvoiced,
      totalPaid,
      outstanding: totalInvoiced - totalPaid
    }
  };
};

export const getDemoInvoices = (options?: { page?: number; limit?: number; status?: string; search?: string }) => {
  let result = [...demoInvoices];
  if (options?.status && options.status !== 'all') {
    result = result.filter((invoice) => invoice.status === options.status);
  }
  if (options?.search) {
    const query = options.search.toLowerCase();
    result = result.filter((invoice) =>
      [invoice.clientName, invoice.clientEmail, invoice.invoiceNumber].some((value) => value.toLowerCase().includes(query))
    );
  }

  return paginate(result, options?.page || 1, options?.limit || 10);
};

export const getDemoInvoicesRaw = () => [...demoInvoices];

export const getDemoInvoiceById = (invoiceId: string) => demoInvoices.find((invoice) => invoice._id === invoiceId) || null;

export const createDemoInvoice = (data: CreateInvoiceData, userId: string) => {
  const now = new Date();
  const issueDate = now.toISOString();
  const dueDate = new Date(data.dueDate).toISOString();
  const items = data.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: Math.round(item.quantity * item.unitPrice * 100) / 100
  }));
  const taxRate = data.taxRate || 0;
  const totals = calculateInvoiceTotals(items, taxRate);

  const invoice: Invoice = {
    _id: `demo-invoice-${Date.now()}-${invoiceSequence}`,
    userId,
    invoiceNumber: `DEMO-${String(invoiceSequence).padStart(4, '0')}`,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientAddress: data.clientAddress || {},
    items,
    subtotal: totals.subtotal,
    taxRate,
    taxAmount: totals.taxAmount,
    total: totals.total,
    currency: 'USD',
    status: 'draft',
    dueDate,
    issueDate,
    notes: data.notes,
    paymentTerms: data.paymentTerms || 'Payment due within 30 days',
    remindersSent: 0,
    createdAt: issueDate,
    updatedAt: issueDate
  };

  invoiceSequence += 1;
  demoInvoices.unshift(invoice);
  recalcClientStats(invoice.clientEmail);
  refreshDemoUserInvoiceCount();
  return invoice;
};

export const updateDemoInvoice = (invoiceId: string, data: Partial<CreateInvoiceData>) => {
  const invoice = demoInvoices.find((item) => item._id === invoiceId);
  if (!invoice) {
    return null;
  }

  const previousClientEmail = invoice.clientEmail;

  if (data.clientName) invoice.clientName = data.clientName;
  if (data.clientEmail) invoice.clientEmail = data.clientEmail;
  if (data.clientAddress) {
    invoice.clientAddress = { ...invoice.clientAddress, ...data.clientAddress };
  }

  if (data.items) {
    const items = data.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: Math.round(item.quantity * item.unitPrice * 100) / 100
    }));
    invoice.items = items;
  }

  if (data.taxRate !== undefined) {
    invoice.taxRate = data.taxRate;
  }

  if (data.dueDate) {
    invoice.dueDate = new Date(data.dueDate).toISOString();
  }

  if (data.notes !== undefined) {
    invoice.notes = data.notes;
  }

  if (data.paymentTerms !== undefined) {
    invoice.paymentTerms = data.paymentTerms;
  }

  const totals = calculateInvoiceTotals(invoice.items, invoice.taxRate);
  invoice.subtotal = totals.subtotal;
  invoice.taxAmount = totals.taxAmount;
  invoice.total = totals.total;
  invoice.updatedAt = new Date().toISOString();

  if (previousClientEmail !== invoice.clientEmail) {
    recalcClientStats(previousClientEmail);
  }
  recalcClientStats(invoice.clientEmail);
  return invoice;
};

export const updateDemoInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
  const invoice = demoInvoices.find((item) => item._id === invoiceId);
  if (!invoice) {
    return null;
  }
  invoice.status = status;
  if (status === 'sent') {
    invoice.sentAt = new Date().toISOString();
  }
  if (status === 'paid') {
    invoice.paidAt = new Date().toISOString();
  }
  invoice.updatedAt = new Date().toISOString();
  recalcClientStats(invoice.clientEmail);
  return invoice;
};

export const deleteDemoInvoice = (invoiceId: string) => {
  const invoice = demoInvoices.find((item) => item._id === invoiceId);
  demoInvoices = demoInvoices.filter((item) => item._id !== invoiceId);
  if (invoice) {
    recalcClientStats(invoice.clientEmail);
  }
  refreshDemoUserInvoiceCount();
};

export const getDemoInvoiceStats = (): InvoiceStats => {
  const byStatus: InvoiceStats['byStatus'] = {};
  demoInvoices.forEach((invoice) => {
    if (!byStatus[invoice.status]) {
      byStatus[invoice.status] = { count: 0, totalAmount: 0 };
    }
    byStatus[invoice.status].count += 1;
    byStatus[invoice.status].totalAmount += invoice.total;
  });

  const totals = Object.values(byStatus).reduce(
    (acc, stat) => {
      acc.invoices += stat.count;
      acc.amount += stat.totalAmount;
      return acc;
    },
    { invoices: 0, amount: 0 }
  );

  return { byStatus, totals };
};
