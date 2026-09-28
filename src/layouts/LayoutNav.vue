<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
import { useCartStore } from "@/stores/cart";
import { onMounted } from "vue";
const cart = useCartStore();
onMounted(() => {
  cart.fetchMyCart();
});
</script>
