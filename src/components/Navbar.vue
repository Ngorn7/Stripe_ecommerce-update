<template>
  <div class="position-sticky w-100 top-0 z-3">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div class="container-fluid">
        <div>
          <ul class="navbar-nav gap-2">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link fs-6 fw-bold text-uppercase text-dark ls"
                exact-active-class="text-main"
              >
                Home
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                to="/shopping"
                class="nav-link fs-6 fw-bold text-uppercase text-dark ls"
                exact-active-class="text-main"
              >
                Shopping
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                to="/dashboard/createProduct"
                class="nav-link fs-6 fw-bold text-uppercase text-dark ls"
                exact-active-class="text-main"
              >
                Start Selling
              </router-link>
            </li>
          </ul>
        </div>
        <router-link to="/" class="navbar-brand fw-bold">
          <img
            src="../assets/img/logo vue.png"
            class=""
            alt=""
            style="width: 150px; object-fit: contain"
          />
        </router-link>
        <div class="d-flex align-items-center gap-3">
          <OverlayBadge
            @click="goMyCart"
            :value="cart.countProduct"
            severity="danger"
            class="small-badge"
          >
            <ShoppingBag :size="25" style="cursor: pointer" />
          </OverlayBadge>

          <div class="nav-dropdown p-2">
            <div
              class="d-flex align-items-center gap-2"
              style="cursor: pointer"
            >
              <template v-if="profile.loading">
                <div class="skeleton circle"></div>
                <div class="skeleton text-sm"></div>
              </template>

              <template v-else>
                <img
                  :src="profile.myProfile?.avatar"
                  class="rounded-circle"
                  width="34"
                  height="34"
                />
                <p class="m-0 p-0" style="font-size: 14px">
                  {{ profile.myProfile?.name }}
                </p>
              </template>
            </div>

            <div class="menu-container">
              <Menu :model="profileItems">
                <template #start>
                  <div
                    class="d-flex justify-content-between align-items-center px-3 py-2"
                  >
                    <span class="text-secondary small fw-bold">Appearance</span>
                  </div>
                </template>
                <template #item="{ item, props }">
                  <a
                    v-bind="props.action"
                    class="d-flex align-items-center gap-3"
                    :class="{ 'text-danger': item.label === 'Logout' }"
                  >
                    <component
                      :is="item.icon"
                      :class="{ 'text-danger': item.label === 'Logout' }"
                    />
                    <span>{{ item.label }}</span>
                  </a>
                </template>
              </Menu>
            </div>
            <BaseModal
              v-if="open"
              @closeModal="toggleModal"
              position="justify-content-center"
            >
              <template #header>
                <h5 class="modal-title mx-auto">Sign out</h5>
              </template>
              <template #body>
                <p class="text-center mb-0">
                  Are you sure you want to sign out?
                </p>
              </template>
              <template #footer>
                <button
                  type="button"
                  class="btn btn-secondary rounded-pill py-2 px-6"
                  @click="toggleModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-danger rounded-pill py-2 px-6"
                  @click="handleLogout"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  Sign out
                </button>
              </template>
            </BaseModal>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { h, onMounted } from "vue";
import { LogOut, ShoppingBag, User, Store } from "lucide-vue-next";
import Menu from "primevue/menu";
import OverlayBadge from "primevue/overlaybadge";
import BaseModal from "./BaseModal.vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

const router = useRouter();
const goMyCart = () => {
  router.push("/myCart");
};

const cart = useCartStore();
const profile = useProfileStore();
const auth = useAuthStore();

onMounted(() => {
  cart.fetchMyCart();
  profile.fetchMyProfile();
});

const profileItems = [
  {
    label: "Profile",
    icon: User,
    class: "item-gap",
    command: () => router.push("/dashboard/myProfile"),
  },
  {
    label: "My Order",
    icon: () => h(ShoppingBag, { size: 22 }),
    class: "item-gap",
    command: () => router.push("/dashboard/myOrder"),
  },
  {
    label: "My Product",
    icon: () => h(Store, { size: 22 }),
    class: "item-gap",
    command: () => router.push("/dashboard"),
  },
  { separator: true, class: "item-gap" },
  {
    label: "Logout",
    icon: LogOut,
    command: () => toggleModal(),
  },
];

const open = ref(false);
let loading = ref(false);
const toggleModal = () => {
  if (loading.value) return;
  open.value = !open.value;
};

async function handleLogout() {
  loading.value = true;
  try {
    await auth.logout();
    open.value = false;
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.nav-dropdown {
  position: relative;
  display: inline-block;
}

.menu-container {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.nav-dropdown:hover .menu-container {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

:deep(.p-menu) {
  padding: 0.4rem 0.5rem;
  border-radius: 12px;
}

:deep(.item-gap) {
  margin-bottom: 3px;
}

.ls {
  letter-spacing: 1px;
}

.small-badge :deep(.p-badge) {
  min-width: 18px !important;
  height: 18px !important;
  font-size: 12px !important;
  cursor: pointer;
}

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
  background: linear-gradient(90deg, #e2e2e2 25%, #f0f0f0 50%, #e2e2e2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
}

.circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.text-sm {
  width: 60px;
  height: 12px;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
