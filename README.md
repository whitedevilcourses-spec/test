# Student Permission & Leave Management System

A full-stack web application for managing student leave and permission requests with role-based approvals.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: JWT

## Modules

- Student: submit leave/permission forms and view request history
- Faculty/Proctor: review assigned student requests
- HOD: final departmental approval
- Admin: manage users, student profiles, and student-faculty/proctor mappings

## Features

- JWT login system
- Role-based dashboard and navigation
- Leave request form
- Permission request form
- Faculty -> Proctor -> HOD approval workflow
- Admin override approval/rejection
- Notifications for submissions and status changes
- Approval history tracking
- Student-faculty/proctor mapping
- Admin management panel

## Project Structure

```text
client/                 React + Tailwind frontend
server/                 Express API
server/database/        MySQL schema and seed data
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure backend environment

```bash
cp server/.env.example server/.env
```

Update `server/.env` with your MySQL credentials and a strong `JWT_SECRET`.

### 3. Create and seed the database

```bash
mysql -u root -p < server/database/schema.sql
mysql -u root -p < server/database/seed.sql
```

### 4. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@example.com | student123 |
| Faculty | faculty@example.com | faculty123 |
| Proctor | proctor@example.com | proctor123 |
| HOD | hod@example.com | hod123 |
| Admin | admin@example.com | admin123 |

## Useful Scripts

```bash
npm run dev       # Start frontend and backend
npm run build     # Build frontend
npm run start     # Start backend
```

## API Overview

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/requests`
- `POST /api/requests`
- `GET /api/requests/:id`
- `PATCH /api/requests/:id/decision`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/students/:id/mapping`
