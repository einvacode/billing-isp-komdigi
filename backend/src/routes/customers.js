const express = require('express');
const CustomerController = require('../controllers/customerController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware: All routes require authentication
router.use(verifyToken);

// Public routes (all authenticated users)
router.post('/', CustomerController.createCustomer);
router.get('/', CustomerController.getAllCustomers);
router.get('/stats/overview', CustomerController.getCustomerStats);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', CustomerController.updateCustomer);

// Admin only routes
router.delete('/:id', authorize('admin'), CustomerController.deleteCustomer);
router.post('/:id/suspend', authorize('admin', 'staff'), CustomerController.suspendCustomer);
router.post('/:id/reactivate', authorize('admin', 'staff'), CustomerController.reactivateCustomer);

module.exports = router;
