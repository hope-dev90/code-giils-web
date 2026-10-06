# Umuco Core Marketplace

React (Vite) frontend, Express API, PostgreSQL marketplace data, email OTP authentication, JWT sessions, and Google OAuth.

## Local setup

Requirements: Node.js 18+, PostgreSQL, and a Gmail account with 2-Step Verification and an App Password.

1. Configure `backend/.env` from `backend/.env.example`:
   - `DATABASE_URL`: any PostgreSQL connection string. The API currently uses the existing hosted PostgreSQL connection.
   - `JWT_SECRET`: a long, random secret.
   - `SMTP_USER` and `SMTP_APP_PASSWORD`: Gmail address and its 16-character Google App Password. SMTP uses `smtp.gmail.com:465` by default.
   - For Google sign-in, set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.
2. Initialize the database and run the API:
   ```bash
   cd backend
   npm install
   npm run db:init
   npm run seed
   npm run dev               # http://localhost:5000
   ```
3. Configure the frontend and start Vite:
   ```bash
   cd umuco_front/umuco_front
   cp .env.example .env      # VITE_API_BASE=http://localhost:5000
   npm install
   npm run dev               # http://localhost:5173
   ```

Registration emails contain a six-digit code, valid for 10 minutes. A code can be requested again after 60 seconds; verification is limited to five attempts. Password reset uses the same Gmail SMTP delivery path. `AUTH_FROM_EMAIL` is optional and defaults to `SMTP_USER`.

Users who register get the USER role. ADMIN is assigned by the seed script or in the database:
`UPDATE users SET role='ADMIN' WHERE email='you@example.com';`

## Google Sign-In

In Google Cloud Console, use a Web application OAuth client and add the frontend origins under Authorized JavaScript origins, including `http://localhost:5173` and the Vercel production domain. Set `VITE_GOOGLE_CLIENT_ID` in the frontend environment (Vercel: Project Settings → Environment Variables). This client ID is public by design. Keep `GOOGLE_CLIENT_ID` on the backend set to the same value; keep `GOOGLE_CLIENT_SECRET` backend-only for the legacy redirect flow. The browser shows Google's sign-in prompt directly, then sends its credential to the API for verification and session creation.

## Purchase flow

View a product, sign in or register, then choose “Buy now”. Checkout is simulated; no payment gateway is connected. Admins can change order status in the dashboard.

## Deployment

**Backend (Render):** use the repository's `render.yaml` with root directory `backend`. Set `DATABASE_URL`, `CLIENT_URL`, `PUBLIC_API_URL`, `JWT_SECRET`, `SMTP_USER`, and `SMTP_APP_PASSWORD`. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` to enable Google sign-in. The start command initializes the schema before launching the API. Railway works with the same variables.

**Frontend (Vercel):** set `VITE_API_BASE` to the backend origin, for example `https://your-api.example.com`, and set `VITE_GOOGLE_CLIENT_ID` to the Google Web client ID. These Vite variables are embedded at build time, so redeploy after changing them.

## Security notes

- The API hashes passwords and one-time codes, limits OTP verification attempts, and signs expiring JWT sessions.
- `DATABASE_URL` is provider agnostic; use any PostgreSQL provider. The current local environment still points to the existing hosted database, but the app no longer uses Supabase Auth or its email delivery.
- Use a long random `JWT_SECRET` in production and change the seeded admin password.
