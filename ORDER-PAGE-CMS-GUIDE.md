# Order Page CMS Guide 📝

Your Order page is now editable through Sanity CMS!

## What Can Be Edited

You can customize all the text that appears when customers choose what to order:

### Step 1 Headings
- **Title**: "Choose Your Item" (the main heading)
- **Subtitle**: "Select what you'd like to order" (text below the heading)

### Product Labels & Descriptions
For each product, you can edit:
- **Label**: The product name (e.g., "Custom Cake")
- **Description**: Details about the product

**Editable Products:**
1. **Cake** - Custom cakes
2. **Cupcakes** - Cupcake orders
3. **Brownies** - Brownie orders
4. **Cookies** - Cookie orders
5. **Seasonal** - Seasonal items (like scones)

## How to Edit Order Page Content

### 1. Open Sanity Studio
```bash
cd studio-chucks-bakes
npm run dev
```

Visit: http://localhost:3333

### 2. Find "Order Page Settings"
- Look for the 📝 icon in the sidebar
- Click "Order Page Settings"

### 3. Create Your First Order Page Document
If you haven't created one yet:
- Click "+ Create"
- Fill in the fields you want to customize
- Click "Publish"

### 4. Edit Product Information
Example: To change the seasonal item:
- **Seasonal Item - Label**: Change to "Winter Special: Peppermint Brownies"
- **Seasonal Item - Description**: "Rich chocolate brownies with peppermint swirl (minimum 12)"
- Click "Publish"

### 5. See Changes Live
- Go to http://localhost:5173/order
- Click to start an order
- Your updated text appears!

## Example Content

Here's what the default content looks like. You can change any of this:

### Step 1 Headings
- **Title**: "Choose Your Item"
- **Subtitle**: "Select what you'd like to order"

### Products

**Cake:**
- Label: "Custom Cake"
- Description: "Custom designed cake with your choice of flavors and decorations"

**Cupcakes:**
- Label: "Cupcakes"
- Description: "Custom cupcakes with your choice of flavors and fillings (minimum 12)"

**Brownies:**
- Label: "Brownies"
- Description: "Rich, fudgy brownies (minimum 16)"

**Cookies:**
- Label: "Chocolate Chip Cookies"
- Description: "Classic chocolate chip cookies (minimum 12)"

**Seasonal:**
- Label: "Seasonal: Apple Pie Almond Scones"
- Description: "Apple Pie Almond Scones (through November, minimum 6)"

## Common Use Cases

### Update Seasonal Items
When you have a new seasonal offering:
1. Open "Order Page Settings"
2. Update "Seasonal Item - Label" and "Description"
3. Publish
4. Customers see the new item!

### Change Minimums
If your minimum order quantities change:
1. Edit the description to reflect the new minimum
2. Example: "Rich, fudgy brownies (minimum 12)" → "minimum 24"

### Add More Details
Make descriptions more enticing:
- Before: "Custom Cake"
- After: "Custom Cake - Perfect for birthdays, weddings, and celebrations!"

### Temporarily Unavailable
If something's not available:
- Label: "Cookies (Currently Unavailable)"
- Description: "Check back soon! We'll have fresh cookies available next month."

## Tips

### Default Content
- If you don't fill in a field, the website shows the original default text
- You can update just one product without touching the others
- Leave fields empty to keep current content

### Keep It Clear
- **Labels**: Short and catchy (2-4 words)
- **Descriptions**: Include key info like minimums and flavors (1-2 sentences)

### Be Specific
Customers need to know:
- What they're getting
- Minimum quantities
- Any special details (seasonal availability, etc.)

## Troubleshooting

**Changes not showing?**
1. Make sure you clicked "Publish" (not just "Save")
2. Hard refresh your browser: `Ctrl + Shift + R`
3. Try navigating to /order in a new tab

**Order flow not working?**
- The Order page CMS only affects the text/labels
- The ordering functionality (form fields, validation, etc.) stays the same
- Only the display text changes

---

Want to make other pages editable too? Just let me know! 🎨

