const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken, checkInvoiceLimit, checkResourceOwnership } = require('../middleware/auth');
const Invoice = require('../models/Invoice');

// All routes require authentication
router.use(authenticateToken);

// Get all invoices for the authenticated user
router.get('/', invoiceController.getInvoices);

// Get invoice statistics
router.get('/stats', invoiceController.getInvoiceStats);

// Create new invoice (check invoice limit for free users)
router.post('/', checkInvoiceLimit, invoiceController.createInvoice);

// Get single invoice by ID
router.get('/:id', checkResourceOwnership(Invoice), invoiceController.getInvoice);

// Update invoice
router.put('/:id', checkResourceOwnership(Invoice), invoiceController.updateInvoice);

// Delete invoice
router.delete('/:id', checkResourceOwnership(Invoice), invoiceController.deleteInvoice);

// Send invoice (mark as sent)
router.post('/:id/send', checkResourceOwnership(Invoice), invoiceController.sendInvoice);

// Mark invoice as paid
router.post('/:id/mark-paid', checkResourceOwnership(Invoice), invoiceController.markAsPaid);

module.exports = router;
