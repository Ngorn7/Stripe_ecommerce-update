<template>
  <div>
    <div v-if="cart.loadingAdd" class="full-loader">
      <div class="loader">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
    <template v-if="product.loading">
      <DetailSkeleton />
    </template>
    <template v-else>
      <div class="container mt-6">
        <div class="row align-items-center g-4" style="height: 600px">
          <div class="col-lg-5">
            <div class="card-img px-5" style="height: 500px">
              <img
                :src="product.productDetail?.image"
                alt=""
                class="w-100 h-100 rounded-4 object-fit-cover"
              />
            </div>
          </div>
          <div class="col-lg-7">
            <div class="d-flex flex-column gap-4 px-5">
              <div class="d-flex flex-column gap-4">
                <h3 class="m-0 fw-bold mb-2">{{ product.productDetail?.title }}</h3>
                <h4 class="text-main fw-semibold m-0">
                  US ${{ product.productDetail?.price }}
                </h4>
                <div class="d-flex gap-3">
                  <h6
                    class="rounded-4 text-main w-fit bg-cate-success px-5 align-content-center fs-6 m-0 py-1"
                  >
                    {{ product.productDetail?.categories?.[0]?.name }}
                  </h6>
                  <h6
                    class="rounded-4 text-main w-fit bg-cate-success px-5 align-content-center fs-6 m-0 py-1"
                  >
                    {{ product.productDetail?.condition }}
                  </h6>
                </div>

                <h4 class="m-0 fw-medium">{{ product.productDetail?.description }}</h4>
              </div>

              <div>
                <h5 class="fw-bold mb-3">Quantity</h5>
                <div class="d-flex gap-2">
                  <span
                    @click="dec"
                    class="px-4 bg-second py-2 rounded-3 cursor-pointer"
                    ><Minus
                  /></span>
                  <span class="px-5 bg-second py-2 rounded-3 fs-5">{{
                    qty
                  }}</span>
                  <span
                    @click="inc"
                    class="px-4 bg-second py-2 rounded-3 cursor-pointer"
                    ><Plus
                  /></span>
                </div>
              </div>

              <div class="d-flex gap-3">
                <button
                  @click="handleCart"
                  class="btn bg-btn w-50 btn-lg rounded-5 fw-medium"
                >
                  Add to Cart
                </button>
                <button
                  @click="handleBuyNow"
                  class="btn bg-btn w-50 btn-lg rounded-5 fw-medium"
                >
                  Buy now
                </button>
              </div>

              <div class="card bg-second rounded-5">
                <div class="card-body">
                  <div class="d-flex align-items-center gap-2">
                    <img
                      :src="product.productDetail?.creator?.avatar"
                      alt=""
                      class="rounded-circle object-fit-cover"
                      style="width: 40px; height: 40px"
                    />
                    <div class="d-flex gap-1 flex-column">
                      <div class="d-flex gap-2">
                        <p class="m-0 p-0 fs-6">
                          {{ product.productDetail?.creator?.name }}
                        </p>
                        <h6
                          class="rounded-4 text-main w-fit bg-cate-success py-0 px-3 align-content-center fs-6 m-0"
                        >
                          Owner
                        </h6>
                      </div>
                      <p class="m-0 p-0 fs-6">
                        {{ product.productDetail?.creator?.email }} | Member Since
                        {{ formatDate(product.productDetail?.created_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import DetailSkeleton from "@/components/DetailSkeleton.vue";
import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/product";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
let product = useProductStore();

const cart = useCartStore();
let qty = ref(1);

onMounted(() => {
  product.getProductById(id);
});

const handleCart = () => {
  cart.addToMyCart(id, qty.value);
};

const handleBuyNow = () => {
  cart.addToMyCart(id, qty.value);
  router.push("/myCart");
};

const inc = () => {
  qty.value++;
};

const dec = () => {
  if (qty.value == 1) return;
  else qty.value--;
};

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
</script>

<style scoped>
.full-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
}

.loader {
  display: flex;
  align-items: center;
}

.bar {
  display: inline-block;
  width: 4px;
  height: 25px;
  background-color: white;
  border-radius: 10px;
  animation: scale-up4 1s linear infinite;
}

.bar:nth-child(2) {
  height: 40px;
  margin: 0 6px;
  animation-delay: 0.25s;
}

.bar:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes scale-up4 {
  20% {
    transform: scaleY(1.5);
  }
  40% {
    transform: scaleY(1);
  }
}
</style>
