/**
 * Business Routes
 */

const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/businessController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication and rate limiting
router.use(authenticate);
router.use(apiLimiter);

router.post('/', BusinessController.create);
router.get('/', BusinessController.getAll);
router.get('/:id', BusinessController.getById);
router.put('/:id', BusinessController.update);
router.delete('/:id', BusinessController.delete);

module.exports = router;
