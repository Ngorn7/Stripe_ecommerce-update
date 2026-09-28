# Vue Store — Laravel API Backend

A Laravel 11 REST API backend built to match an existing Vue 3 + Pinia
e-commerce frontend exactly, with two payment paths: **Stripe** (card
payments via PaymentIntents + webhook) and **manual bank transfer**
(upload a transaction screenshot, seller approves/rejects).

> This package contains all the application code (`app/`, `routes/`,
> `database/`, `config/`, `tests/`) but not the full Laravel framework
> skeleton (no `vendor/`, `public/index.php`, etc.). Follow the setup
> steps below to drop it into a real Laravel installation.

## 1. Requirements

- PHP 8.2+
- Composer
- MySQL (or SQLite for quick local testing)
- Stripe account (test mode is fine)

## 2. Installation

```bash
# 1. Create a fresh Laravel skeleton (gives you vendor/, public/index.php, etc.)
composer create-project laravel/laravel vue-store-backend
cd vue-store-backend

# 2. Copy this project's app/, routes/, database/, config/, tests/,
#    composer.json, .env.example and phpunit.xml over the fresh skeleton,
#    overwriting the defaults.

# 3. Install dependencies (adds Sanctum + Stripe SDK from composer.json)
composer install

# 4. Environment
cp .env.example .env
php artisan key:generate
```

## 3. Configure `.env`

```env
DB_CONNECTION=mysql
DB_DATABASE=vue_store
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173

STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Database

```bash
mysql -u root -e "CREATE DATABASE vue_store"
php artisan migrate
php artisan db:seed
```

Seeded accounts (all use password `password`):

| Role   | Email               |
|--------|---------------------|
| Admin  | admin@example.com   |
| Seller | seller@example.com  |
| Buyer  | buyer@example.com   |

## 5. Sanctum

Already wired for **Bearer token** auth (not cookies), matching the
frontend's axios interceptor which sends `Authorization: Bearer {token}`.
No further setup needed beyond `composer install`.

## 6. Storage (for product images, avatars, transaction receipts)

```bash
php artisan storage:link
```

This makes `storage/app/public/...` reachable at `http://localhost:8000/storage/...`.

## 7. Stripe setup

1. Get your test keys from https://dashboard.stripe.com/test/apikeys and
   put them in `.env` as `STRIPE_KEY` / `STRIPE_SECRET`.
2. For local webhook testing, install the Stripe CLI and run:

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook
```

   This prints a `whsec_...` value — put it in `.env` as `STRIPE_WEBHOOK_SECRET`.
3. In production, add a webhook endpoint in the Stripe Dashboard pointing
   to `https://your-domain.com/api/payments/webhook`, listening for at
   least `payment_intent.succeeded` and `payment_intent.payment_failed`.

## 8. Run the server

```bash
php artisan serve
```

API is now at `http://localhost:8000/api`, matching what the Vue app's
`src/api/https.js` expects as `baseURL` (update that to point here).

## 9. Run tests

```bash
php artisan test
# or
./vendor/bin/phpunit
```

Tests run against an in-memory SQLite database (see `phpunit.xml`), so no
extra setup is needed. Stripe calls are mocked — no real network calls
happen during the test suite.

## 10. API endpoints

