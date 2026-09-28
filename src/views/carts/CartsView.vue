<template>
  <div class="pb-5">
    <div v-if="cart.loadingDelete || cart.loadingAdd" class="full-loader">
      <div class="loader">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
    <template v-if="cart.loadingCart">
      <CartSkeletonView />
    </template>
    <template v-else-if="cart.myCart.length === 0">
      <div class="empty-wrapper">
        <div class="text-center">
          <vue3-lottie
            :animationData="emptyCartAnimation"
            :loop="true"
            :autoplay="true"
            style="width: 300px; height: 300px"
          />
          <h3 class="fw-bold mb-3">Your bag is empty</h3>
          <p>
            Check out our latest arrivals stay up-to-date with latest styles
          </p>
          <router-link
            to="/shopping"
            class="btn bg-btn fw-medium rounded-5 px-5"
          >
            Go Shopping
          </router-link>
        </div>
      </div>
    </template>
    <template v-else>
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
            <tr v-for="pro in cart.myCart" :key="pro.id">
              <td class="text-start ps-4">
                <div class="d-flex align-items-center gap-4">
                  <img
                    :src="pro.product.image"
                    class="object-fit-cover rounded-3"
                    width="80"
                    height="80"
                  />
                  <p class="mb-0 fw-bold">{{ pro.product.title }}</p>
                </div>
              </td>

              <td class="text-main fw-bold">US ${{ pro.product.price }}</td>

              <td>
                <div class="d-flex justify-content-center gap-2">
                  <span
                    @click="dec(pro)"
                    class="px-3 bg-second py-1 rounded-3 cursor-pointer"
                  >
                    <Minus size="18" />
                  </span>
                  <span class="px-4 bg-second py-1 rounded-3">{{
                    pro.qty
                  }}</span>
                  <span
                    @click="inc(pro)"
                    class="px-3 bg-second py-1 rounded-3 cursor-pointer"
                  >
                    <Plus size="18" />
                  </span>
                </div>
              </td>

              <td class="text-main fw-bold">
                US ${{ pro.product.price * pro.qty }}
              </td>

              <td>
                <button class="btn border-0" @click="cart.deleteMyCart(pro.id)">
                  <Trash2 />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <router-link class="nav-link" to="/shopping">
          <h6 class="text-muted fw-normal">
            <ArrowLeft size="18" /> Back to Shop
          </h6>
        </router-link>
      </div>
      <div class="d-flex justify-content-end container px-0">
        <div class="d-flex flex-column" style="width: 450px">
          <h5 class="fw-bold mb-3">Cart Total</h5>
          <table class="table w-100 mb-3">
            <tbody>
              <tr>
                <td class="text-muted">Total Products</td>
                <td class="text-end text-muted">{{ cart.countProduct }}</td>
              </tr>
              <tr>
                <td class="text-muted">Sub Total</td>
                <td class="text-end text-muted">US ${{ cart.total }}</td>
              </tr>
              <tr>
                <td class="text-muted">Delivery Fee</td>
                <td class="text-end text-muted">#</td>
              </tr>
              <tr class="border-0">
                <td class="fw-bold border-0">Grand Total</td>
                <td class="text-end fw-bold text-main border-0">
                  US ${{ cart.total }}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            @click="goCheckOut"
            class="btn bg-btn fw-medium rounded-5 px-5 ms-auto"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import CartSkeletonView from "@/components/CartSkeletonView.vue";
import { useCartStore } from "@/stores/cart";
import emptyCartAnimation from "@/assets/img/empty-cart.json";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile";
import { useToast } from "vue-toastification";
let cart = useCartStore();
const router = useRouter();
let MyProfileStore = useProfileStore();
let toast = useToast();

const inc = async (pro) => {
  await cart.addToMyCart(pro.product.id, pro.qty + 1);
};

const dec = async (pro) => {
  if (pro.qty > 1) await cart.addToMyCart(pro.product.id, pro.qty - 1);
  else await cart.deleteMyCart(pro.id);
};

onMounted(() => {
  cart.fetchMyCart();
});

const goCheckOut = () => {
  const profile = MyProfileStore.myProfile;

  if (!profile.phone || !profile.location) {
    MyProfileStore.mustEdit = true;
    router.push({ name: "myProfile" });
    toast.warning("Phone and Address is require");
  } else {
    router.push("/checkout");
  }
};
</script>

<style scoped>
.empty-wrapper {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
