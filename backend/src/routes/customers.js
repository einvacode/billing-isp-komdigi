const express = require('express');
const CustomerController = require('../controllers/customerController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create customer (Admin & Staff only)
router.post('/', authorize('admin', 'staff'), CustomerController.createCustomer);

// Get all customers
router.get('/', CustomerController.getAllCustomers);

// Get customer by ID
router.get('/:id', CustomerController.getCustomer);

// Update customer (Admin & Staff only)
router.put('/:id', authorize('admin', 'staff'), CustomerController.updateCustomer);

// Delete customer (Admin only)
router.delete('/:id', authorize('admin'), CustomerController.deleteCustomer);

// Verify NPWP (Admin only)
router.post('/:id/verify-npwp', authorize('admin'), CustomerController.verifyNPWP);

// Change customer status (Admin & Staff only)
router.put('/:id/status', authorize('admin', 'staff'), CustomerController.changeStatus);

module.exports = router;
