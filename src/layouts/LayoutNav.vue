<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
const cart = useCartStore();
const auth = useAuthStore();
onMounted(() => {
  if (auth.isLoggedIn) {
    cart.fetchMyCart();
  }
});
</script>
