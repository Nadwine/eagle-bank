const transactionService = require('../services/transactionService');

exports.createTransaction = async (req, res, next) => {
  try {
    const { type, amount } = req.body;
    const { accountId } = req.params;

    const tx = await transactionService.createTransaction(accountId, req.user.id, type, amount);
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const txs = await transactionService.getTransactions(accountId, req.user.id);
    res.json(txs);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const { accountId, transactionId } = req.params;
    const tx = await transactionService.getTransactionById(accountId, transactionId, req.user.id);
    res.json(tx);
  } catch (err) {
    next(err);
  }
};
