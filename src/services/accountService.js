const prisma = require('../config/prisma');

async function createAccount(userId, type) {
  return await prisma.account.create({
    data: {
      userId,
      type,
      balance: 0,
    },
  });
}

async function getAccountsByUser(userId) {
  return await prisma.account.findMany({
    where: { userId },
  });
}

async function getAccountById(id) {
  return await prisma.account.findUnique({
    where: { id },
    include: { transactions: true },
  });
}

async function updateAccount(id, type) {
  return await prisma.account.update({
    where: { id },
    data: { type },
  });
}

async function deleteAccount(id) {
  return await prisma.account.delete({ where: { id } });
}

module.exports = {
  createAccount,
  getAccountsByUser,
  getAccountById,
  updateAccount,
  deleteAccount,
};
