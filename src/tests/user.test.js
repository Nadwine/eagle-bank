const request = require('supertest');
const app = require('../app');
const prisma = require('../config/prisma');

beforeAll(async () => {
  // Clears the test DB in the correct order to avoid foreign key constraint issues
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User Registration and Login', () => {
  let token;

  it('should register a user', async () => {
    const res = await request(app).post('/v1/users').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login the user', async () => {
    const res = await request(app).post('/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should not register with missing fields', async () => {
    const res = await request(app).post('/v1/users').send({
      email: 'fail@example.com',
    });

    expect(res.statusCode).toBe(400);
  });
});
