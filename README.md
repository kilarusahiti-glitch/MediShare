# MediShare

A full-stack healthcare web application connecting patients, doctors, and diagnostic centers.

## Tech Stack

- **Frontend:** React 19, React Router, Axios, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT, bcryptjs

## Project Structure

```
MediShare/
├── client/   # React frontend
└── server/   # Express backend
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance (local or Atlas)

### Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd MediShare
   ```

2. **Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in `server/`:
   ```env
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   PORT=5000
   ```
   ```bash
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Features

- User registration & login (JWT-based auth)
- Role-based dashboards: Patient, Doctor, Diagnostic Center
- Appointment booking and management
- Prescriptions and medical reports
- Patient profile management

## API Routes

| Prefix | Description |
|---|---|
| `/api/auth` | Register, login |
| `/api/patient` | Patient profile |
| `/api/doctor` | Doctor profile & data |
| `/api/diagnostic` | Diagnostic center data |
| `/api/appointments` | Appointment management |
| `/api/reports` | Medical reports |
| `/api/prescriptions` | Prescriptions |
