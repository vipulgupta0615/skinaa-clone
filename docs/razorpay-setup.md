# Razorpay test checkout

The cart supports individual products and selected routine bundles. Prices are calculated on the backend; client totals are ignored. Orders are saved in MongoDB. Confirmation requires a valid Razorpay signature and a matching captured payment fetched from Razorpay.

## Configure Render

In the skinaa-api service Environment settings, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET using a Razorpay **test-mode** key pair. Keep secrets exclusively in Render. MONGODB_URI must point to a working database. Enable automatic capture in the Razorpay test dashboard. Redeploy after saving environment variables.

Status endpoint: /api/checkout/status. It returns ready:false until the required environment configuration is present. This flag is a configuration check; order creation also requires a successful database connection and valid provider credentials.

## Verify with test credentials

Add a product or routine to the bag, change a quantity, and open Razorpay test checkout. Complete a provider-supported test payment. Verify the confirmation and saved CheckoutOrder record. Test dismissal, payment failure, and authorized-but-not-captured payments. Never use real payment details for this test.

Automated checks: node --test backend/test/checkout.test.js. The suite checks server pricing, invalid quantities, duplicate products, forged signatures, amount mismatch, capture status, and live-key rejection. These mocked checks do not replace a provider test payment.

## Before live commerce

Live keys are deliberately rejected. Shipping addresses, delivery rules, taxes, stock validation, order access control, durable webhook reconciliation, idempotent order creation, abuse controls and fulfilment workflows still need implementation and validation before enabling real purchases. Merchant shipping/returns terms and verified reviews must be supplied before presenting those claims. Do not mark products as bestsellers without supporting sales data.
