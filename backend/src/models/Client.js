const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [200, 'Client name cannot be more than 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot be more than 200 characters']
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address cannot be more than 200 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City cannot be more than 100 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot be more than 100 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Zip code cannot be more than 20 characters']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country cannot be more than 100 characters'],
      default: 'United States'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  // Business relationship tracking
  totalInvoiced: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  invoiceCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastInvoiceDate: {
    type: Date,
    default: null
  },
  lastPaymentDate: {
    type: Date,
    default: null
  },
  // Payment preferences
  preferredPaymentTerms: {
    type: String,
    enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt', 'Custom'],
    default: 'Net 30'
  },
  customPaymentTerms: {
    type: String,
    trim: true,
    maxlength: [200, 'Custom payment terms cannot be more than 200 characters']
  },
  // Tax information
  taxId: {
    type: String,
    trim: true,
    maxlength: [50, 'Tax ID cannot be more than 50 characters']
  },
  taxExempt: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
clientSchema.index({ userId: 1, name: 1 });
clientSchema.index({ userId: 1, email: 1 });
clientSchema.index({ userId: 1, status: 1 });
clientSchema.index({ userId: 1, createdAt: -1 });

// Virtual for outstanding balance
clientSchema.virtual('outstandingBalance').get(function() {
  return this.totalInvoiced - this.totalPaid;
});

// Virtual for full address
clientSchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.address.street) parts.push(this.address.street);
  if (this.address.city) parts.push(this.address.city);
  if (this.address.state) parts.push(this.address.state);
  if (this.address.zipCode) parts.push(this.address.zipCode);
  if (this.address.country) parts.push(this.address.country);
  return parts.join(', ');
});

// Instance method to update financial stats
clientSchema.methods.updateFinancialStats = async function() {
  const Invoice = mongoose.model('Invoice');
  
  const stats = await Invoice.aggregate([
    { $match: { userId: this.userId, clientEmail: this.email } },
    {
      $group: {
        _id: null,
        totalInvoiced: { $sum: '$total' },
        totalPaid: { 
          $sum: { 
            $cond: [{ $eq: ['$status', 'paid'] }, '$total', 0] 
          } 
        },
        invoiceCount: { $sum: 1 },
        lastInvoiceDate: { $max: '$createdAt' },
        lastPaymentDate: { 
          $max: { 
            $cond: [{ $eq: ['$status', 'paid'] }, '$paidAt', null] 
          } 
        }
      }
    }
  ]);

  if (stats.length > 0) {
    const stat = stats[0];
    this.totalInvoiced = stat.totalInvoiced || 0;
    this.totalPaid = stat.totalPaid || 0;
    this.invoiceCount = stat.invoiceCount || 0;
    this.lastInvoiceDate = stat.lastInvoiceDate || null;
    this.lastPaymentDate = stat.lastPaymentDate || null;
    await this.save();
  }
};

// Static method to find clients with outstanding balances
clientSchema.statics.findWithOutstandingBalance = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'active' } },
    { $addFields: { outstandingBalance: { $subtract: ['$totalInvoiced', '$totalPaid'] } } },
    { $match: { outstandingBalance: { $gt: 0 } } },
    { $sort: { outstandingBalance: -1 } }
  ]);
};

// Static method to get client statistics for a user
clientSchema.statics.getUserClientStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalInvoiced: { $sum: '$totalInvoiced' },
        totalPaid: { $sum: '$totalPaid' }
      }
    }
  ]);

  const result = {
    active: { count: 0, totalInvoiced: 0, totalPaid: 0 },
    inactive: { count: 0, totalInvoiced: 0, totalPaid: 0 },
    total: { count: 0, totalInvoiced: 0, totalPaid: 0, outstanding: 0 }
  };

  stats.forEach(stat => {
    result[stat._id] = {
      count: stat.count,
      totalInvoiced: stat.totalInvoiced,
      totalPaid: stat.totalPaid
    };
    result.total.count += stat.count;
    result.total.totalInvoiced += stat.totalInvoiced;
    result.total.totalPaid += stat.totalPaid;
  });

  result.total.outstanding = result.total.totalInvoiced - result.total.totalPaid;

  return result;
};

// Pre-save middleware to ensure email uniqueness per user
clientSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingClient = await this.constructor.findOne({
      userId: this.userId,
      email: this.email,
      _id: { $ne: this._id }
    });

    if (existingClient) {
      const error = new Error('A client with this email already exists');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Transform output (remove sensitive fields if needed)
clientSchema.methods.toJSON = function() {
  const clientObject = this.toObject({ virtuals: true });
  return clientObject;
};

module.exports = mongoose.model('Client', clientSchema);
