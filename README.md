# Banking API – Take Home Project

This project is a secure and testable RESTful API for managing users, bank accounts, and transactions (deposits & withdrawals). It’s built with **Node.js**, **Express**, and **Prisma ORM**, using **PostgreSQL** as the database.

---

## Tech Stack

- **Node.js** + **Express.js**
- **Prisma ORM** with PostgreSQL
- **JWT-based authentication**
- **Jest** for automated testing
- **Joi** for request validation

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/your-username/banking-api.git
cd banking-api
npm install
```

### 2. Set up Environment Variables
- Create a .env file in the root directory:

```.env
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret
```

### 3. Migrate the Database

```bash
npx prisma migrate dev --name init
```
#### To generate the Prisma client:

```bash
npx prisma generate
```
4. Start the Server

```bash
npm run dev
```
## Running Tests

```bash
npm test
```
### Tests cover:

- User registration and login

- Authenticated CRUD for accounts

- Transaction creation (deposit, withdrawal)

- Access control and error handling

## API Endpoints Overview

### Auth
`POST /v1/auth/login` – Login with email/password

### Users
`POST /v1/users` – Register a new user

`GET /v1/users/:userId` – Get user profile (auth required)

`PATCH /v1/users/:userId` – Update user (auth required)

`DELETE /v1/users/:userId` – Delete user (auth required)

### Accounts
`POST /v1/accounts` – Create account (auth required)

`GET /v1/accounts` – List user accounts (auth required)

`GET /v1/accounts/:id`– Get single account

`PATCH /v1/accounts/:id` – Update account

`DELETE /v1/accounts/:id` – Delete account (only if no transactions)

### Transactions
`POST /v1/accounts/:accountId/transactions` – Create transaction (deposit/withdrawal)

`GET /v1/accounts/:accountId/transactions` – List all transactions

`GET /v1/accounts/:accountId/transactions/:transactionId` – Get single transaction

### Notes
- JWT must be sent via Authorization: Bearer <token> header

- Users can only access their own accounts and transactions

- Passwords are hashed with bcrypt

- Joi is used to validate incoming request bodies

- Prisma includes referential integrity between users, accounts, and transactions

## Future Improvements

- **OpenAPI Spec:** The prompt asks to update the OpenAPI specification with your authentication endpoint; this has not been included yet.
- **Swagger Documentation:** There is no Swagger or OpenAPI UI documentation for the implemented routes.
- **Transaction Detail Endpoint:** The `/v1/accounts/{accountId}/transactions/{transactionId}` route is implemented but not covered in tests.
- **User DELETE Constraints (with accounts):** Currently, users with accounts can be deleted; this should return a `409 Conflict` as per the spec.
- **Account DELETE Constraints (with transactions):** The spec does not mention blocking deletion, but the current implementation blocks it if transactions exist
- **Forbidden Access Tests:** Some scenarios like accessing another user’s resources (e.g. fetching/deleting/updating other user accounts) are likely not fully tested.
- **More Negative Test Cases:** Test cases for edge conditions like invalid/missing path params (e.g. malformed UUIDs) or missing fields could be expanded.



