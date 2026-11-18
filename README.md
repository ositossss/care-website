<<<<<<< HEAD
# CareFirst General Hospital – Management & Patient Portal
React (Vite) + Tailwind · Node/Express · MongoDB (Mongoose) · JWT auth.

## Prerequisites
Node.js 18+ and MongoDB (local install, or a free MongoDB Atlas cluster – paste its connection string into `MONGO_URI`).

## Setup
```bash
# Backend
cd server && cp .env.example .env     # edit MONGO_URI and JWT_SECRET
npm install && npm run seed && npm run dev   # http://localhost:5000
# Frontend (new terminal)
cd client && cp .env.example .env
npm install && npm run dev                   # http://localhost:5173
```
## Test admin login
`admin@carefirst.com` / `Admin@123` (created by `npm run seed`; re-running the seed resets all data).

## Layout
`server/models` schemas · `server/routes` REST API · `server/middleware/auth.js` JWT + errors · `server/seed.js` sample data.
`client/src/pages` one file per page · `client/src/api.js` Axios setup · `client/src/ui.jsx` shared components.

## Not yet built
Admin screens for adding/editing doctors and departments (the API endpoints exist: `POST/PUT/DELETE /api/doctors` and `/api/departments`, admin token required).
=======
# care-website
>>>>>>> 37ba225301a753b7449f9da5e0aae84e725c00b6
