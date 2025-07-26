const accountService = require('../services/accountService');

exports.createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.user.id, req.body.type);
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getAccountsByUser(req.user.id);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};

exports.getAccountById = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    res.json(account);
  } catch (err) {
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    const updated = await accountService.updateAccount(account.id, req.body.type);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    if (account.transactions.length > 0) {
      return res.status(409).json({ message: 'Cannot delete account with transactions' });
    }

    await accountService.deleteAccount(account.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
