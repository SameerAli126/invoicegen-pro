const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken, checkResourceOwnership } = require('../middleware/auth');
const Client = require('../models/Client');

// All routes require authentication
router.use(authenticateToken);

// Get all clients for the authenticated user
router.get('/', clientController.getClients);

// Get client statistics
router.get('/stats', clientController.getClientStats);

// Get clients with outstanding balances
router.get('/outstanding', clientController.getClientsWithOutstandingBalance);

// Create new client
router.post('/', clientController.createClient);

// Get single client by ID
router.get('/:id', checkResourceOwnership(Client), clientController.getClient);

// Update client
router.put('/:id', checkResourceOwnership(Client), clientController.updateClient);

// Delete client
router.delete('/:id', checkResourceOwnership(Client), clientController.deleteClient);

// Update client financial statistics
router.post('/:id/update-stats', checkResourceOwnership(Client), clientController.updateClientStats);

module.exports = router;
