<template>
  <div class="card border-0 position-relative mt-5 bg-transparent">
    
    <!-- AUTHOR -->
    <div class="author ps-3 pt-2 d-flex align-items-center gap-3 bg-light">
      <div class="skeleton circle"></div>
      <div class="d-flex flex-column gap-1 fw-bold">
        <div class="skeleton text-sm"></div>
        <div class="skeleton text-xs"></div>
      </div>
    </div>

    <!-- IMAGE -->
    <div class="item bg-light pt-5 pb-1 px-5" style="height: 250px">
      <div class="skeleton image"></div>
    </div>

    <!-- DETAIL -->
    <div class="detail bg-light py-3">
      
      <!-- TITLE -->
      <div class="d-flex justify-content-center">
        <div class="skeleton text-md"></div>
      </div>

      <!-- BUTTONS -->
      <div class="px-5 d-flex gap-4 justify-content-center mt-3">
        <div class="skeleton btn-icon"></div>
        <div class="skeleton btn-main"></div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.card {
  position: relative;
}

/* Badge Shape */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 45%;
  height: 50px;
  border-bottom-left-radius: 30px;
  box-shadow: -30px 25px 0 #f8f9fa;
  z-index: 0;
}

.card::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: calc(45% - 6px);
  height: 45px;
  border-radius: 30px;
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f0f0f0 50%,
    #e2e2e2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  z-index: 1;
}

/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Sections */
.author {
  width: 55%;
  height: 50px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  position: relative;
  z-index: 2;
}

.item {
  border-top-right-radius: 30px;
  position: relative;
  z-index: 2;
}

.detail {
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 5px 0 #42b883;
  position: relative;
  z-index: 2;
}

/* Skeleton Base */
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
  background: linear-gradient(
    90deg,
    #e2e2e2 25%,
    #f0f0f0 50%,
    #e2e2e2 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

/* Shapes */
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.image {
  width: 100%;
  height: 100%;
  border-radius: 30px;
}

.text-sm {
  width: 60px;
  height: 12px;
  border-radius: 8px;
}

.text-xs {
  width: 40px;
  height: 10px;
  border-radius: 8px;
}

.text-md {
  width: 150px;
  height: 15px;
  border-radius: 10px;
}

/* Buttons */
.btn-icon {
  width: 65px;
  height: 40px;
  border-radius: 50px;
}

.btn-main {
  width: 100%;
  height: 40px;
  border-radius: 50px;
}
</style>
