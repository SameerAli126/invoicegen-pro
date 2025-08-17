const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due'],
    default: 'inactive'
  },
  subscriptionId: {
    type: String,
    default: null
  },
  invoiceCount: {
    type: Number,
    default: 0
  },
  monthlyInvoiceLimit: {
    type: Number,
    default: 5 // Free tier limit
  },
  lastInvoiceReset: {
    type: Date,
    default: Date.now
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for email lookups (removed duplicate - using unique: true in schema instead)

// Virtual for checking if user can create more invoices
userSchema.virtual('canCreateInvoice').get(function() {
  if (this.role === 'premium') return true;
  
  // Check if it's a new month (reset counter)
  const now = new Date();
  const lastReset = new Date(this.lastInvoiceReset);
  
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    return true; // Will be reset in pre-save middleware
  }
  
  return this.invoiceCount < this.monthlyInvoiceLimit;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) return next();

  try {
    console.log('🔐 Hashing password for user:', this.email);
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    console.log('✅ Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Password hashing failed:', error);
    next(error);
  }
});

// Pre-save middleware to reset monthly invoice count
userSchema.pre('save', function(next) {
  const now = new Date();
  const lastReset = new Date(this.lastInvoiceReset);
  
  // Reset counter if it's a new month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.invoiceCount = 0;
    this.lastInvoiceReset = now;
  }
  
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Instance method to increment invoice count
userSchema.methods.incrementInvoiceCount = async function() {
  this.invoiceCount += 1;
  return this.save();
};

// Instance method to check if user is premium
userSchema.methods.isPremium = function() {
  return this.role === 'premium' && this.subscriptionStatus === 'active';
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Transform output (remove sensitive fields)
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
