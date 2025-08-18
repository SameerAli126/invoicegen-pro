const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Client = require('../src/models/Client');
const Invoice = require('../src/models/Invoice');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addSampleData = async () => {
  try {
    console.log('🔍 Finding user khsameer626@gmail.com...');
    
    // Find the user
    let user = await User.findOne({ email: 'khsameer626@gmail.com' });
    
    if (!user) {
      console.log('👤 User not found, creating user...');
      const hashedPassword = await bcrypt.hash('dev123', 12);
      user = new User({
        name: 'Muhammad Sameer Ali',
        email: 'khsameer626@gmail.com',
        password: hashedPassword
      });
      await user.save();
      console.log('✅ User created successfully');
    } else {
      console.log('✅ User found:', user.name);
    }

    console.log('🏢 Adding sample clients...');
    
    // Sample clients data
    const clientsData = [
      {
        name: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, Silicon Valley, CA 94000',
        company: 'TechCorp Solutions Inc.',
        userId: user._id
      },
      {
        name: 'Digital Marketing Pro',
        email: 'hello@digitalmarketing.com',
        phone: '+1 (555) 234-5678',
        address: '456 Marketing Ave, New York, NY 10001',
        company: 'Digital Marketing Pro LLC',
        userId: user._id
      },
      {
        name: 'StartupXYZ',
        email: 'founders@startupxyz.com',
        phone: '+1 (555) 345-6789',
        address: '789 Innovation Blvd, Austin, TX 73301',
        company: 'StartupXYZ Inc.',
        userId: user._id
      },
      {
        name: 'E-commerce Giants',
        email: 'business@ecommercegiants.com',
        phone: '+1 (555) 456-7890',
        address: '321 Commerce St, Seattle, WA 98101',
        company: 'E-commerce Giants Corp',
        userId: user._id
      },
      {
        name: 'Creative Design Studio',
        email: 'projects@creativedesign.com',
        phone: '+1 (555) 567-8901',
        address: '654 Design Lane, Los Angeles, CA 90210',
        company: 'Creative Design Studio',
        userId: user._id
      },
      {
        name: 'FinTech Innovations',
        email: 'partnerships@fintechinnovations.com',
        phone: '+1 (555) 678-9012',
        address: '987 Finance Plaza, Chicago, IL 60601',
        company: 'FinTech Innovations Ltd',
        userId: user._id
      },
      {
        name: 'HealthTech Solutions',
        email: 'info@healthtechsolutions.com',
        phone: '+1 (555) 789-0123',
        address: '147 Health Ave, Boston, MA 02101',
        company: 'HealthTech Solutions Inc.',
        userId: user._id
      },
      {
        name: 'EduPlatform Online',
        email: 'admin@eduplatform.com',
        phone: '+1 (555) 890-1234',
        address: '258 Education Blvd, Denver, CO 80201',
        company: 'EduPlatform Online LLC',
        userId: user._id
      },
      {
        name: 'GreenEnergy Corp',
        email: 'contact@greenenergy.com',
        phone: '+1 (555) 901-2345',
        address: '369 Renewable St, Portland, OR 97201',
        company: 'GreenEnergy Corporation',
        userId: user._id
      },
      {
        name: 'CloudServices Pro',
        email: 'support@cloudservices.com',
        phone: '+1 (555) 012-3456',
        address: '741 Cloud Drive, Miami, FL 33101',
        company: 'CloudServices Pro Inc.',
        userId: user._id
      },
      {
        name: 'AI Research Lab',
        email: 'research@airesearchlab.com',
        phone: '+1 (555) 123-0987',
        address: '852 AI Boulevard, San Francisco, CA 94102',
        company: 'AI Research Lab',
        userId: user._id
      },
      {
        name: 'Blockchain Ventures',
        email: 'ventures@blockchain.com',
        phone: '+1 (555) 234-1098',
        address: '963 Crypto Street, Las Vegas, NV 89101',
        company: 'Blockchain Ventures LLC',
        userId: user._id
      }
    ];

    // Clear existing clients for this user
    await Client.deleteMany({ userId: user._id });
    console.log('🗑️ Cleared existing clients');

    // Add new clients
    const clients = await Client.insertMany(clientsData);
    console.log(`✅ Added ${clients.length} clients`);

    console.log('📄 Adding sample invoices...');
    
    // Sample invoices data
    const invoicesData = [
      {
        invoiceNumber: 'INV-2024-001',
        clientName: clients[0].name,
        clientEmail: clients[0].email,
        userId: user._id,
        issueDate: new Date('2024-01-15'),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        items: [
          {
            description: 'Website Development - Frontend',
            quantity: 1,
            unitPrice: 2500.00,
            total: 2500.00
          },
          {
            description: 'Website Development - Backend',
            quantity: 1,
            unitPrice: 2000.00,
            total: 2000.00
          }
        ],
        subtotal: 4500.00,
        taxAmount: 450.00,
        total: 4950.00,
        status: 'paid',
        notes: 'Thank you for your business!'
      },
      {
        invoiceNumber: 'INV-2024-002',
        clientName: clients[1].name,
        clientEmail: clients[1].email,
        userId: user._id,
        issueDate: new Date('2024-01-20'),
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        items: [
          {
            description: 'Digital Marketing Campaign Setup',
            quantity: 1,
            unitPrice: 1500.00,
            total: 1500.00
          },
          {
            description: 'Social Media Management (Monthly)',
            quantity: 3,
            unitPrice: 800.00,
            total: 2400.00
          }
        ],
        subtotal: 3900.00,
        taxAmount: 390.00,
        total: 4290.00,
        status: 'sent',
        notes: 'Payment due within 30 days'
      },
      {
        invoiceNumber: 'INV-2024-003',
        clientName: clients[2].name,
        clientEmail: clients[2].email,
        userId: user._id,
        issueDate: new Date('2024-02-01'),
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        items: [
          {
            description: 'Mobile App Development - iOS',
            quantity: 1,
            unitPrice: 5000.00,
            total: 5000.00
          },
          {
            description: 'Mobile App Development - Android',
            quantity: 1,
            unitPrice: 4500.00,
            total: 4500.00
          }
        ],
        subtotal: 9500.00,
        taxAmount: 950.00,
        total: 10450.00,
        status: 'draft',
        notes: 'Milestone 1 of 3 completed'
      }
    ];

    // Add more invoices for other clients
    for (let i = 3; i < clients.length; i++) {
      const invoiceNum = String(i + 1).padStart(3, '0');
      const quantity = Math.floor(Math.random() * 10) + 1;
      const unitPrice = Math.floor(Math.random() * 500) + 100;
      const itemTotal = quantity * unitPrice;
      const tax = itemTotal * 0.1;

      invoicesData.push({
        invoiceNumber: `INV-2024-${invoiceNum}`,
        clientName: clients[i].name,
        clientEmail: clients[i].email,
        userId: user._id,
        issueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        dueDate: new Date(Date.now() + (Math.floor(Math.random() * 90) + 15) * 24 * 60 * 60 * 1000), // 15-105 days from now
        items: [
          {
            description: 'Consulting Services',
            quantity: quantity,
            unitPrice: unitPrice,
            total: itemTotal
          }
        ],
        subtotal: itemTotal,
        taxAmount: tax,
        total: itemTotal + tax,
        status: ['draft', 'sent', 'paid', 'overdue'][Math.floor(Math.random() * 4)],
        notes: 'Professional services rendered'
      });
    }

    // Clear existing invoices for this user
    await Invoice.deleteMany({ userId: user._id });
    console.log('🗑️ Cleared existing invoices');

    // Add new invoices
    const invoices = await Invoice.insertMany(invoicesData);
    console.log(`✅ Added ${invoices.length} invoices`);

    console.log('\n🎉 Sample data added successfully!');
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`🏢 Clients: ${clients.length}`);
    console.log(`📄 Invoices: ${invoices.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
};

addSampleData();
