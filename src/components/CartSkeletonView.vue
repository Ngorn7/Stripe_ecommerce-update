<template>
  <div class="container px-0 mt-5">
    <table class="table align-middle text-center">
      <thead>
        <tr>
          <th class="text-start ps-5">Products</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 3" :key="n">
          <!-- Product -->
          <td class="text-start ps-4">
            <div class="d-flex align-items-center gap-4">
              <div class="skeleton skeleton-img"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </td>

          <!-- Price -->
          <td>
            <div class="skeleton skeleton-small mx-auto"></div>
          </td>

          <!-- Quantity -->
          <td>
            <div class="d-flex justify-content-center gap-2">
              <div class="skeleton skeleton-btn"></div>
              <div class="skeleton skeleton-qty"></div>
              <div class="skeleton skeleton-btn"></div>
            </div>
          </td>

          <!-- Total -->
          <td>
            <div class="skeleton skeleton-small mx-auto"></div>
          </td>

          <!-- Remove -->
          <td>
            <div class="skeleton skeleton-icon mx-auto"></div>
          </td>
        </tr>
      </tbody>
    </table>
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
  border-radius: 10px;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e2e2e2 25%, #f5f5f5 50%, #e2e2e2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

/* Shapes */
.skeleton-img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
}
.skeleton-text {
  width: 120px;
  height: 18px;
  border-radius: 6px;
}
.skeleton-small {
  width: 60px;
  height: 16px;
  border-radius: 6px;
}
.skeleton-btn {
  width: 40px;
  height: 30px;
  border-radius: 6px;
}
.skeleton-qty {
  width: 40px;
  height: 30px;
  border-radius: 6px;
}
.skeleton-icon {
  width: 24px;
  height: 26px;
}
</style>