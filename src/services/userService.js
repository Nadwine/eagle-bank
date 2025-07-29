const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const {
  ConflictError,
  NotFoundError,
} = require('../utils/error');

async function registerUser({ name, email, password }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const { password: _, ...safeUser } = user;
  return safeUser;
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  });
}

async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, createdAt: true },
  });
}

async function deleteUser(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { accounts: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.accounts.length > 0) {
    throw new ConflictError('Cannot delete user with bank accounts');
  }

  await prisma.user.delete({ where: { id } });
}

module.exports = {
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
};
