<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="text-center p-5 bg-white rounded-5 shadow-sm">
      <div class="display-1 text-main mb-3">
        <i class="bi bi-exclamation-triangle"></i>
      </div>

      <h1 class="fw-bold text-dark mb-2">404</h1>

      <h4 class="fw-semibold text-secondary mb-4">Oops! Page Not Found</h4>

      <p class="text-muted mb-5">
        The page you are looking for might have been removed, <br>
        had its name changed, or is temporarily unavailable.
      </p>

      <router-link to="/" class="btn bg-btn btn-lg rounded-5 text-white px-4 shadow-sm">
        <i class="bi bi-house-door me-2"></i>Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No logic needed for a static 404 page
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>