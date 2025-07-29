const request = require('supertest');
const app = require('../app');
const prisma = require('../config/prisma');

let token;
let accountId;

beforeAll(async () => {
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const userRes = await request(app).post('/v1/users').send({
    name: 'Transaction Tester',
    email: 'txn@test.com',
    password: 'secure123',
  });
  userId = userRes.body.id;

  const loginRes = await request(app).post('/v1/auth/login').send({
    email: 'txn@test.com',
    password: 'secure123',
  });
  token = loginRes.body.token;

  const accountRes = await request(app)
    .post('/v1/accounts')
    .set('Authorization', `Bearer ${token}`)
    .send({ type: 'checking' });

  accountId = accountRes.body.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Transaction Tests (Happy & Negative Cases)', () => {
  it('should create a deposit transaction', async () => {
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'deposit', amount: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('type', 'deposit');
    expect(res.body).toHaveProperty('amount', 100);
  });

  it('should list transactions for the account', async () => {
    const res = await request(app)
      .get(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // -------------------
  // Negative test cases


  it('should reject invalid transaction type', async () => {
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'invalid', amount: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/must be one of/i);
  });

  it('should reject zero or negative amount', async () => {
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'deposit', amount: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/positive number/i);
  });

  it('should reject withdrawal with insufficient funds', async () => {
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'withdrawal', amount: 1000 });

    expect(res.statusCode).toBe(422);
    expect(res.body.message).toMatch(/insufficient funds/i);
  });

  it('should return 404 for non-existent account', async () => {
    const fakeId = 'acc_fake_123';
    const res = await request(app)
      .post(`/v1/accounts/${fakeId}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'deposit', amount: 100 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/account not found/i);
  });

  it('should return 403 when accessing another user\'s account', async () => {
    // Create a second user
    const resUser = await request(app).post('/v1/users').send({
      name: 'Other User',
      email: 'other@test.com',
      password: 'secure123',
    });
    const otherUserId = resUser.body.id;

    const resLogin = await request(app).post('/v1/auth/login').send({
      email: 'other@test.com',
      password: 'secure123',
    });
    const otherToken = resLogin.body.token;

    // Try to deposit into original user's account
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ type: 'deposit', amount: 100 });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/forbidden/i);
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .send({ type: 'deposit', amount: 100 });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/missing or invalid token/i);
  });
});
