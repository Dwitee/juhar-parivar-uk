# juhar-parivar-uk
website and registration page for the org juhar parivar uk

# 🌾 Nuakhai Bhetghat 2025 – 🙏 Juhar Parivar UK 🇬🇧

[![Deploy with Vercel](https://vercel.badge.vercel.app/api?label=Deployed&style=for-the-badge)](https://vercel.com)
![Stripe](https://img.shields.io/badge/Stripe-Enabled-blueviolet?logo=stripe&style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Connected-3ECF8E?logo=supabase&style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

A full-stack web application built for **Nuakhai Bhetghat 2025** by **Juhar Parivar UK** — to enable seamless guest registration, payment, ticketing, and admin management.

---

## 🌐 Live Website

🔗 https://www.juharparivar.org.uk/

---

## 🚀 Features

### 📄 Website & Hosting
- Built with **Next.js 14** App Router
- Deployed on **Vercel**
- Fully responsive across devices
- Key Pages:
  - `/index` – Home
  - `/event` – Event Details
  - `/register` – Registration Form
  - `/checkout` – Payment Page

---

### 💳 Stripe Payment Integration
- Stripe Checkout for secure card payments
- Metadata includes:
  - Name, Phone, Guest counts (Veg/Non-Veg)
  - Donation amount
- Automatic receipt email from Stripe
- Webhooks (`payment_intent.succeeded`) used to trigger ticket processing

---

### 🎟️ Automated QR Code Ticketing
- QR code generated per ticket using `bwip-js`
- HTML email sent via **nodemailer** (Gmail SMTP)
- Includes:
  - Guest summary
  - QR Code for scanning at the gate
- BCC to organizers for tracking

---

### 🧠 Supabase Integration (PostgreSQL + Auth + Realtime)
- Stores all registration data:
  - Name, Email, Phone
  - Guest breakdown (Veg/Non-Veg for Adults, Children, Parents)
  - Amount paid and donation
  - `checked_in_at` status for entry scan
- Admin dashboard through Supabase UI
- Easy filtering and exporting of data

---

### 📱 Mobile-Optimized UX
- Phone number input with country code selector
- Guest category inputs for clarity
- Mobile-first design with polished ticket layout

---

## 📁 Environment Variables

Make sure to set these in `.env.local` or Vercel Project Settings:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
EMAIL_USERNAME=youremail@gmail.com
EMAIL_PASSWORD=your-app-password
