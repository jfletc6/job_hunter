# Job Hunter (Fletch-Net.io)

A full-stack MERN application for tracking job applications and the companies behind them. Built as a personal tool to stay organized during a job search — log companies, track applications by status, and see everything from a single dashboard.

**Live site:** [fletch-net.io](https://www.fletch-net.io) *(currently being stabilized — expect intermittent downtime)*

## Features

- **JWT authentication** with rotating refresh tokens stored as httpOnly cookies
- **Company tracking** — add, view, and delete companies you're targeting
- **Application tracking** — log applications tied to a company, grouped by company on the dashboard, with status tracking (e.g. applied, interviewing, rejected, offer)
- **Dashboard** with at-a-glance widgets summarizing application activity
- **Dark theme UI** throughout

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Plain CSS (single global stylesheet)

**Backend**
- Node.js + Express
- MongoDB Atlas via Mongoose
- JWT for access tokens, rotating refresh tokens via httpOnly cookies

**Infrastructure**
- Vercel (frontend and backend deployed as two separate projects)
- Cloudflare (DNS / domain management)
- MongoDB Atlas (database)

## Project Structure

```
job_hunter/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # NavBar, widgets, shared UI
│   │   ├── pages/          # Dashboard, AddApplication, MyApplications, AddCompany, MyCompanies
│   │   └── App.css         # Global stylesheet
│   └── package.json
│
├── server/                  # Express backend
│   ├── api/
│   │   └── index.js        # Vercel serverless entry point
│   ├── models/              # Mongoose schemas (Application, Company, User, RefreshToken)
│   ├── routes/              # Auth, application, and company routes
│   ├── middleware/          # requireAuth, CORS config
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- A MongoDB Atlas cluster (or local MongoDB instance)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/jfletc6/job_hunter.git
cd job_hunter
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Run the backend locally:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:3000
```

Run the frontend locally:

```bash
npm run dev
```

The app should now be running locally, with the frontend on Vite's default port (typically `5173`) and the backend on whatever port your Express server listens on.

## Deployment Notes

This project is deployed as **two separate Vercel projects** — one for the frontend (`client/`) and one for the backend (`server/`), connected via a custom domain managed through Cloudflare.

A few deployment-specific requirements:

- The backend uses `api/index.js` as its serverless entry point, with `"type": "module"` set in `server/package.json` (the project uses ES modules throughout)
- A `vercel.json` catch-all rewrite is required so all backend routes resolve through the single serverless function
- MongoDB Atlas's Network Access list must allow connections from anywhere (`0.0.0.0/0`), since Vercel's serverless functions don't have fixed IPs
- `MONGO_URI` and `JWT_SECRET` must be set in the Vercel dashboard under the backend project's environment variables — local `.env` files are not picked up in production
- `VITE_API_URL` (frontend) must include the `https://` protocol

## Roadmap

- [ ] Finish and test refresh token rotation flow end-to-end
- [ ] Build frontend session-expiration countdown modal
- [ ] Verify and harden serverless MongoDB connection caching across invocations
- [ ] Additional dashboard analytics/widgets
- [ ] AI-powered email tracking

## Author

Built by [Joe Fletcher](https://github.com/jfletc6)
