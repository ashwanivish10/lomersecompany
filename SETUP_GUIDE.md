# Lomerse Setup Guide

## Overview
Your Lomerse invoice generator has been successfully migrated to use:
- **MongoDB** for database storage
- **Razorpay** for payment processing
- **PDF Download** functionality with all 13 themes

## Required Configuration

### 1. MongoDB Setup

You need to provide a MongoDB connection string to enable database functionality.

#### Option A: MongoDB Atlas (Recommended - Free Tier Available)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free Tier)
4. Click "Connect" and get your connection string
5. Add the connection string to Replit Secrets:
   - Secret Name: `MONGODB_URI`
   - Secret Value: `mongodb+srv://username:password@cluster.mongodb.net/lomerse`

#### Option B: Other MongoDB Providers
- You can use any MongoDB provider (MongoDB Cloud, DigitalOcean, AWS, etc.)
- Get the connection string in the format: `mongodb://...` or `mongodb+srv://...`
- Add it to Replit Secrets as `MONGODB_URI` or `MONGODB_URL`

### 2. Razorpay Payment Integration

To enable payment processing, you need Razorpay API credentials.

#### Steps to Get Razorpay Credentials:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Go to Settings → API Keys
4. Generate API Keys (you'll get Key ID and Key Secret)
5. Add both to Replit Secrets:
   - Secret Name: `RAZORPAY_KEY_ID`
   - Secret Value: Your Razorpay Key ID
   - Secret Name: `RAZORPAY_KEY_SECRET`
   - Secret Value: Your Razorpay Key Secret

#### Optional: Razorpay Webhook (for advanced features)
6. Go to Settings → Webhooks
7. Add webhook URL: `https://your-repl-url.replit.dev/api/razorpay-webhook`
8. Select events: `payment.captured`, `payment.failed`
9. Copy the webhook secret and add to Replit Secrets:
   - Secret Name: `RAZORPAY_WEBHOOK_SECRET`
   - Secret Value: Your webhook secret

### 3. Session Secret (Already Configured)
The `SESSION_SECRET` is already configured by Replit Auth.

## How to Add Secrets in Replit

1. Click on the **Tools** icon in the left sidebar
2. Select **Secrets**
3. Click **+ New Secret**
4. Add the secret name and value
5. Click **Add Secret**
6. Restart your application after adding all secrets

## Pricing Plans

The application supports three pricing tiers:

### Free (Basic Themes)
- 4 basic color themes (default, blue, green, purple)
- PDF download
- Unlimited invoices

### Monthly Pro - ₹399/month
- All basic themes (4 themes)
- Premium dark themes (3 themes)
- Professional themes (4 themes)
- Curated themes (5 themes)
- Total: 16 themes
- Priority support

### Yearly Pro - ₹3,999/year
- All Monthly Pro features
- Save ₹800 annually (2 months free)
- Early access to new themes

## Features Implemented

### ✅ Authentication
- Sign-in page with Replit Auth integration
- Secure session management with MongoDB

### ✅ Invoice Management
- Create and save invoices
- 13 professional themes to choose from
- Theme-based access control (free vs premium)
- Live preview while editing

### ✅ PDF Download
- Download invoices as PDF
- All 13 themes supported
- Based on the attached template design
- Uses jspdf and html2canvas libraries

### ✅ Payment Integration
- Razorpay payment gateway
- Subscription management (monthly/yearly)
- Secure payment verification

## Testing Without Secrets

The application will still work without MongoDB and Razorpay configured:
- **Without MongoDB**: App will show a warning but won't crash (data won't persist)
- **Without Razorpay**: Payment features will return "Payment system not configured" error

## Next Steps

1. **Add MongoDB connection string** to enable database functionality
2. **Add Razorpay credentials** to enable payment processing
3. **Test the sign-in flow** at `/signin`
4. **Create a test invoice** with different themes
5. **Download PDF** to verify PDF generation
6. **Test payment flow** (use Razorpay test mode for testing)

## Important Notes

- **MongoDB**: Session storage will use in-memory store if MongoDB is not configured
- **Razorpay Test Mode**: Use test credentials for development, switch to live for production
- **Database Migration**: The PostgreSQL/Drizzle setup has been completely replaced with MongoDB/Mongoose
- **Payment Migration**: Stripe integration has been replaced with Razorpay

## Support

If you encounter any issues:
1. Check that all secrets are properly configured
2. Verify MongoDB connection string format
3. Ensure Razorpay credentials are correct (Key ID and Key Secret)
4. Check the console logs for error messages

---

**Your Lomerse invoice generator is ready to use! 🎉**
