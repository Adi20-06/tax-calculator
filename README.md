A full-stack web application that calculates income tax on salary under India's New Tax Regime (FY 2025-26), with a salary structure builder, old-vs-new regime comparison, interactive charts, PDF reports, shareable links, and user accounts with saved history.

Built with React, Node.js/Express, and PostgreSQL, with a 3D particle background (React Three Fiber) and a dark/light themed ledger-style UI.

Table of Contents:
Features
Tech Stack
Project Structure
Getting Started
Environment Variables
Database Schema
API Reference
Tax Logic
Security
Frontend Architecture
Scripts
Deployment
Roadmap
Disclaimer
License
Features

Tax calculation

New Regime slabs (0%–30%), ₹75,000 standard deduction, Section 87A rebate (zero tax up to ₹12L taxable income), marginal relief, surcharge, and 4% health & education cess
Slab-by-slab breakdown with monthly and annual take-home

Salary Structure Builder

Build a package from Basic, HRA, Special Allowance, Bonus, Other Allowances, Employer PF and Gratuity
Live Gross Salary, CTC and estimated Taxable Income as you type
Logged-in users can save, load and delete named salary profiles (e.g. "Current Job", "Offer B")

Old vs New Regime comparison

Enter gross salary and old-regime deductions (80C, 80D, HRA, etc.)
Side-by-side results with the better regime and annual savings highlighted

Visualizations

Pie chart (take-home vs tax), slab-wise bar chart, and Sankey-style income flow diagram (Recharts)
3D bar visualizer and full-window floating particle background (Three.js / React Three Fiber)
Animated counters and reveal animations (Framer Motion)

Reports and sharing

Download a PDF report with salary details, slab table, summary, charts, and timestamp
Shareable link for any saved calculation (/shared/:id)

Accounts

JWT authentication (signup, login)
Calculation history is available to logged-in users only
Guests can use the calculator freely but cannot save history or profiles

UX

Dark / light mode with persistence and no flash on load
Glassmorphism cards, toast notifications, responsive layout down to mobile widths
Tech Stack
Layer	Technology
Frontend	React (Vite), React Router, Axios, Recharts, Framer Motion, Three.js, React Three Fiber, drei
Reports	jsPDF, jspdf-autotable, html2canvas
Backend	Node.js, Express
Database	PostgreSQL (pg)
Auth	JSON Web Tokens (jsonwebtoken), bcryptjs
Security	helmet, express-rate-limit, express-validator, CORS allowlist
Project Structure
tax-calculator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── taxController.js       # Calculate, compare, history, fetch by id
│   │   │   ├── authController.js      # Signup, login, me
│   │   │   └── profileController.js   # Salary profile CRUD
│   │   ├── middleware/
│   │   │   ├── auth.js                # requireAuth / optionalAuth
│   │   │   ├── rateLimiter.js         # General, auth, calculation limiters
│   │   │   ├── validators.js          # express-validator rules
│   │   │   └── errorHandler.js        # 404 + centralized error handler
│   │   ├── routes/
│   │   │   ├── taxRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── profileRoutes.js
│   │   ├── utils/
│   │   │   └── taxLogic.js            # Slabs, rebate, surcharge, cess, regime comparison
│   │   └── app.js                     # Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/                       # Axios helpers (taxApi.js)
    │   ├── components/
    │   │   ├── charts/                # Pie, Bar, Income Flow, tabbed wrapper
    │   │   ├── layout/                # Layout, ParticleBackground, nav styles
    │   │   ├── TaxBreakdown.jsx
    │   │   ├── TaxVisualizer3D.jsx
    │   │   ├── ReportActions.jsx
    │   │   ├── CountUpNumber.jsx
    │   │   ├── RevealCard.jsx
    │   │   └── ThemeToggle.jsx
    │   ├── context/                   # Auth, Theme, Toast providers
    │   ├── pages/                     # Calculator, SalaryStructure, Compare,
    │   │                              # History, About, SharedResult, Login, Signup
    │   ├── styles/                    # tokens.css, components.css
    │   ├── utils/                     # reportGenerator.js, apiError.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
Getting Started
Prerequisites
Node.js 18+ (LTS recommended)
PostgreSQL 14+
npm
1. Clone the repository
bash
git clone <your-repo-url>
cd tax-calculator
2. Set up the database
bash
psql -U postgres
sql
CREATE DATABASE tax_calculator;
\c tax_calculator

Then run the schema from the Database Schema section below.

3. Configure and run the backend
bash
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run dev

The API starts on http://localhost:5000. Verify it with http://localhost:5000/api/health.

4. Run the frontend

In a second terminal:

bash
cd frontend
npm install
npm run dev

The app opens on http://localhost:5173.

Environment Variables

Create backend/.env (never commit this file):

Variable	Description	Example
PORT	API server port	5000
DB_USER	PostgreSQL user	postgres
DB_PASSWORD	PostgreSQL password	your_password
DB_HOST	Database host	localhost
DB_PORT	Database port	5432
DB_NAME	Database name	tax_calculator
JWT_SECRET	Long random secret for signing tokens	(see below)
ALLOWED_ORIGINS	Comma-separated list of allowed frontend origins	http://localhost:5173
NODE_ENV	development or production	development

Generate a strong JWT secret:

bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Database Schema
sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE calculations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  gross_salary NUMERIC NOT NULL,
  standard_deduction NUMERIC NOT NULL,
  taxable_income NUMERIC NOT NULL,
  tax_before_cess NUMERIC NOT NULL,
  cess NUMERIC NOT NULL,
  total_tax NUMERIC NOT NULL,
  net_take_home NUMERIC NOT NULL,
  breakdown JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE salary_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_name VARCHAR(100) NOT NULL,
  basic NUMERIC DEFAULT 0,
  hra NUMERIC DEFAULT 0,
  special NUMERIC DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  other NUMERIC DEFAULT 0,
  employer_pf NUMERIC DEFAULT 0,
  gratuity NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
API Reference

Base URL: http://localhost:5000/api

Method	Endpoint	Auth	Description
GET	/health	None	Health check and DB connectivity
POST	/auth/signup	None	Create an account, returns JWT
POST	/auth/login	None	Log in, returns JWT
GET	/auth/me	Required	Current user from token
POST	/calculate-tax	Optional	Compute New Regime tax; saved to the user's history if logged in
POST	/compare-regimes	Optional	Compare New vs Old regime
GET	/history	Required	Last 20 calculations for the user
GET	/calculation/:id	None	Fetch a single calculation (used by share links)
POST	/profiles	Required	Save a salary profile
GET	/profiles	Required	List the user's profiles
DELETE	/profiles/:id	Required	Delete a profile

Authenticated requests send the header Authorization: Bearer <token>.

Example

bash
curl -X POST http://localhost:5000/api/calculate-tax \
  -H "Content-Type: application/json" \
  -d '{"grossSalary": 1500000}'
json
{
  "id": 1,
  "grossSalary": 1500000,
  "standardDeduction": 75000,
  "taxableIncome": 1425000,
  "breakdown": [ { "range": "400,000 - 800,000", "rate": 5, "taxOnSlab": 20000 } ],
  "rebateApplied": 0,
  "surcharge": 0,
  "taxBeforeCess": 97500,
  "cess": 3900,
  "totalTax": 101400,
  "netTakeHome": 1398600
}
Tax Logic

All rules live in backend/src/utils/taxLogic.js as plain config, so updating them after a Union Budget only touches one file.

New Regime (FY 2025-26)

Taxable income	Rate
Up to ₹4,00,000	0%
₹4,00,001 – ₹8,00,000	5%
₹8,00,001 – ₹12,00,000	10%
₹12,00,001 – ₹16,00,000	15%
₹16,00,001 – ₹20,00,000	20%
₹20,00,001 – ₹24,00,000	25%
Above ₹24,00,000	30%
Standard deduction: ₹75,000 (salaried)
Section 87A rebate: up to ₹60,000 when taxable income is ₹12L or less
Marginal relief for incomes just above ₹12L
Surcharge (simplified) for high incomes, then 4% health & education cess

Old Regime uses a ₹50,000 standard deduction plus user-supplied deductions, with the older slab structure, for the comparison page.

Salary components such as Employer PF and Gratuity count toward CTC but not toward taxable gross salary. Under the New Regime, HRA and most allowance exemptions do not reduce taxable income.

Security
Helmet secure HTTP headers
Rate limiting: general (100 req / 15 min), auth (10 failed attempts / 15 min), calculation (20 req / min)
Input validation and sanitization with express-validator on every write endpoint
CORS allowlist driven by ALLOWED_ORIGINS (no wildcard)
Password hashing with bcrypt; JWTs expire after 7 days
Body size limit of 50 KB
Centralized error handler that never leaks stack traces in production
.env files are git-ignored; commit only .env.example

Known tradeoff: logout removes the token client-side only, so tokens remain valid until they expire. Shorter-lived access tokens with refresh tokens would tighten this.

Frontend Architecture
Design system: CSS custom properties in styles/tokens.css drive both themes; switching data-theme re-themes the whole app
State management: React Context for auth, theme, and toasts
Routing: React Router with a shared Layout (nav, particle background, outlet)
Pages: Calculator, Salary Structure, Old vs New, History (login required), About, Shared Result, Login, Signup
Error handling: utils/apiError.js maps API failures (including 429 rate limits and network errors) to user-friendly messages
Scripts

Backend (backend/)

Command	Description
npm run dev	Start with nodemon (auto-reload)
npm start	Start in production mode

Frontend (frontend/)

Command	Description
npm run dev	Start the Vite dev server
npm run build	Production build to dist/
npm run preview	Preview the production build
Deployment

A typical setup:

Frontend: Vercel or Netlify (build command npm run build, output dist)
Backend: Render or Railway, with NODE_ENV=production and all variables from Environment Variables set in the platform dashboard
Database: managed PostgreSQL (Render, Railway, Supabase, Neon)

Before going live:

Set ALLOWED_ORIGINS to your deployed frontend URL
Replace the hard-coded http://localhost:5000/api base URL in the frontend with an environment variable (e.g. VITE_API_URL)
Rotate JWT_SECRET and DB credentials, and run npm audit in both projects
Enable SSL for the database connection (already handled in db.js when NODE_ENV=production)
Roadmap
 Deployment guide with CI/CD
 Refresh tokens and server-side token revocation
 Old-regime deduction builder (80C, 80D, HRA exemption calculator)
 Year-over-year comparison of saved calculations
 Automated tests for tax logic (Jest) and API routes (Supertest)
Disclaimer

This tool provides estimates for educational and planning purposes based on standard salaried-income rules. It does not cover capital gains, business income, foreign income, or every surcharge edge case. Tax rules change with each Union Budget, so verify figures against the Income Tax Department's official calculator or a qualified professional before filing.

License

MIT — see LICENSE for details.
