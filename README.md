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

### 💳 Payment Integration

- 25% deposit required at booking
- Secure Stripe payment processing
- Automatic booking confirmation after payment
- Webhook handling for payment status

### 📱 Fully Responsive

- Mobile-friendly navigation
- Responsive design for all devices
- Touch-optimized interface
- Smooth animations

## 🚀 Live Demo

Try it here: https://salon-booking-saas-kappa.vercel.app

### Test Payment Card:

- Card: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`

### Demo Accounts:

**Customer Login:**

- Email: test1@gmail.com
- Password: 123456

**Admin Login:**

- Email: yehan@gmail.com
- Password: 123456

⚠️ Note: Webhook is configured for production. Payments are test mode only.

## Recent Updates (June 2026)

- ✅ Stripe payment integration
- ✅ Mobile responsive design
- ✅ Webhook payment confirmation
- ✅ Booking only after successful payment

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
