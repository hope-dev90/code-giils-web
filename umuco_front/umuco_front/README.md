# UmucoCore

## Run the frontend and API locally

The frontend uses the Express API in `../../backend`. Configure the API connection in `.env.local`:

```env
VITE_API_BASE=http://localhost:5000
```

Configure the backend in `../../backend/.env` with a PostgreSQL connection and JWT secret. Start both services in separate terminals:

```sh
cd ../../backend
npm run db:init
npm run dev
```

```sh
npm run dev
```

The frontend calls `/api/auth/register`, `/api/auth/login`, and `/api/auth/me`. Registration creates the account and signs the user in; login and signup both route to the dashboard after success. The API allows `http://localhost:5173` by default through `CLIENT_URL`.

For deployment, set `VITE_API_BASE` to the backend origin and set the backend `CLIENT_URL` to the deployed frontend origin.

Google sign-in and password reset are not implemented by the current backend. Use email and password authentication.
