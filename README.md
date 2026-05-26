# LearnNext School ERP (MVP)

Monorepo:
- `apps/api`: Express + MongoDB (Mongoose), JWT auth + role guards, REST resources with pagination/search/filters
- `apps/web`: Next.js 15 (App Router) + Tailwind, Zustand auth, reusable CRUD pages, dashboard charts

## Requirements
- Node.js 20+ (you have Node 24)
- MongoDB running locally or a MongoDB URI

## Setup
1. Install deps:
   - `npm install`
2. Configure API env:
   - Copy `apps/api/.env.example` to `apps/api/.env`
   - Set `MONGODB_URI` and `JWT_SECRET`
3. Configure Web env:
   - Copy `apps/web/.env.local.example` to `apps/web/.env.local`

## Seed Admin
- `npm run seed`

Default admin (from `apps/api/.env`):
- Email: `admin@learnnext.com`
- Password: `Admin@123`

## Run
- `npm run dev`

URLs:
- API: `http://localhost:5000/api/health`
- Web: `http://localhost:3000`

## Modules (MVP)
Dashboard + reusable CRUD pages:
- Students, Teachers, Attendance, Fees, Payments, Exams, Results, Notices, Homework, Timetable, Library, Parent Comms

