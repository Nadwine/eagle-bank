const express = require('express');
const router = express.Router({ mergeParams: true });
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createTransactionSchema } = require('../validations/transactionSchemas');

router.use(authMiddleware);

router.post('/:accountId/transactions', validate(createTransactionSchema), transactionController.createTransaction);
router.get('/:accountId/transactions', transactionController.getTransactions);
router.get('/:accountId/transactions/:transactionId', transactionController.getTransactionById);

module.exports = router;
