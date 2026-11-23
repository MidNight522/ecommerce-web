# The Scoville Inferno — Frontend

An educational ecommerce application for hot sauces and spices, built with Angular 19, TypeScript, SCSS and PrimeNG.

🚀 Live Demo
👉 https://english-wizard-studio.vercel.app

## Features

- Product catalogue with search, filters, sorting and pagination.
- Product details, image previews and a shopping cart.
- Registration, sign-in, profile settings and order history.
- Checkout with orders saved to Supabase through the API.
- Admin panel for creating, editing, hiding and deleting products, plus order statistics.
- Responsive pages and light/dark themes.

## Local development

Developed with Node.js 22 and npm. Start the [API](https://github.com/MidNight522/ecommerce-api) first.

```bash
npm ci
npm start
```

Open `http://localhost:4200`. The API URL is configured in `src/environment/environment.ts` and defaults to `http://localhost:5000/api`.

```bash
npm run build
```

Production output: `dist/ecommerce-web/browser`.

## Current status

Orders are persisted on the server. Online payments are not connected; checkout only saves the selected payment method. The cart is stored in memory and resets on page refresh. Reviews are demonstration content. An account is required to browse the catalogue and place orders; the admin panel requires the `admin` role.

Before deployment, configure the public API URL, allow the frontend domain in the server's CORS settings and configure the host to serve `index.html` for Angular routes. Supabase server keys and JWT secrets are not used in the frontend.
