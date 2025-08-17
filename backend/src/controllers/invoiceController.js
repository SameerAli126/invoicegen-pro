const Invoice = require('../models/Invoice');
const User = require('../models/User');

// Get all invoices for the authenticated user
const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Invoice.countDocuments(query);

    res.json({
      message: 'Invoices retrieved successfully',
      invoices,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      message: 'Failed to retrieve invoices',
      error: 'GET_INVOICES_ERROR'
    });
  }
};

// Get single invoice by ID
const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invoice = await Invoice.findOne({ _id: id, userId });
    
    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
        error: 'INVOICE_NOT_FOUND'
      });
    }

    res.json({
      message: 'Invoice retrieved successfully',
      invoice
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      message: 'Failed to retrieve invoice',
      error: 'GET_INVOICE_ERROR'
    });
  }
};

// Create new invoice
const createInvoice = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      clientName,
      clientEmail,
      clientAddress,
      items,
      taxRate = 0,
      dueDate,
      notes,
      paymentTerms
    } = req.body;

    // Validation
    if (!clientName || !clientEmail || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Client name, email, and at least one item are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        message: 'Due date is required',
        error: 'MISSING_DUE_DATE'
      });
    }

    // Validate items
    for (const item of items) {
      if (!item.description || !item.quantity || !item.unitPrice) {
        return res.status(400).json({
          message: 'Each item must have description, quantity, and unit price',
          error: 'INVALID_ITEM_DATA'
        });
      }
    }

    // Create invoice
    const invoice = new Invoice({
      userId,
      clientName,
      clientEmail,
      clientAddress,
      items,
      taxRate,
      dueDate: new Date(dueDate),
      notes,
      paymentTerms
    });

    await invoice.save();

    // Increment user's invoice count
    await User.findByIdAndUpdate(userId, { $inc: { invoiceCount: 1 } });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: 'VALIDATION_ERROR',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Failed to create invoice',
      error: 'CREATE_INVOICE_ERROR'
    });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    // Don't allow updating certain fields
    delete updateData.userId;
    delete updateData.invoiceNumber;
    delete updateData.createdAt;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
        error: 'INVOICE_NOT_FOUND'
      });
    }

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });

  } catch (error) {
    console.error('Update invoice error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: 'VALIDATION_ERROR',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Failed to update invoice',
      error: 'UPDATE_INVOICE_ERROR'
    });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invoice = await Invoice.findOneAndDelete({ _id: id, userId });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
        error: 'INVOICE_NOT_FOUND'
      });
    }

    res.json({
      message: 'Invoice deleted successfully'
    });

  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      message: 'Failed to delete invoice',
      error: 'DELETE_INVOICE_ERROR'
    });
  }
};

// Mark invoice as sent
const sendInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invoice = await Invoice.findOne({ _id: id, userId });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
        error: 'INVOICE_NOT_FOUND'
      });
    }

    await invoice.markAsSent();

    res.json({
      message: 'Invoice marked as sent successfully',
      invoice
    });

  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({
      message: 'Failed to send invoice',
      error: 'SEND_INVOICE_ERROR'
    });
  }
};

// Mark invoice as paid
const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invoice = await Invoice.findOne({ _id: id, userId });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
        error: 'INVOICE_NOT_FOUND'
      });
    }

    await invoice.markAsPaid();

    res.json({
      message: 'Invoice marked as paid successfully',
      invoice
    });

  } catch (error) {
    console.error('Mark as paid error:', error);
    res.status(500).json({
      message: 'Failed to mark invoice as paid',
      error: 'MARK_PAID_ERROR'
    });
  }
};

// Get user's invoice statistics
const getInvoiceStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Invoice.getUserStats(userId);
    
    // Calculate totals
    const totalInvoices = Object.values(stats).reduce((sum, stat) => sum + stat.count, 0);
    const totalAmount = Object.values(stats).reduce((sum, stat) => sum + stat.totalAmount, 0);

    res.json({
      message: 'Invoice statistics retrieved successfully',
      stats: {
        byStatus: stats,
        totals: {
          invoices: totalInvoices,
          amount: totalAmount
        }
      }
    });

  } catch (error) {
    console.error('Get invoice stats error:', error);
    res.status(500).json({
      message: 'Failed to retrieve invoice statistics',
      error: 'GET_STATS_ERROR'
    });
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  markAsPaid,
  getInvoiceStats
};
