<script setup>
import BaseCard from "@/components/BaseCard.vue";
import CardSkeleton from "@/components/CardSkeleton.vue";
import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/product";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const product = useProductStore();
const cart = useCartStore();
const router = useRouter();

onMounted(() => {
  product.fetchProduct("");
});

const handleCart = (id) => {
  cart.addToMyCart(id, cart.countQty);
};

const handleBuyNow = (id) => {
  cart.addToMyCart(id, cart.countQty);
  router.push("/myCart");
};
</script>

<template>

   <div v-if="cart.loadingAdd" class="full-loader">
      <div class="loader">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
  <!-- HERO -->
  <section class="hero-section">
    <div class="container-lg px-4 h-100">
      <div class="row align-items-center min-vh-100 g-5">
        <!-- LEFT -->
        <div class="col-lg-6">
          <div class="hero-badge">Spring 2025 Collection</div>

          <h1 class="hero-title">
            Live <span class="text-main">Fashionable,</span><br />
            For Everyone
          </h1>

          <p class="hero-text">
            Discover millions of products from trusted sellers worldwide. Shop
            the latest trends at wholesale prices with fast, reliable shipping.
          </p>

          <div class="hero-actions">
            <button class="btn border-0 bg-btn rounded-pill border-0 px-6">
              Shop Collection
            </button>
            <button class="btn btn-outline-success fw-bold rounded-pill px-5">
              Our Story
            </button>
          </div>

          <div class="hero-stats">
            <div>
              <strong>12K+</strong>
              <span>Happy Customers</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>Eco Products</span>
            </div>
            <div>
              <strong>4.9★</strong>
              <span>Avg Rating</span>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div
          class="col-lg-6 position-relative d-flex justify-content-center hero-image-wrap"
        >
          <img
            src="https://i.pinimg.com/736x/e2/d3/31/e2d3318fd4dd2e7f49ccffa3d5ca6f36.jpg"
            class="hero-blob"
            alt=""
          />

          <div
            class="bg-white px-3 rounded-3 py-3 shadow-lg position-absolute d-flex align-items-center gap-2"
            style="bottom: 2rem; left: 0"
          >
            <span style="font-size: 1.4rem">🌿</span>
            <div>
              <div style="font-size: 0.6rem; letter-spacing: 0.1em">
                THIS WEEK
              </div>
              <div class="fw-bold" style="font-size: 0.9rem">180 New Items</div>
            </div>
          </div>
          <div
            class="bg-success text-center text-white px-3 rounded-3 py-3 shadow-lg position-absolute"
            style="top: 2rem; right: 0"
          >
            <div class="fs-3 fw-bold lh-1">4.9</div>
            <div style="font-size: 0.62rem; opacity: 0.6">★★★★★ Rated</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MARQUEE -->
  <!-- marquee  -->
  <div class="marquee-wrap">
    <div class="marquee-track">
      <span class="marquee-item"
        >Free Shipping Over $100 <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Sustainable Packaging <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >New Arrivals Every Week <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >30-Day Easy Returns <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Carbon-Neutral Delivery <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Free Shipping Over $100 <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Sustainable Packaging <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >New Arrivals Every Week <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >30-Day Easy Returns <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Carbon-Neutral Delivery <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Carbon-Neutral Delivery <span class="m-sep">✦</span></span
      >
      <span class="marquee-item"
        >Carbon-Neutral Delivery <span class="m-sep">✦</span></span
      >
    </div>
  </div>
  <!-- NEW ARRIVALS -->
  <section class="py-6">
    <div class="container-lg px-4">
      <div class="section-header">
        <div>
          <span class="section-badge">Just Dropped</span>
          <h2>New <span>Arrivals</span></h2>
          <p>Fresh picks added this week</p>
        </div>
        <router-link
          to="/shopping"
          class="text-white nav-link btn bg-btn px-5 rounded-pill py-2"
          >View All</router-link
        >
      </div>

      <div v-if="product.loading" class="row g-3">
        <div class="col-lg-3 col-md-6 col-12" v-for="n in 4" :key="n">
          <CardSkeleton />
        </div>
      </div>

      <div v-else class="row g-3">
        <div
          class="col-lg-3 col-md-6 col-12"
          v-for="pro in product.productList.slice(0, 4)"
          :key="pro.id"
        >
          <BaseCard :product="pro" @add-to-cart="handleCart" @buy-now="handleBuyNow"/>
        </div>
      </div>
    </div>
  </section>

  <!-- PROMOTION -->
  <section class="promotion py-6 px-4">
    <div class="container">
      <div class="row promo-wrapper">
        <div class="col-6 promo-content g-3">
          <div class="promo-badge">🌿 Seasonal Sale</div>

          <h2>Up to <span>40% Off</span></h2>

          <p>
            Sustainable essentials designed for everyday comfort and
            long-lasting wear.
          </p>

          <router-link
            to="/dashboard/createProduct"
            class="btn btn-light px-6 py-3 rounded-pill me-3"
          >
            Start Selling
          </router-link>
          <router-link
            to="/shopping"
            class="btn border-0 bg-btn px-6 py-3 rounded-pill"
          >
            View Collection
          </router-link>
        </div>

        <div class="col-6 promo-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
            alt="Sale"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section class="about-section py-6 px-4">
    <div class="container">
      <div class="about-header mt-3">
        <h1 class="text-center">Why Shopping With Us?</h1>
        <h4 class="text-center text-muted mb-4">
          Your trusted marketplace for quality fashion at unbeatable prices
        </h4>
      </div>

      <!-- Feature Cards -->
      <div class="row features-row">
        <div class="col-3">
          <div class="card feature-card">
            <div class="about-icon m-auto">
              <users />
            </div>
            <h3
              class="card-title text-center mt-2"
              style="color: black; font-size: 32px; font-weight: 700"
            >
              12K+
            </h3>
            <p class="card-text text-muted text-center">Happy customer</p>
          </div>
        </div>

        <div class="col-3">
          <div class="card feature-card">
            <div class="about-icon m-auto">
              <box />
            </div>
            <h3
              class="card-title text-center mt-2"
              style="color: black; font-size: 32px; font-weight: 700"
            >
              500+
            </h3>
            <p class="card-text text-muted text-center">Quality Products</p>
          </div>
        </div>

        <div class="col-3">
          <div class="card feature-card">
            <div class="about-icon m-auto">
              <award />
            </div>
            <h3
              class="card-title text-center mt-2"
              style="color: black; font-size: 32px; font-weight: 700"
            >
              4.9★
            </h3>
            <p class="card-text text-muted text-center">Average Rating</p>
          </div>
        </div>

        <div class="col-3">
          <div class="card feature-card">
            <div class="about-icon m-auto">
              <move-up-right />
            </div>
            <h3
              class="card-title text-center mt-2"
              style="color: black; font-size: 32px; font-weight: 700"
            >
              50+
            </h3>
            <p class="card-text text-muted text-center">Countries Served</p>
          </div>
        </div>
      </div>

      <div class="row about-wrapper gx-5 bg-light">
        <!-- Image -->
        <div class="col-6">
          <div class="card image-card">
            <img
              src="https://images.unsplash.com/photo-1758520387281-e897b134664f?w=1080&q=80"
              alt="Happy customers shopping"
              class="card-img"
            />

            <div class="since-badge">
              <span class="year">2020</span>
              <span class="label">Since</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="col-6">
          <div class="about-content">
            <h2>Your One-Stop Fashion Marketplace</h2>

            <p>
              Since 2020, we've been connecting fashion lovers with trusted
              sellers worldwide, offering trendy and high-quality products.
            </p>

            <p>
              With millions of customers across 50+ countries, we are known for
              reliability, affordability, and great service.
            </p>
            <p>
              Every product is carefully vetted, every seller is verified, and
              every transaction is protected. Shop with confidence and discover
              your next favorite style today.
            </p>
            <p>
              With millions of customers across 50+ countries, we are known for
              reliability, affordability, and great service.
            </p>

            <router-link class="btn border-0 bg-btn px-6 py-3 rounded-pill" to="/shopping">
              Start Shopping Now
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="features-section pt-3 pb-5 m-0">
    <h1 class="text-center fw-bold">Our Core Promises</h1>
    <h6 class="text-center mb-5">Simple, secure, and reliable shopping.</h6>
    <div class="container">
      <!-- Feature Cards -->
      <div class="row features-row">
        <div class="col-3">
          <div class="card feature-card">
            <div class="feature-icon">
              <shield-check />
            </div>
            <h3 class="card-title">Buyer Protection</h3>
            <p class="card-text">
              100% secure payment with money-back guarantee on all orders.
            </p>
          </div>
        </div>

        <div class="col-3">
          <div class="card feature-card">
            <div class="feature-icon">
              <truck />
            </div>
            <h3 class="card-title">Fast Shipping</h3>
            <p class="card-text">
              Free worldwide shipping on orders over $50. Delivery in 5–7 days.
            </p>
          </div>
        </div>

        <div class="col-3">
          <div class="card feature-card">
            <div class="feature-icon">
              <headphones />
            </div>
            <h3 class="card-title">24/7 Support</h3>
            <p class="card-text">
              Dedicated customer service team ready to help you anytime.
            </p>
          </div>
        </div>

        <div class="col-3">
          <div class="card feature-card">
            <div class="feature-icon">
              <credit-card />
            </div>
            <h3 class="card-title">Secure Payment</h3>
            <p class="card-text">
              Multiple payment options with encrypted transactions.
            </p>
          </div>
        </div>
      </div>

      <div class="trusted-banner">
        <span class="trusted-label">TRUSTED BY</span>
        <h2>12,000+ Happy Customers Worldwide</h2>
        <p>Join thousands who trust us every day</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* HERO */
