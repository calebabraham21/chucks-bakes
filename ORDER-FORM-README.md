# 📝 Chuck's Bakes Order Form System

## Quick Overview

Your bakery now has a complete order request system that saves to Google Sheets!

### 🎯 What You Got

1. **`google-apps-script.js`** - Paste this into Google Apps Script (Google Sheets > Extensions > Apps Script)
2. **`api/order.js`** - Serverless API route that runs on Vercel
3. **Updated Form** - With honeypot spam protection and submission logic
4. **`env.template`** - Copy to `.env` and fill in your values
5. **`SETUP.md`** - Complete step-by-step setup instructions

### 🚀 Quick Start

1. **Read `SETUP.md`** - Follow all steps carefully
2. **Create `.env`** - Copy from `env.template` and fill in your values
3. **Deploy to Vercel** - Add environment variables in Vercel dashboard
4. **Test it out!** - Submit a test order

### 📋 How It Works

```
User fills out order form
       ↓
Clicks "Submit Order Request"
       ↓
Frontend sends to /api/order (Vercel)
       ↓
API forwards to Google Apps Script
       ↓
Script adds row to Google Sheet
       ↓
User sees success page!
```

### 🔒 Security Features

- ✅ **Token Authentication** - API token never exposed to client
- ✅ **Honeypot Field** - Blocks basic spam bots
- ✅ **Server-side Validation** - All validation happens server-side
- ✅ **Environment Variables** - Secrets kept secure

### 📦 Files Modified

- `src/components/order/ContactForm.tsx` - Added honeypot field
- `src/components/Header.tsx` - Added submit functionality
- `src/lib/api.ts` - NEW - API utility functions

### 📦 Files Created

- `google-apps-script.js` - Google Apps Script code
- `api/order.js` - Vercel serverless function
- `env.template` - Environment variables template
- `SETUP.md` - Complete setup guide
- `ORDER-FORM-README.md` - This file

### 🎨 The User Flow

1. **Build Order**: Users build their order using the wizard (cake, brownies, etc.)
2. **Add to Cart**: They can add multiple items to their request list
3. **Review**: Click the shopping bag icon to see all items
4. **Submit**: Click "Submit Order Request" button
5. **Success**: Redirected to success page
6. **Sheet Updated**: Order appears in your Google Sheet automatically

### 🛠️ Customization Tips

**Change colors**: Edit `tailwind.config.js`
**Add fields**: Update form + validation + Apps Script
**Change sheet name**: Edit `getOrdersSheet()` in Apps Script
**Add email notifications**: Add MailApp.sendEmail() in Apps Script

### 📊 What Goes to the Sheet

Each order submission includes:
- Timestamp
- Contact info (name, email, phone)
- Item details (type, configuration, quantity)
- Target pickup date/time
- Notes and special requests
- Referral source
- Status (automatically set to "New")

### 🆘 Need Help?

Check `SETUP.md` for detailed troubleshooting steps!

### ⚡ Production Ready

All code is:
- Well-commented
- Error-handled
- Secure
- Production-ready

No more manual Venmo follow-ups - orders flow automatically to your Google Sheet! 🎉

