<template>
  <div class="container-fluid bg-white rounded-5 p-4">

    <!-- HEADER -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <div class="skeleton icon"></div>
      <div class="d-flex flex-column gap-2">
        <div class="skeleton text-lg"></div>
        <div class="skeleton text-sm"></div>
      </div>
    </div>

    <!-- FORM GRID -->
    <div class="row gy-4 gx-5 mt-3">

      <!-- LEFT COLUMN -->
      <div class="col-md-6" v-for="i in 4" :key="'left-'+i">
        <div class="skeleton label mb-2"></div>
        <div class="skeleton input"></div>
      </div>

      <!-- IMAGE SECTION -->
      <div class="col-md-6">
        <div class="skeleton label mb-2"></div>
        <div class="skeleton image-box"></div>
      </div>

      <!-- DESCRIPTION -->
      <div class="col-md-6">
        <div class="skeleton label mb-2"></div>
        <div class="skeleton textarea"></div>
      </div>

    </div>

    <!-- BUTTON -->
    <div class="d-flex justify-content-end mt-5">
      <div class="skeleton btn"></div>
    </div>

  </div>
</template>

<style scoped>

/* ================= SHIMMER ================= */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: #e2e2e2;
  border-radius: 14px;
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

/* ================= SHAPES ================= */

.icon {
  width: 45px;
  height: 45px;
  border-radius: 14px;
}

.text-lg {
  width: 180px;
  height: 18px;
}

.text-sm {
  width: 220px;
  height: 12px;
}

.label {
  width: 80px;
  height: 15px;
  border-radius: 8px;
}

.input {
  width: 100%;
  height: 45px;
  border-radius: 12px;
}

.image-box {
  width: 100%;
  height: 250px;
  border-radius: 20px;
}

.textarea {
  width: 100%;
  height: 250px;
  border-radius: 20px;
}

.btn {
  width: 200px;
  height: 45px;
  border-radius: 50px;
}

</style>