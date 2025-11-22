# Homepage CMS Guide 🏠

Your homepage is now fully editable through Sanity CMS!

## What Can Be Edited

All homepage content can now be changed without touching code:

### Hero Section
- Main title/headline
- Subtitle text
- Button text
- Background image (optional)

### Kitchen Section ("From Cristina's Kitchen")
- Section title
- Description text
- Link text
- Kitchen photo

## How to Edit Homepage Content

### 1. Open Sanity Studio
```bash
cd studio-chucks-bakes
npm run dev
```

Visit: http://localhost:3333

### 2. Find "Homepage Content"
- Look for the 🏠 icon in the sidebar
- Click "Homepage Content"

### 3. Create Your First Homepage Document
If you haven't created one yet:
- Click "+ Create"
- Fill in all the fields you want to customize
- Click "Publish"

### 4. Edit Existing Content
- Click on "Homepage Content"
- Edit any text fields
- Upload images by clicking "Select" or "Upload"
- Click "Publish" to save changes

### 5. See Changes Live
- Go to http://localhost:5173 (or your app URL)
- Refresh the page
- Your changes appear instantly!

## Tips

### Default Content
If you don't fill in a field, the website will show the original default text. This means you can:
- Start by editing just one section
- Leave fields empty to keep the current content
- Update sections gradually

### Images
- **Recommended sizes:**
  - Hero Background: 1920x1080px or larger
  - Kitchen Photo: 500x500px (square)
- Supported formats: JPG, PNG, WebP
- Sanity automatically optimizes images

### Text Fields
- **Title fields**: Keep these short and punchy
- **Description fields**: Can be longer, up to a few sentences
- **Button text**: Keep it action-oriented (2-4 words)

## Example Content

Here's what you might put in each field:

**Hero Section:**
- Title: "Made fresh in Arlington — small-batch cakes, brownies, and scones."
- Subtitle: "Every order is baked by Cristina with locally sourced ingredients and a whole lot of love."
- Button: "Start Your Order"

**Kitchen Section:**
- Title: "From Cristina's kitchen"
- Description: "Hi, I'm Cristina. I bake every order from scratch in my Arlington kitchen. No shelves, no shortcuts — just fresh, small-batch bakes for your celebrations."
- Link Text: "Learn more about my kitchen"

## Troubleshooting

**Changes not showing?**
1. Make sure you clicked "Publish" in Sanity (not just "Save")
2. Hard refresh your browser: `Ctrl + Shift + R`
3. Check the browser console for errors

**Images not loading?**
1. Make sure the image uploaded successfully in Sanity
2. Check that your CORS settings are correct (should already be set up)
3. Try a different image format

---

Need to add more sections or make other changes? Just let me know! 🎨

