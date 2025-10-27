# Design Guidelines for Lomerse Invoice Generator Platform

## Design Approach

**Selected Approach:** Hybrid (Reference + System)
- **Landing Page:** Reference-based inspired by modern SaaS platforms (Stripe's clarity, Linear's typography, Notion's approachability)
- **Dashboard:** Clean design system approach prioritizing functionality and workflow efficiency
- **Justification:** Landing page must convert and showcase visual invoice templates, while dashboard prioritizes productivity and ease of use

## Core Design Principles

1. **Professional Trust:** Establish credibility for financial/business tool
2. **Visual Clarity:** Clearly differentiate free vs. premium tier features
3. **Efficient Workflows:** Streamlined invoice creation and management
4. **Indian Market Focus:** Rupee pricing, local payment preferences, cultural design sensitivity

## Color Palette

### Landing Page
- **Primary Brand:** 245 90% 58% (Vibrant orange-gold for CTA and accents - conveys energy and professionalism)
- **Secondary:** 217 91% 60% (Trust-building blue for feature highlights)
- **Background Light:** 210 20% 98% (Soft off-white)
- **Background Dark (sections):** 222 47% 11% (Deep charcoal for contrast sections)
- **Text Primary:** 220 13% 18% (Near black for readability)
- **Text Secondary:** 215 14% 34% (Muted slate)
- **Success (pricing):** 142 76% 36% (For yearly savings callout)

### Dashboard
- **Primary Action:** 245 90% 58% (Consistent brand color)
- **Neutral Base:** 214 32% 91% (Light gray backgrounds)
- **Border/Divider:** 214 20% 85% (Subtle separators)
- **Status Colors:** Success 142 76% 36% / Warning 38 92% 50% / Error 0 84% 60%

## Typography

**Font Families:**
- **Primary:** 'Inter' (Clean, professional, excellent for UI)
- **Display/Headers:** 'Poppins' (Confident, modern for landing page headlines)
- **Invoice Preview:** 'Dancing Script' for decorative "Thank You" (already in template)

**Scale:**
- Hero headline: text-5xl md:text-6xl font-bold
- Section headers: text-3xl md:text-4xl font-semibold
- Pricing numbers: text-4xl md:text-5xl font-bold
- Body text: text-base md:text-lg
- Dashboard labels: text-sm font-medium
- Small print: text-xs

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-16 md:py-24 lg:py-32
- Card padding: p-6 md:p-8
- Component gaps: gap-6 md:gap-8
- Element margins: mb-4, mb-6, mb-8

**Container Strategy:**
- Landing page max-width: max-w-7xl
- Content sections: max-w-6xl
- Dashboard: max-w-screen-2xl (wider for data tables)
- Cards/Forms: max-w-md to max-w-2xl

## Component Library

### Landing Page Components

**Hero Section:**
- Full-width gradient background (orange to orange-dark diagonal)
- Centered headline + subheadline + dual CTA buttons
- Animated invoice preview mockup (showing theme switching)
- Trust indicators below: "Trusted by 1000+ businesses" + security badges

**Pricing Cards (3-column grid):**
- **Pay Per Invoice:** ₹19/invoice, outline card, basic features list
- **Monthly Pro:** ₹399/month (Popular badge), filled primary color, all premium features
- **Yearly Pro:** ₹3999/year (Best Value badge + "Save ₹800"), gradient border, all features + bonuses

**Theme Showcase Section:**
- 2x2 grid of invoice previews with hover zoom effect
- Labels: "Basic (Free)", "Premium Dark ★", "Professional ★", "Curated ★"
- "Unlock all themes" CTA below grid

**Features Section:**
- Icon + title + description cards in 3-column grid
- Icons: Download, Customize, Multi-platform, Analytics, Templates, Security

**Social Proof:**
- Customer testimonial cards with avatar, quote, name, business
- 3-column grid, rotating carousel on mobile

**Footer:**
- Lomerse logo + tagline
- Quick links (Features, Pricing, Login, Support)
- Payment methods accepted (Stripe badge)
- Social media icons

### Dashboard Components

**Top Navigation:**
- Lomerse logo (left)
- Main nav: Dashboard, Invoices, Templates, Billing
- User menu with avatar (right)
- Subscription tier badge visible

**Dashboard Cards:**
- Stats cards: Total Invoices, This Month, Revenue (if premium)
- Quick action buttons: "Create Invoice" (primary), "View Templates"
- Recent invoices table with status badges

**Invoice Creation Modal/Page:**
- Embedded HTML template with theme selector locked/unlocked based on subscription
- Payment gate overlay for premium themes: "Upgrade to ₹399/month to unlock"
- Generate PDF button (costs ₹19 if pay-per-use)

**Billing Section:**
- Current plan display with usage counter
- Upgrade/downgrade CTAs
- Invoice history table
- Payment method management

## Theme Access UI

**Free Tier:**
- Basic theme colors visible and selectable
- Premium themes shown with lock icon overlay
- Click triggers upgrade modal

**Premium Themes:**
- Star/crown icon badge on theme selector
- Smooth unlock animation when subscription active
- Full preview access

## Images

**Hero Section:**
- Large hero image: Modern workspace with laptop showing Lomerse invoice on screen
- Image placement: Right side of hero (60% width), content on left
- Style: Professional photography, bright, clean, aspirational

**Theme Showcase:**
- Screenshots of actual invoice templates (from provided HTML)
- Show different themes in use with realistic business data
- High-quality mockups with subtle shadow depth

**Dashboard:**
- Empty state illustrations for "No invoices yet"
- Iconography for features (modern, outlined style)
- Payment provider logos (Stripe, UPI, cards)

## Accessibility & Interactions

- Focus states: 3px primary color ring
- Button hover: brightness(1.1) for light, brightness(0.9) for dark
- Disabled states: opacity-50 with cursor-not-allowed
- Loading states: Spinner with brand color
- Error messages: Red background with white text, rounded corners
- Success toasts: Slide in from top-right

## Payment Integration Visual

- Stripe checkout modal with Lomerse branding
- Clear pricing breakdown before payment
- Security badges: "Secure payment", "SSL encrypted"
- Indian payment methods: Cards, UPI, Net Banking options
- Invoice receipt generated automatically after payment

## Dark Mode (Dashboard Only)

- Dashboard supports dark mode toggle
- Background: 220 18% 12%
- Cards: 220 15% 16%
- Text: 210 20% 98%
- Borders: 220 13% 23%
- Maintain brand primary color visibility