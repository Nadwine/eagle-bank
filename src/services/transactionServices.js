const prisma = require('../config/prisma');

async function createTransaction(accountId, userId, type, amount) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { transactions: true },
  });

  if (!account) {
    const err = new Error('Account not found');
    err.status = 404;
    throw err;
  }

  if (account.userId !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  if (type === 'withdrawal' && account.balance < amount) {
    const err = new Error('Insufficient funds');
    err.status = 422;
    throw err;
  }

  const newBalance =
    type === 'deposit' ? account.balance + amount : account.balance - amount;

  const transaction = await prisma.$transaction(async (tx) => {
    const txRecord = await tx.transaction.create({
      data: { accountId, type, amount },
    });

    await tx.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return txRecord;
  });

  return transaction;
}

async function getTransactions(accountId, userId) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) throw { status: 404, message: 'Account not found' };
  if (account.userId !== userId) throw { status: 403, message: 'Forbidden' };

  return await prisma.transaction.findMany({
    where: { accountId },
  });
}

async function getTransactionById(accountId, transactionId, userId) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) throw { status: 404, message: 'Account not found' };
  if (account.userId !== userId) throw { status: 403, message: 'Forbidden' };

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.accountId !== accountId)
    throw { status: 404, message: 'Transaction not found' };

  return transaction;
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
};
