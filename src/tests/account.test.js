const request = require('supertest');
const app = require('../app');
const prisma = require('../config/prisma');

let token;
let userId;
let accountId;

beforeAll(async () => {
  // Clean DB
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create user
  const userRes = await request(app).post('/v1/users').send({
    name: 'Transaction Tester',
    email: 'txn@test.com',
    password: 'secure123',
  });
  userId = userRes.body.id;

  // Authenticate user
  const loginRes = await request(app).post('/v1/auth/login').send({
    email: 'txn@test.com',
    password: 'secure123',
  });
  token = loginRes.body.token;

  // Create account via API 
  const accountRes = await request(app)
    .post('/v1/accounts')
    .set('Authorization', `Bearer ${token}`)
    .send({ type: 'checking' });

  accountId = accountRes.body.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Transactions and Deposits', () => {
  it('should create a deposit transaction and update account balance', async () => {
    const res = await request(app)
      .post(`/v1/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'deposit',
        amount: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
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
    expect(res.body[0]).toHaveProperty('type', 'deposit');
    expect(res.body[0]).toHaveProperty('amount', 100);
  });
});
