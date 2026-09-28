<template>
  <div class="container mt-6">
    <div class="row align-items-center g-4" style="height: 600px">
      <!-- LEFT IMAGE -->
      <div class="col-lg-5">
        <div class="px-5" style="height: 500px">
          <div class="skeleton image h-100"></div>
        </div>
      </div>

      <!-- RIGHT CONTENT -->
      <div class="col-lg-7">
        <div class="d-flex flex-column gap-4 px-5">
          <!-- Title -->
          <div class="skeleton text-title"></div>

          <!-- Price -->
          <div class="skeleton text-price"></div>

          <!-- Category + Condition -->
          <div class="d-flex gap-3 align-items-center">
            <div class="skeleton badge-pill"></div>
            <div class="skeleton badge-pill"></div>
          </div>

          <!-- Description -->
          <div class="skeleton text-description"></div>

          <!-- Quantity -->
          <div>
            <div class="skeleton text-qty-label mb-3"></div>
            <div class="d-flex gap-2">
              <div class="skeleton qty-btn"></div>
              <div class="skeleton qty-number"></div>
              <div class="skeleton qty-btn"></div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-3">
            <div class="skeleton btn-main"></div>
            <div class="skeleton btn-main"></div>
          </div>

          <!-- Creator Card -->
          <div class="card bg-second rounded-5">
            <div class="card-body">
              <div class="d-flex align-items-center gap-2">
                <div class="skeleton circle"></div>
                <div class="d-flex flex-column gap-1 w-100">
                  <div class="d-flex gap-2 align-items-center">
                    <div class="skeleton text-name"></div>
                    <div class="skeleton badge-sm"></div>
                  </div>
                  <div class="skeleton text-email"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e2e2;
  border-radius: 20px;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

/* Image */
.image {
  width: 100%;
  height: 100%;
  border-radius: 30px;
}

/* Text Sizes */
.text-title {
  width: 70%;
  height: 26px;
}
.text-price {
  width: 40%;
  height: 20px;
}
.text-description {
  width: 100%;
  height: 60px;
  border-radius: 15px;
}
.text-qty-label {
  width: 120px;
  height: 18px;
}
.text-name {
  width: 120px;
  height: 14px;
}
.text-email {
  width: 70%;
  height: 12px;
}

/* Category / Condition pills */
.badge-pill {
  width: 110px;
  height: 28px;
  border-radius: 50px;
}

/* Creator small badge */
.badge-sm {
  width: 60px;
  height: 20px;
  border-radius: 50px;
}

/* Quantity buttons */
.qty-btn {
  width: 50px;
  height: 42px;
  border-radius: 8px;
}
.qty-number {
  width: 50px;
  height: 42px;
  border-radius: 8px;
}

/* Buttons */
.btn-main {
  width: 100%;
  height: 45px;
  border-radius: 50px;
}

/* Avatar */
.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
