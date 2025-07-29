const prisma = require('../config/prisma');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} = require('../utils/error');

async function createTransaction(accountId, userId, type, amount) {
  if (!['deposit', 'withdrawal'].includes(type)) {
    throw new BadRequestError('Invalid transaction type');
  }

  if (amount <= 0) {
    throw new BadRequestError('Amount must be greater than zero');
  }

  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new NotFoundError('Account not found');
  }

  if (account.userId !== userId) {
    throw new ForbiddenError();
  }

  if (type === 'withdrawal' && amount > account.balance) {
    throw new UnprocessableEntityError('Insufficient funds');
  }

  const updatedBalance =
    type === 'deposit' ? account.balance + amount : account.balance - amount;

  const transaction = await prisma.$transaction(async (tx) => {
    const createdTransaction = await tx.transaction.create({
      data: { accountId, type, amount },
    });

    await tx.account.update({
      where: { id: accountId },
      data: { balance: updatedBalance },
    });

    return createdTransaction;
  });

  return transaction;
}

async function getTransactions(accountId, userId) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) throw new NotFoundError('Account not found');
  if (account.userId !== userId) throw new ForbiddenError();

  return await prisma.transaction.findMany({
    where: { accountId },
  });
}

async function getTransactionById(accountId, transactionId, userId) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) throw new NotFoundError('Account not found');
  if (account.userId !== userId) throw new ForbiddenError();

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.accountId !== accountId)
    throw new NotFoundError('Transaction not found');

  return transaction;
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
};
