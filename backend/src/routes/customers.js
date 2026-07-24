const express = require('express');
const CustomerController = require('../controllers/customerController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

// All customer routes require authentication
router.use(verifyToken);

// Create customer (Admin & Staff only)
router.post('/', authorize('admin', 'staff'), CustomerController.createCustomer);

// Get all customers
router.get('/', CustomerController.getAllCustomers);

// Get customer by account number
router.get('/account/:accountNumber', CustomerController.getCustomerByAccountNumber);

// Get customer by ID
router.get('/:id', CustomerController.getCustomerById);

// Update customer (Admin & Staff only)
router.put('/:id', authorize('admin', 'staff'), CustomerController.updateCustomer);

// Update customer status (Admin & Staff only)
router.patch('/:id/status', authorize('admin', 'staff'), CustomerController.updateCustomerStatus);

// Delete customer (Admin only)
router.delete('/:id', authorize('admin'), CustomerController.deleteCustomer);

module.exports = router;
