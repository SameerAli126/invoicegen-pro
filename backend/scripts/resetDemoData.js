const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../src/models/User');
const Client = require('../src/models/Client');
const Invoice = require('../src/models/Invoice');

const generateRecoveryCode = () => {
  const code = Math.floor(100000000 + Math.random() * 900000000);
  return String(code);
};

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  await Invoice.deleteMany({});
  await Client.deleteMany({});
  await User.deleteMany({});

  const recoveryCode = generateRecoveryCode();
  const recoveryCodeHash = await bcrypt.hash(recoveryCode, 12);

  const user = new User({
    name: 'Demo User',
    email: 'demo@invoicegen.com',
    passwordHash: 'DemoPass123',
    role: 'premium',
    subscriptionStatus: 'active',
    monthlyInvoiceLimit: 9999,
    recoveryCodeHash
  });

  await user.save();

  const clients = await Client.insertMany([
    {
      userId: user._id,
      name: 'Acme Corp',
      email: 'billing@acme.com',
      company: 'Acme Corp',
      phone: '555-101-2020',
      address: {
        street: '123 Market Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      }
    },
    {
      userId: user._id,
      name: 'Nimbus Labs',
      email: 'accounts@nimbus.com',
      company: 'Nimbus Labs',
      phone: '555-303-4040',
      address: {
        street: '88 Atlas Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    }
  ]);

  const now = new Date();
  const futureDate = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const invoices = [
    new Invoice({
      userId: user._id,
      clientName: clients[0].name,
      clientEmail: clients[0].email,
      clientAddress: clients[0].address,
      items: [
        { description: 'Brand identity package', quantity: 1, unitPrice: 1500 },
        { description: 'Landing page design', quantity: 2, unitPrice: 450 }
      ],
      taxRate: 7.5,
      dueDate: futureDate(14),
      notes: 'Thanks for your business!',
      paymentTerms: 'Net 30'
    }),
    new Invoice({
      userId: user._id,
      clientName: clients[1].name,
      clientEmail: clients[1].email,
      clientAddress: clients[1].address,
      items: [
        { description: 'Monthly retainer - December', quantity: 1, unitPrice: 2200 }
      ],
      taxRate: 0,
      dueDate: futureDate(21),
      notes: 'Monthly retainer services',
      paymentTerms: 'Net 15'
    }),
    new Invoice({
      userId: user._id,
      clientName: clients[0].name,
      clientEmail: clients[0].email,
      clientAddress: clients[0].address,
      items: [
        { description: 'SEO audit', quantity: 1, unitPrice: 750 }
      ],
      taxRate: 5,
      dueDate: futureDate(30),
      notes: 'Quarterly audit',
      paymentTerms: 'Net 30'
    })
  ];

  await invoices[0].save();
  invoices[1].status = 'sent';
  invoices[1].sentAt = new Date();
  await invoices[1].save();
  invoices[2].status = 'paid';
  invoices[2].paidAt = new Date();
  await invoices[2].save();

  await User.findByIdAndUpdate(user._id, { invoiceCount: invoices.length });

  for (const client of clients) {
    await client.updateFinancialStats();
  }

  console.log('Database reset complete.');
  console.log('Seed user email:', user.email);
  console.log('Seed user password:', 'DemoPass123');
  console.log('Recovery code:', recoveryCode);

  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
