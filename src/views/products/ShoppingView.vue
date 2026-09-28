<script setup>
import BaseCard from "@/components/BaseCard.vue";
import BaseInput from "@/components/BaseInput.vue";
import CardSkeleton from "@/components/CardSkeleton.vue";
import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/product";
import { watch } from "vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const product = useProductStore();
const cart = useCartStore();
const router = useRouter();
const search = ref("");

onMounted(() => {
  product.fetchProduct("");
});

watch(search, (newValue) => {
  product.fetchProduct(newValue);
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
  <div>
    <div v-if="cart.loadingAdd" class="full-loader">
      <div class="loader">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>

    <div class="container pb-5">
      <div class="row g-4">
        <BaseInput
          input-icon="Search"
          class="mt-5 rounded-pill"
          input-placeholder="Search..."
          v-model="search"
        />
        <template v-if="product.loading">
          <div class="col-md-4 col-lg-3" v-for="n in 8" :key="'skeleton-' + n">
            <CardSkeleton />
          </div>
        </template>
        <template v-else>
          <template v-if="product.productList.length > 0">
            <div
              class="col-md-4 col-lg-3"
              v-for="pro in product.productList"
              :key="pro.id"
            >
              <router-link :to="`/detail/${pro.id}`" class="nav-link">
                <BaseCard
                  :product="pro"
                  @add-to-cart="handleCart"
                  @buy-now="handleBuyNow"
                />
              </router-link>
            </div>
          </template>

          <div v-else class="col-12 text-center py-5">
            <div style="font-size: 50px; margin-bottom: 10px"><Search size="50"/></div>
            <h3 style="font-weight: 700; color: #333">No products found</h3>
            <!-- <button @click="search = ''" class="btn bg-btn rounded-pill px-6 py-2">
              Clear Search
            </button> -->
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