| Method | Endpoint                          | Auth        | Notes |
|--------|------------------------------------|-------------|-------|
| POST   | `/api/register`                    | –           | |
| POST   | `/api/login`                       | –           | returns `{data:{name, token}}` |
| DELETE | `/api/logout`                      | Bearer      | |
| GET    | `/api/me`                          | Bearer      | |
| PUT    | `/api/profile/info`                | Bearer      | |
| POST   | `/api/profile/image`               | Bearer      | multipart |
| DELETE | `/api/profile/image`               | Bearer      | |
| GET    | `/api/products?page&per_page&search` | –         | |
| GET    | `/api/products/{id}`               | –           | |
| POST   | `/api/products`                    | Bearer      | multipart, `category_ids` JSON string |
| POST   | `/api/products/{id}`               | Bearer (owner) | multipart |
| GET    | `/api/profile/products?page&per_page` | Bearer | own products only |
| GET    | `/api/categories`                  | –           | |
| POST   | `/api/categories`                  | Bearer      | `{name}` |
| PUT    | `/api/categories/{id}`             | Bearer      | `{name}` |
| DELETE | `/api/categories/{id}`             | Bearer      | blocked if it still has products |
| DELETE | `/api/products/{id}`               | Bearer (owner) | blocked if the product has orders |
| GET    | `/api/profile/carts`               | Bearer      | `{data:{items,total}}` |
| POST   | `/api/carts`                       | Bearer      | upsert by product |
| DELETE | `/api/carts/{id}`                  | Bearer      | own cart row only |
| POST   | `/api/carts/checkout`              | Bearer      | multipart, dual payment path |
| POST   | `/api/payments/webhook`            | –           | Stripe only, signature verified |
| PUT    | `/api/payments/approve/{id}`       | Bearer (owner) | manual orders only |
| PUT    | `/api/payments/reject/{id}`        | Bearer (owner) | manual orders only |
| GET    | `/api/profile/payment-check?page&per_page` | Bearer | orders for seller's products |
| GET    | `/api/profile/purchased?page&per_page` | Bearer  | buyer's own orders |

## 11. Response shape

All endpoints:

```json
{ "result": true, "message": "...", "data": {} }
```

Errors:

```json
{ "result": false, "message": "...", "data": null }
```

Paginated endpoints add:

```json
"paginate": {
  "current_page": 1, "last_page": 5, "total": 50,
  "has_more_pages": true, "on_first_page": true,
  "first_item": 1, "last_item": 10
}
```

## 12. Checkout flow (both payment methods)

`POST /api/carts/checkout` (multipart form data):

| Field              | Required                        |
|--------------------|----------------------------------|
| `is_delivery`      | always (`1` pickup, `2` delivery) |
| `address`          | required if `is_delivery=2`      |
| `google_map_url`   | optional |
| `payment_method`   | optional, defaults to `manual` (`manual` or `stripe`) |
| `transaction_file` | required if `payment_method=manual` |

The server **always recalculates the total from database prices and
stock** — the frontend's `amount` field is never trusted.

- **manual**: creates order rows with `status=1`, stores the uploaded
  screenshot, and waits for the seller to call
  `/api/payments/approve/{id}` or `/api/payments/reject/{id}`.
- **stripe**: creates a Stripe PaymentIntent for the server-calculated
  total, creates order rows with `status=1` and the PaymentIntent id
  attached, and returns `{ data: { client_secret } }` for the frontend to
  confirm the card payment with Stripe.js. **The webhook, not the
  frontend, is the source of truth** — orders only flip to `status=2`
  when Stripe confirms `payment_intent.succeeded`.

## 13. Wiring Stripe.js into the existing `PaymentView.vue`

```bash
npm install @stripe/stripe-js
```

On submit: call `/api/carts/checkout` with `payment_method=stripe`, get
back `client_secret`, then use Stripe Elements to confirm the card
payment with that secret. Once Stripe confirms, the webhook flips the
order to approved server-side — no extra frontend call needed.

## 14. Security notes

- Prices, totals, stock, and payment status are **always** read from the
  database, never trusted from the request body.
- Stripe webhook signatures are verified with `STRIPE_WEBHOOK_SECRET`;
  invalid signatures return `400` and are logged.
- Webhook handlers are idempotent (guarded by current `status`), so
  Stripe retries won't double-process an order.
- Checkout runs inside a `DB::transaction()` — a failure partway through
  rolls back all created orders and the uploaded file is deleted.
- Product/category/order mutations check ownership (`user_id`) before
  allowing changes.
