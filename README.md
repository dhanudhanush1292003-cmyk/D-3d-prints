# Doddaballapur 3D Prints — ecommerce starter

A mobile-friendly custom storefront with product catalogue, cart, delivery form and a Razorpay checkout integration scaffold. Prepared for Netlify deployment with a free `*.netlify.app` address.

## Included
- Responsive storefront and product cards
- Shiva Shadow Lamp set at ₹999
- ₹100 configurable shipping charge
- Cart quantity controls
- Server-side Razorpay order creation (Netlify Function)
- Server-side HMAC payment signature verification (Netlify Function)
- Netlify routing for `/api/create-order` and `/api/verify-payment`

## Important before taking real orders
This is a starter implementation, not a complete order-management system. It does not yet save orders to a database, send customer emails/SMS, calculate courier rates, or reconcile webhook events. Add persistent order storage and Razorpay webhooks before relying on it for fulfilment. Do not dispatch based only on the browser success screen. Confirm payment in Razorpay Dashboard or via a verified webhook.

## Deploy on Netlify
1. Extract the ZIP on your computer.
2. Create a GitHub repository and upload all files and folders.
3. Create a Netlify account at https://www.netlify.com/ and import the repository.
4. Keep the publish directory as `.` if Netlify asks; the included `netlify.toml` configures the functions and API routes.
5. Netlify deploys to a free `*.netlify.app` address. Check Netlify's current plan terms and limits before launch.
6. In Netlify: Site configuration → Environment variables, add:
   - `RAZORPAY_KEY_ID=rzp_test_...`
   - `RAZORPAY_KEY_SECRET=...`
   Then redeploy.
7. Test using Razorpay test keys. Complete Razorpay merchant onboarding/KYC and switch to live keys only after approval.

## Update store details
- Change product price and shipping in `index.html` and `netlify/functions/create-order.js` together.
- Replace the placeholder WhatsApp URLs with your business WhatsApp link.
- Replace the decorative lamp illustration with actual product photos before publishing.
- Update shipping promise and policies to match your business.

## Security notes
- Never put `RAZORPAY_KEY_SECRET` in frontend HTML or public repositories.
- The server calculates the payable amount; do not trust a price sent by the browser.
- Use HTTPS (Netlify provides it).
- Add database-backed orders, webhook verification, rate limiting, privacy controls, and support/contact information before processing a large volume of orders.
