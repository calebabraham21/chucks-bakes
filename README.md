# Chuck's Bakes 🧁

A polished, production-ready front-end application for a bakery order system. Built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- **Guided 4-Step Order Flow**: Intuitive wizard-style ordering process
- **Multiple Item Types**: Custom cakes, brownies, cookies, and seasonal treats
- **Comprehensive Validation**: Form validation using Zod and React Hook Form
- **Persistent State**: Orders saved to localStorage with Zustand state management
- **Request List**: Add multiple items before sending
- **Email Integration**: Generate mailto links with formatted order summaries
- **Accessibility First**: WCAG compliant with keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first approach with beautiful UI across all devices
- **Modern Aesthetics**: Cozy bakery theme with soft colors, smooth animations, and delightful micro-interactions

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── ChipInput.tsx
│   │   ├── Modal.tsx
│   │   ├── Stepper.tsx
│   │   └── Toast.tsx
│   ├── order/           # Order flow components
│   │   ├── ChooseItem.tsx
│   │   ├── ConfigureCake.tsx
│   │   ├── ConfigureTreats.tsx
│   │   ├── ContactForm.tsx
│   │   ├── ReviewAndSend.tsx
│   │   └── SummarySidebar.tsx
│   └── Header.tsx
├── pages/
│   ├── Home.tsx
│   ├── Order.tsx
│   ├── Recipes.tsx
│   ├── Merch.tsx
│   └── Success.tsx
├── lib/
│   ├── constants.ts     # Bakery offerings and configuration
│   ├── validation.ts    # Zod schemas
│   ├── state.ts         # Zustand store
│   ├── summary.ts       # Order summary generation
│   └── utils.ts         # Helper functions
├── App.tsx
├── main.tsx
└── index.css
```

## Configuration

### Editing Bakery Offerings

All bakery items, flavors, and configurations are centralized in `src/lib/constants.ts`. 

To modify offerings:

1. Edit `CAKE_SIZES`, `CAKE_FLAVORS`, `CAKE_FILLINGS`, etc.
2. Update `TREAT_MINIMUMS` for minimum order quantities
3. Modify `SEASONAL_AVAILABILITY` for seasonal item labels

Example:

```typescript
export const CAKE_FLAVORS = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  // Add new flavor here
  { value: 'lemon', label: 'Lemon' },
];
```

### Customizing Theme

Theme colors and design tokens are in `tailwind.config.js`:

```javascript
colors: {
  'bakery-pink': { /* ... */ },
  'bakery-brown': { /* ... */ },
  'bakery-cream': '#faf7f5',
  'bakery-cocoa': '#4a3528',
}
```

Google Font is imported in `index.html` (currently using Poppins).

## Order Flow

### Step 1: Choose Item
User selects from cake, brownies, cookies, or seasonal items.

### Step 2: Configure
- **Cake**: Size, flavor, filling, frosting type, SMBC flavor, theme, colors (up to 3)
- **Treats**: Quantity (with enforced minimums)

### Step 3: Contact
Name, email, phone (optional), target pickup date (optional), notes (optional).

### Step 4: Review & Send
- Review order summary
- Add to Request List
- View all items in request via header badge
- Send via email (mailto link with formatted summary)

## How Email Works

When users click "Send Email" from the Request modal:

1. The app generates a plain-text summary of all items
2. Creates a `mailto:` link to `orders@chucksbakes.com`
3. Pre-fills subject and body with order details
4. Opens user's default email client

**Note**: This requires users to have an email client configured. For production, consider integrating with:
- **Formspree** - Simple form backend
- **Resend** - Modern email API
- **SendGrid** - Enterprise email service

## Accessibility Features

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- Visible focus indicators
- Screen reader announcements
- Respects `prefers-reduced-motion`
- Form validation with clear error messages
- Sufficient color contrast ratios

## State Management

The app uses **Zustand** with **localStorage persistence**:

- `orderDraft` - Current order being built
- `currentStep` - Active step in wizard (1-4)
- `requestList` - Finalized items ready to send

State persists across page refreshes, allowing users to continue where they left off.

## Future Enhancements

### High Priority
- [ ] Backend integration (Formspree, Resend, or custom API)
- [ ] Admin dashboard for order management
- [ ] Email confirmation system
- [ ] Pricing calculator
- [ ] Image uploads for cake inspiration
- [ ] Calendar picker with blackout dates

### Nice to Have
- [ ] Recipe database with search/filter
- [ ] Merchandise store with cart functionality
- [ ] Customer accounts and order history
- [ ] SMS notifications
- [ ] Social media integration
- [ ] Gallery of past creations
- [ ] Customer reviews and testimonials

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially accessibility)
5. Submit a pull request

## License

Private project - All rights reserved

---

**Built with ❤️ for Chuck's Bakes**
