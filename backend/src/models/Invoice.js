const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0'],
    max: [999999, 'Quantity cannot exceed 999,999']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0.01, 'Unit price must be greater than 0'],
    max: [999999.99, 'Unit price cannot exceed $999,999.99']
  },
  total: {
    type: Number
  }
});

// Remove the pre-save middleware for items since we'll calculate in the main schema

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [200, 'Client name cannot be more than 200 characters']
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid client email'
    ]
  },
  clientAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  items: {
    type: [invoiceItemSchema],
    required: [true, 'At least one item is required'],
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Invoice must have at least one item'
    }
  },
  subtotal: {
    type: Number,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
    index: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date,
    default: null
  },
  viewedAt: {
    type: Date,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters'],
    trim: true
  },
  paymentTerms: {
    type: String,
    maxlength: [500, 'Payment terms cannot be more than 500 characters'],
    trim: true,
    default: 'Payment due within 30 days'
  },
  remindersSent: {
    type: Number,
    default: 0
  },
  lastReminderSent: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ userId: 1, createdAt: -1 });
invoiceSchema.index({ dueDate: 1, status: 1 });

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  // Calculate item totals first
  this.items.forEach(item => {
    item.total = Math.round((item.quantity * item.unitPrice) * 100) / 100;
  });

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  // Round to 2 decimal places
  this.subtotal = Math.round(this.subtotal * 100) / 100;

  // Calculate tax amount
  this.taxAmount = Math.round((this.subtotal * this.taxRate / 100) * 100) / 100;

  // Calculate total
  this.total = Math.round((this.subtotal + this.taxAmount) * 100) / 100;

  next();
});

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.invoiceNumber) {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');

      // Find the last invoice number globally (not just for this user) to avoid duplicates
      const lastInvoice = await this.constructor
        .findOne({
          invoiceNumber: new RegExp(`^INV-${year}${month}-`)
        })
        .sort({ invoiceNumber: -1 });

      let sequence = 1;
      if (lastInvoice) {
        const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
        sequence = lastSequence + 1;
      }

      this.invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for checking if invoice is overdue
invoiceSchema.virtual('isOverdue').get(function() {
  return this.status !== 'paid' && this.status !== 'cancelled' && new Date() > this.dueDate;
});

// Instance method to mark as sent
invoiceSchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.sentAt = new Date();
  return this.save();
};

// Instance method to mark as viewed
invoiceSchema.methods.markAsViewed = function() {
  if (this.status === 'sent') {
    this.status = 'viewed';
    this.viewedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to mark as paid
invoiceSchema.methods.markAsPaid = function() {
  this.status = 'paid';
  this.paidAt = new Date();
  return this.save();
};

// Static method to find overdue invoices
invoiceSchema.statics.findOverdue = function() {
  return this.find({
    status: { $in: ['sent', 'viewed'] },
    dueDate: { $lt: new Date() }
  });
};

// Static method to get user's invoice stats
invoiceSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' }
      }
    }
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount
    };
    return acc;
  }, {});
};

module.exports = mongoose.model('Invoice', invoiceSchema);
