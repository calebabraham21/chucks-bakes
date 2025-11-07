# Chuck's Bakes Order Form - Setup Guide

This guide will walk you through setting up the complete order form system that saves submissions to Google Sheets.

## 🎯 Overview

The order form system consists of:
1. **Frontend**: React order wizard (already built)
2. **API Route**: Vercel serverless function at `/api/order`
3. **Google Apps Script**: Receives data and writes to Google Sheets
4. **Security**: Token-based authentication + honeypot spam protection

---

## 📋 Prerequisites

- A Google account
- A Vercel account (free tier works great)
- Node.js installed locally for development

---

## 🚀 Step-by-Step Setup

### Step 1: Set Up Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Orders"** (or whatever you prefer)
4. The script will automatically create an "Orders" sheet with headers on first use

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `google-apps-script.js` from this project
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`

### Step 3: Generate a Secure API Token

Generate a secure random token (at least 32 characters). You can use one of these methods:

**Method 1 - Online Generator:**
- Visit: https://randomkeygen.com/
- Use a "CodeIgniter Encryption Key" or "Fort Knox Password"

**Method 2 - Command Line:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32|%{Get-Random -Maximum 256}))
```

**Method 3 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Save this token securely** - you'll need it in two places!

### Step 4: Configure Google Apps Script Properties

1. In the Apps Script editor, click the **Project Settings** ⚙️ icon (left sidebar)
2. Scroll down to **Script Properties**
3. Click **Add script property**
4. Add:
   - **Property**: `API_TOKEN`
   - **Value**: [paste your secure token from Step 3]
5. Click **Save script properties**

### Step 5: Deploy Google Apps Script

1. In the Apps Script editor, click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Chuck's Bakes Order Form" (optional)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Authorize** the script when prompted:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL** that appears (looks like: `https://script.google.com/macros/s/.../exec`)
8. Click **Done**

> 💡 **Important**: Every time you modify the Apps Script code, you must create a NEW deployment or manage deployments to update the existing one.

### Step 6: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   API_ORDER_TOKEN=your-secure-token-from-step-3
   ```

   - `VITE_GOOGLE_SCRIPT_URL`: The Web App URL from Step 5
   - `API_ORDER_TOKEN`: The same token you set in Step 4

3. **Never commit `.env` to version control!** (It's already in `.gitignore`)

### Step 7: Deploy to Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new one
   - Answer the configuration questions

5. **Add Environment Variables in Vercel:**
   - Go to your project on [vercel.com](https://vercel.com)
   - Go to **Settings > Environment Variables**
   - Add both variables from your `.env` file:
     - `VITE_GOOGLE_SCRIPT_URL`
     - `API_ORDER_TOKEN`
   - Make sure they're available for **Production**, **Preview**, and **Development**

6. Redeploy to apply the environment variables:
   ```bash
   vercel --prod
   ```

---

## 🧪 Testing the Setup

### Test Google Apps Script Directly

1. Open the Apps Script editor
2. Select the `testSetup` function from the dropdown
3. Click **Run** (▶️)
4. Check the **Execution log** (bottom panel)
5. You should see:
   ```
   Sheet name: Orders
   Last row: 0
   Token is configured ✓
   ```

### Test the Complete Flow

1. Go to your deployed website
2. Complete an order using the wizard:
   - Choose an item (cake, brownies, etc.)
   - Configure it
   - Fill in contact information
   - Review and add to request
3. Click the shopping bag icon in the header
4. Click **Submit Order Request**
5. Check your Google Sheet - a new row should appear!
6. You should be redirected to the success page

---

## 🔒 Security Features

### 1. Token Authentication
- The API token is stored server-side only (never exposed to client)
- Google Apps Script validates the token on every request
- Invalid tokens are rejected with 401 Unauthorized

### 2. Honeypot Spam Protection
- A hidden "website" field that humans can't see
- Bots typically fill in all fields, including hidden ones
- Requests with the honeypot field filled are silently rejected

### 3. CORS Protection
- The API route only accepts POST requests
- Configure CORS headers in `api/order.js` if needed for your domain

### 4. Environment Variables
- Secrets are never committed to version control
- Separate configuration for dev/staging/production

---

## 📊 Google Sheet Structure

The script automatically creates these columns on first submission:

| Column | Description |
|--------|-------------|
| Timestamp | When the order was submitted |
| Name | Customer name |
| Email | Customer email |
| Phone | Customer phone (optional) |
| Pickup/Delivery | Fulfillment method |
| Target Date | When they want to pick up |
| Target Time | Preferred time |
| Item Type | cake, brownies, cookies, seasonal |
| Details | Configuration (size, flavor, etc.) |
| Quantity | Number of items |
| Budget | Customer's budget |
| Notes | Special requests |
| Referral Source | How they found you |
| Status | Order status (default: "New") |

---

## 🔧 Troubleshooting

### Orders aren't appearing in Google Sheets

1. **Check the Apps Script execution logs:**
   - Apps Script editor > Executions (clock icon in left sidebar)
   - Look for errors or failed executions

2. **Verify the token matches:**
   - Check `.env` (local) and Vercel env vars
   - Check Apps Script Properties
   - Regenerate if needed

3. **Check the Web App URL:**
   - Make sure it ends with `/exec`
   - Redeploy the Apps Script if you made changes

4. **Check browser console:**
   - Open DevTools (F12)
   - Look for network errors or failed requests

### "Server configuration error"

This means environment variables aren't set properly:
- Verify both variables are set in Vercel dashboard
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

### Honeypot triggering for real users

If legitimate users are being blocked:
- Check that the honeypot field has `position: absolute; left: -9999px;`
- Ensure no browser extensions are auto-filling the field
- Consider renaming the field to something more obscure

### Apps Script permissions issues

If you see authorization errors:
- Re-authorize the script (Deploy > Manage deployments > Edit > Authorize)
- Make sure "Execute as: Me" is selected
- Check that your Google account has access to the sheet

---

## 🎨 Customization

### Change the Google Sheet name

Edit `google-apps-script.js`:
```javascript
function getOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('YourCustomName');  // Change this
  // ...
}
```

### Add more fields

1. Update the form in `src/components/order/ContactForm.tsx`
2. Update the validation schema in `src/lib/validation.ts`
3. Update the Google Apps Script to add the new column
4. Redeploy both the website and Apps Script

### Change styling

The form uses Tailwind CSS. Colors are defined in `tailwind.config.js` under the custom bakery theme.

---

## 📱 Contact & Support

If you have questions or need help:
- Check the troubleshooting section above
- Review the code comments in each file
- The code is well-commented and production-ready

---

## 🎉 You're All Set!

Your order form is now:
- ✅ Securely sending data to Google Sheets
- ✅ Protected from spam with honeypot
- ✅ Token-authenticated for security
- ✅ Showing success messages
- ✅ Ready for production use

Customers can now submit orders, and you'll receive them automatically in your Google Sheet!

