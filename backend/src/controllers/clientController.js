const Client = require('../models/Client');

// Get all clients for the authenticated user
const getClients = async (req, res) => {
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
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Client.countDocuments(query);

    res.json({
      message: 'Clients retrieved successfully',
      clients,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      message: 'Failed to retrieve clients',
      error: 'GET_CLIENTS_ERROR'
    });
  }
};

// Get single client by ID
const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const client = await Client.findOne({ _id: id, userId });
    
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
        error: 'CLIENT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Client retrieved successfully',
      client
    });

  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      message: 'Failed to retrieve client',
      error: 'GET_CLIENT_ERROR'
    });
  }
};

// Create new client
const createClient = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      email,
      phone,
      company,
      address,
      notes,
      preferredPaymentTerms,
      customPaymentTerms,
      taxId,
      taxExempt
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        message: 'Client name and email are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Create client
    const client = new Client({
      userId,
      name,
      email,
      phone,
      company,
      address,
      notes,
      preferredPaymentTerms,
      customPaymentTerms,
      taxId,
      taxExempt
    });

    await client.save();

    res.status(201).json({
      message: 'Client created successfully',
      client
    });

  } catch (error) {
    console.error('Create client error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message || 'Validation error',
        error: 'VALIDATION_ERROR',
        details: Object.values(error.errors || {}).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Failed to create client',
      error: 'CREATE_CLIENT_ERROR'
    });
  }
};

// Update client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    // Don't allow updating certain fields
    delete updateData.userId;
    delete updateData.totalInvoiced;
    delete updateData.totalPaid;
    delete updateData.invoiceCount;
    delete updateData.lastInvoiceDate;
    delete updateData.lastPaymentDate;

    const client = await Client.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
        error: 'CLIENT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Client updated successfully',
      client
    });

  } catch (error) {
    console.error('Update client error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message || 'Validation error',
        error: 'VALIDATION_ERROR',
        details: Object.values(error.errors || {}).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Failed to update client',
      error: 'UPDATE_CLIENT_ERROR'
    });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if client has any invoices
    const Invoice = require('../models/Invoice');
    const client = await Client.findOne({ _id: id, userId });
    
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
        error: 'CLIENT_NOT_FOUND'
      });
    }

    const invoiceCount = await Invoice.countDocuments({ 
      userId, 
      clientEmail: client.email 
    });

    if (invoiceCount > 0) {
      return res.status(400).json({
        message: `Cannot delete client with ${invoiceCount} existing invoice(s). Please delete invoices first or set client status to inactive.`,
        error: 'CLIENT_HAS_INVOICES',
        invoiceCount
      });
    }

    await Client.findOneAndDelete({ _id: id, userId });

    res.json({
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      message: 'Failed to delete client',
      error: 'DELETE_CLIENT_ERROR'
    });
  }
};

// Get client statistics
const getClientStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Client.getUserClientStats(userId);

    res.json({
      message: 'Client statistics retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({
      message: 'Failed to retrieve client statistics',
      error: 'GET_CLIENT_STATS_ERROR'
    });
  }
};

// Get clients with outstanding balances
const getClientsWithOutstandingBalance = async (req, res) => {
  try {
    const userId = req.user._id;

    const clients = await Client.findWithOutstandingBalance(userId);

    res.json({
      message: 'Clients with outstanding balances retrieved successfully',
      clients
    });

  } catch (error) {
    console.error('Get outstanding clients error:', error);
    res.status(500).json({
      message: 'Failed to retrieve clients with outstanding balances',
      error: 'GET_OUTSTANDING_CLIENTS_ERROR'
    });
  }
};

// Update client financial stats
const updateClientStats = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const client = await Client.findOne({ _id: id, userId });
    
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
        error: 'CLIENT_NOT_FOUND'
      });
    }

    await client.updateFinancialStats();

    res.json({
      message: 'Client statistics updated successfully',
      client
    });

  } catch (error) {
    console.error('Update client stats error:', error);
    res.status(500).json({
      message: 'Failed to update client statistics',
      error: 'UPDATE_CLIENT_STATS_ERROR'
    });
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getClientsWithOutstandingBalance,
  updateClientStats
};
