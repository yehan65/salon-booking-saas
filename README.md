# Salon Booking SaaS

A complete salon management system with customer booking portal and admin dashboard.

## Features

### Customer

- 🔐 JWT Authentication with email verification
- 💇 Browse services and staff
- 📅 Real-time availability checking
- ✨ Book appointments (3-step flow)
- 📋 View, cancel, reschedule bookings

### Admin

- 📊 Dashboard with revenue analytics
- 👥 Staff management with schedule editor
- 💼 Service management (CRUD)
- 📅 View all bookings with filters
- ✅ Update booking status
- 📧 Email notifications

## Tech Stack

- **Frontend:** React.js, Context API, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Email:** Nodemailer
- **Styling:** CSS Modules

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your values
npm run dev

### Frontend Setup
cd frontend
npm install
cp .env.example .env
# Update REACT_APP_API_URL
npm start
```
