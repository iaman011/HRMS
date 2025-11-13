# HRMS Server

Minimal Node.js + Express backend for HRMS demo.

Prerequisites:
- Node.js
- PostgreSQL

Setup:
1. Copy `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

   npm install

3. Start the server:

   npm run dev

The server exposes endpoints under `/api/auth`, `/api/employees`, and `/api/teams`.
All non-auth routes require a Bearer JWT token issued by `/api/auth/login`.
