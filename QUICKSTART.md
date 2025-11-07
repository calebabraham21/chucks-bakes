# ⚡ Quick Start - 5 Minutes to Launch

## 1️⃣ Google Sheet (2 min)
1. Create a Google Sheet
2. **Extensions > Apps Script**
3. Paste code from `google-apps-script.js`
4. **Save**

## 2️⃣ Security Token (1 min)
```bash
# Generate token (copy the output):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3️⃣ Apps Script Config (1 min)
1. Apps Script: **Project Settings** ⚙️
2. **Script Properties** > **Add property**
3. Name: `API_TOKEN`, Value: [paste your token]
4. **Deploy > New deployment > Web app**
5. Execute as: **Me**, Access: **Anyone**
6. **Copy the Web App URL**

## 4️⃣ Environment Variables (30 sec)
Create `.env` in project root:
```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
API_ORDER_TOKEN=your-token-from-step-2
```

## 5️⃣ Deploy to Vercel (1 min)
```bash
vercel login
vercel
```

Then in Vercel dashboard:
- **Settings > Environment Variables**
- Add both variables from `.env`
- Redeploy

## ✅ Done!
Test by submitting an order. Check your Google Sheet!

---

**Need help?** See `SETUP.md` for detailed instructions.
**Want to customize?** See `IMPLEMENTATION-SUMMARY.md` for the full guide.

