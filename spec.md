# U Like Photography

## Current State
- Full-stack photography app with landing page, photographer dashboard, client portal, shared event pages, admin panel, payment pages
- Pricing shown in USD ($29, $79, $199/month) for photographer plans
- Generic camera icon in header/footer/hero -- no real logo
- App logo in hero references a generated image `/assets/generated/ulike-logo-transparent.dim_300x300.png`
- Photographer subscription tab has paid plans in USD
- Landing page pricing section has USD plans
- App is currently set up as paid-for-photographers model
- Contact number M:9878990216 visible in uploaded logo

## Requested Changes (Diff)

### Add
- Real brand logo (`/assets/uploads/Black-and-Yellow-Classy-and-Refined-Photography-Logo-1.png`) displayed in: header nav, footer, landing page hero, and auth page
- INR (Rs) pricing throughout the app -- clients pay the photographer, not a subscription fee
- A "Client Payment" section/flow where clients can pay a photographer for their photos in Rs (e.g., ₹99, ₹199, ₹499 per gallery/download package)
- Phone number M:9878990216 visible in footer/contact area (from the logo)

### Modify
- Header logo: replace camera icon + text with the real uploaded logo image
- Footer logo: replace camera icon + text with the real uploaded logo image
- Landing page hero: replace generated logo image with real uploaded logo
- Pricing section: change photographer plans from "Free Trial / $29 / $79 / $199" to "Free for Photographers" -- app is FREE for photographers to use
- Landing page pricing copy: reflect "Free for Photographers, Clients pay for photos in Rs"
- Photographer SubscriptionTab: replace USD plans with "Free Plan" status -- photographers use the app for free
- Client portal: add a payment section where clients can pay for photos in Rs before downloading
- All USD ($) references -> INR (₹) where applicable
- CTA buttons: update text from "Start Free Trial" to "Join Free" since it's free for photographers

### Remove
- Photographer subscription paid plans (Starter $29, Professional $79, Studio $199)
- USD/Stripe payment flow for photographers
- "Start Free Trial" CTA implying a trial period

## Implementation Plan
1. Update `Layout.tsx` (Header and Footer) to use real logo image instead of camera icon
2. Update `LandingPage.tsx`:
   - Hero: use real logo, change headline CTA to "Join Free"
   - Pricing section: change to "Free for Photographers / Clients pay in Rs" model with INR pricing for client photo packages
3. Update `PhotographerDashboard.tsx` SubscriptionTab: show "Free Plan - Always Free" instead of paid plan cards
4. Update `ClientPortal.tsx`: add a photo download payment prompt showing Rs price before download (simulated/UI only since Stripe is configured for USD)
5. Update `AuthPage.tsx` if needed: make sure photographer signup emphasizes it's free
6. Add logo to hero section properly referencing the uploaded file
7. Add contact number in footer
