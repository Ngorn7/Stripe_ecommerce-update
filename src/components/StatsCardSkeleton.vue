<template>
  <div class="row g-4">
    <!-- Repeat 3 cards -->
    <div class="col-md-4" v-for="n in 3" :key="n">
      <div class="stats-card p-4 border-0 rounded-4 shadow-sm bg-white">
        
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-start mb-3">
          
          <!-- Left Text -->
          <div class="stat-info w-75">
            <div class="skeleton text-sm mb-2"></div>
            <div class="skeleton text-lg"></div>
          </div>

          <!-- Icon -->
          <div class="stat-icon-skeleton">
            <div class="skeleton icon-circle"></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="stat-footer mt-2 d-flex align-items-center gap-2">
          <div class="skeleton badge-sm"></div>
          <div class="skeleton text-xs"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

/* Base Skeleton */
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e2e2;
  border-radius: 12px;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f5f5f5 50%,
    #e2e2e2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

/* Animation */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Text Sizes */
.text-sm {
  width: 120px;
  height: 14px;
  border-radius: 8px;
}

.text-lg {
  width: 160px;
  height: 28px;
  border-radius: 10px;
}

.text-xs {
  width: 90px;
  height: 12px;
  border-radius: 8px;
}

/* Icon */
.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

/* Footer badge */
.badge-sm {
  width: 70px;
  height: 22px;
  border-radius: 50px;
}

</style>