/**
 * Business Routes
 */

const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/businessController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/', BusinessController.create);
router.get('/', BusinessController.getAll);
router.get('/:id', BusinessController.getById);
router.put('/:id', BusinessController.update);
router.delete('/:id', BusinessController.delete);

module.exports = router;