.hero-section {
  background: linear-gradient(180deg, #ffffff, #f8f9fa);
}

.hero-badge {
  background: #d8f3dc;
  border: 1px solid #42b883;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  display: inline-block;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin: 1.2rem 0;
}

.hero-text {
  max-width: 460px;
  color: #6c757d;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

.hero-stats strong {
  font-size: 1.4rem;
}

.hero-stats span {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
}

.hero-image-wrap::after {
  content: "";
  position: absolute;
  inset: -30px;
  background: radial-gradient(
    circle,
    rgba(66, 184, 131, 0.18),
    transparent 60%
  );
  z-index: -1;
}

.hero-blob {
  width: 100%;
  max-width: 460px;
  aspect-ratio: 4/5;
  object-fit: cover;
  border-radius: 40% 60% 60% 40%;
  animation: morphBlob 12s ease-in-out infinite;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
}

.hero-float {
  position: absolute;
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  font-size: 0.8rem;
}

.hero-float.left {
  bottom: 3rem;
  left: 0;
  display: flex;
  gap: 0.6rem;
}

.hero-float.right {
  top: 0.5rem;
  right: 0;
  background: #42b883;
  color: #fff;
  text-align: center;
}

/* MARQUEE */
.marquee-wrap {
  background: linear-gradient(90deg, #2d6a4f, #42b883);
  padding: 1rem 0;
  overflow: hidden;
}

.marquee-track {
  display: flex;
  gap: 2rem;
  animation: marquee 22s linear infinite;
}

.marquee-item {
  color: #fff;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

/* SECTION */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.6rem;
  font-weight: 700;
}

.section-header h2 span {
  color: #dc3545;
}

.section-badge {
  font-weight: 700;
  color: #42b883;
}

/* PROMOTION */
.promotion {
  padding: 5rem 0;
}

.promo-wrapper {
  background: linear-gradient(135deg, #1b7f5a, #2d6a4f);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.25);
}

.promo-content {
  padding: 6rem;
  color: #fff;
}

.promo-content h2 {
  font-size: 4rem;
  font-weight: 800;
}

.promo-content span {
  color: #d8f3dc;
}

.promo-image img {
  width: 105%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  filter: brightness(0.85);
}

/* ABOUT */
.about-header h1 {
  font-size: 50px;
  line-height: 1.7;
  color: #070707;
  font-weight: 900;
}
.about-wrapper {
  align-items: center;
  padding: 80px 20px;
  margin: auto;
  background: white;
  border-bottom: 1px solid rgb(225, 209, 209);
  border-radius: 30px;
}

.image-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.since-badge {
  position: absolute;
  bottom: -1px;
  background: #009e60;
  color: #fff;
  padding: 25px 30px;
  border-radius: 16px;
  text-align: center;
}

.since-badge .year {
  font-size: 25px;
  font-weight: 700;
}

.since-badge .label {
  font-size: 12px;
  opacity: 0.85;
}
.about-icon {
  width: 56px;
  height: 56px;
  background: #52daa8;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 20px;
  color: #fff;
}

/* CONTENT */
.about-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
}

.about-content p {
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 16px;
}

/* FEATURES */
.features-section {
  padding: 100px 0;
}

.features-row {
  display: flex;
  margin-bottom: 80px;
}

.feature-card {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  height: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: #00a86b;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 20px;
  color: #fff;
}

/* TRUSTED */
.trusted-banner {
  background: #009e60;
  border-radius: 32px;
  padding: 70px 40px;
  text-align: center;
  color: #fff;
}

.trusted-label {
  font-size: 13px;
  letter-spacing: 2px;
  opacity: 0.9;
}

.trusted-banner h2 {
  font-size: 40px;
  font-weight: 800;
  margin: 16px 0;
}

/* Responsive */

/* Section */
/* ANIMATION */
@keyframes morphBlob {
  0%,
  100% {
    border-radius: 40% 60% 60% 40%;
  }

  33% {
    border-radius: 60% 40% 50% 50%;
  }

  66% {
    border-radius: 50% 50% 40% 60%;
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>
