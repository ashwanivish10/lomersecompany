# Lomerse - Professional Invoice Generator

## Overview
Lomerse is a SaaS platform for generating professional invoices with beautiful themes. Users can choose from 13 different invoice templates, customize their brand, and download PDF invoices instantly.

## Current State (October 15, 2025)
- **Status**: MVP Complete and Running
- **Tech Stack**: React + Express + MongoDB + Razorpay + Replit Auth
- **Deployment**: Development environment ready
- **Major Migration**: Successfully migrated from PostgreSQL to MongoDB and Stripe to Razorpay

## Features Implemented

### Authentication
- Replit Auth integration for secure user login
- Support for Google, GitHub, email/password login
- Dedicated sign-in page at `/signin`
- Session management with MongoDB storage
- Protected routes and API endpoints

### Invoice Management
- Create and save invoices with custom data
- **13 professional themes** (4 basic free, 9 premium)
- Real-time invoice preview
- Invoice history and management
- **PDF Download** functionality with all themes
- Server-side theme access control

### PDF Generation
- Download invoices as PDF using jspdf and html2canvas
- All 13 themes supported
- Professional invoice layout based on attached template
- Instant download with proper formatting

### Subscription System
- **Free Tier**: Access to 4 basic themes
- **Monthly Pro (₹399/month)**: All 13 themes + unlimited invoices
- **Yearly Pro (₹3,999/year)**: Same as Monthly + 2 months free
- Razorpay payment integration with INR support
- Order creation and payment verification
- Webhook handling for payment events

### Theme Categories
1. **Basic (Free)**: default, blue, green, purple
2. **Premium Dark**: slate, ocean, sunset
3. **Professional**: mint, lavender, blush, graphite
4. **Curated**: seaside, vibrant, pastel, rose, lime

## Architecture

### Database Schema (MongoDB/Mongoose)
- **User Model**:
  - User authentication data
  - Subscription status (tier, status, expiry)
  - Razorpay customer ID
  - Invoice credits
- **Invoice Model**:
  - Invoice data with theme
  - Company and client information
  - Items array with dates, quantities, prices
  - Payment details
- **Payment Model**:
  - Razorpay payment/order IDs
  - Transaction records
  - Payment status tracking

### API Endpoints
- `GET /api/auth/user` - Get authenticated user
- `GET /api/invoices` - Get user's invoices
- `POST /api/invoices` - Create new invoice (with theme validation)
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/create-subscription-payment` - Create Razorpay order for subscription
- `POST /api/verify-payment` - Verify Razorpay payment signature
- `POST /api/razorpay-webhook` - Handle Razorpay webhooks

### Security Features
- Server-side pricing validation (never trust client)
- Theme access control enforced on backend
- Razorpay signature verification for payments
- HTTPS-aware session cookies (dev/prod)
- Authenticated API endpoints
- Input validation with Zod

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── landing.tsx        # Landing page
│   │   │   ├── signin.tsx         # Sign-in page
│   │   │   ├── dashboard.tsx      # User dashboard
│   │   │   ├── create-invoice.tsx # Invoice creator
│   │   │   └── subscription.tsx   # Subscription management
│   │   ├── components/
│   │   │   ├── invoice-editor.tsx # Invoice editing + PDF download
│   │   │   └── checkout-form.tsx  # Razorpay checkout
│   │   ├── lib/
│   │   │   └── pdfGenerator.ts    # PDF generation utility
│   │   └── hooks/
│   │       └── useAuth.ts         # Auth hook
├── server/
│   ├── models.ts                  # MongoDB/Mongoose models
│   ├── storage.ts                 # MongoDB storage operations
│   ├── routes.ts                  # API routes with Razorpay
│   ├── replitAuth.ts              # Auth configuration
│   └── index.ts                   # Express server
└── SETUP_GUIDE.md                 # MongoDB & Razorpay setup guide
```

## Environment Variables
### Required (User Must Configure):
- `MONGODB_URI` or `MONGODB_URL` - MongoDB connection string
- `RAZORPAY_KEY_ID` - Razorpay API Key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API Key Secret

### Optional:
- `RAZORPAY_WEBHOOK_SECRET` - Razorpay webhook signature verification
- `SESSION_SECRET` - Session encryption key (auto-configured by Replit)
- `REPLIT_DOMAINS` - Deployment domains (auto-configured)

## Design System
- **Primary Color**: Orange (#f59e0b) - Energy and professionalism
- **Font**: Inter for UI, Poppins for headers, Dancing Script for "Thank You"
- **Components**: Shadcn UI with Tailwind CSS
- **Theme**: Light mode with orange accents

## User Journey
1. User visits landing page → sees features and pricing
2. Clicks "Sign In" → goes to `/signin` page
3. Signs in via Replit Auth → authenticates
4. Lands on dashboard → sees invoice history and stats
5. Clicks "Create Invoice" → selects theme (basic or premium)
6. Fills invoice details → sees live preview
7. Downloads PDF or saves invoice
8. For premium themes → redirects to subscription page
9. Selects plan → completes Razorpay payment
10. Payment verified → subscription activated → can use all themes

## Recent Changes (October 15, 2025)
### Database Migration (PostgreSQL → MongoDB):
- Replaced Drizzle ORM with Mongoose
- Created MongoDB models for users, invoices, payments
- Updated storage layer to use MongoDB operations
- Session storage now uses connect-mongo instead of connect-pg-simple
- Graceful degradation: app works without MongoDB (shows warning)

### Payment Migration (Stripe → Razorpay):
- Replaced Stripe with Razorpay payment gateway
- Order creation with server-side pricing
- Payment signature verification
- Webhook support for payment events
- Graceful degradation: app works without Razorpay (503 for payment routes)

### New Features Added:
- **Sign-in Page**: Dedicated `/signin` page with beautiful UI
- **PDF Download**: Generate and download invoices as PDF
  - Uses jspdf and html2canvas libraries
  - All 13 themes supported
  - Professional invoice layout
- **13 Themes**: Added all themes from attached template:
  - Basic: default, blue, green, purple
  - Premium Dark: slate, ocean, sunset
  - Professional: mint, lavender, blush, graphite
  - Curated: seaside, vibrant, pastel, rose, lime

### Security & Improvements:
- Server-side pricing enforcement (PLAN_PRICES constant)
- Backend theme access control with subscription validation
- Razorpay signature verification for all payments
- Input validation with Zod schemas
- Comprehensive error handling

## Setup Instructions
See **SETUP_GUIDE.md** for detailed instructions on:
- Setting up MongoDB connection
- Configuring Razorpay credentials
- Adding secrets to Replit
- Testing the application

## Known Limitations
- No email notifications
- Single-user invoices only (no team features)
- Subscription cancellation UI not implemented
- Uses one-time Razorpay orders instead of subscriptions (manual renewal)
- No automatic subscription expiration checks

## Development Notes
- Uses Mongoose for MongoDB operations
- TanStack Query for state management
- Wouter for client-side routing
- Razorpay for payment processing
- jspdf & html2canvas for PDF generation

## Support
- Email: support@lomerse.com
- Platform: Replit
- Payment Provider: Razorpay (migrated from Stripe)
- Database: MongoDB (migrated from PostgreSQL)
