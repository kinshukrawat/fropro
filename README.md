# Hyperlocal Backend

NestJS backend for a hyperlocal business listing platform.

## Scope Boundaries

This build follows the scope document. The first version includes business discovery, listings, owner dashboard APIs, subscriptions, Razorpay payments, Cloudinary image upload, and admin moderation.

Not included in the initial scope:

- Native iOS or Android app
- Cart, checkout, product ordering, or ecommerce flow
- Multi-language support
- Third-party CMS such as Strapi or Sanity
- Domain purchase or hosting fees
- Razorpay account setup or Razorpay transaction charges

## Core Business Rule

A listing is public only when it is approved, has an active non-expired subscription, and is not suspended or deleted.

## Implemented API Areas

- Auth: owner registration, login, JWT profile, password reset token flow
- Public discovery: listing search, category/city filters, listing detail view counter
- Owner dashboard: listing CRUD, submit for approval, images, subscription/payment history, analytics
- Admin: listing approval/rejection/suspension, featured toggle, users, subscriptions, payments, stats
- Enquiries: public query form submission and admin follow-up status management
- Payments: Razorpay order creation, signature verification, webhook activation
- Media: Cloudinary image metadata storage with a 10-image listing limit

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Copy `.env.example` to `.env` and fill the required secrets before running locally.

## Notes

The subscription plan prices are seeded as `0` because the scope document says the client must provide the 3-month and 6-month rates. Set real prices in paise before accepting live payments.
