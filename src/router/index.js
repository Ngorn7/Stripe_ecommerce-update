import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../layouts/LayoutNav.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
          meta: { require: true, title: "Home | Vue Store" },
        },
        {
          path: "shopping",
          name: "shopping",
          component: () => import("../views/products/ShoppingView.vue"),
          meta: { title: "Shop | Vue Store" },
        },
        {
          path: "myCart",
          name: "myCart",
          component: () => import("../views/carts/CartsView.vue"),
          meta: { title: "Your Cart | Vue Store" },
        },
        {
          path: "detail/:id",
          name: "detail",
          component: () => import("../views/products/ProductDetailView.vue"),
          meta: { title: "Product Detail | Vue Store" },
        },
        {
          path: "checkout",
          name: "checkout",
          component: () => import("../views/payments/PaymentView.vue"),
          meta: { title: "Checkout | Vue Store" },
        },
        {
          path: "receipt",
          name: "receipt",
          component: () => import("../views/payments/ReceiptView.vue"),
          meta: { title: "Receipt | Vue Store" },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
      meta: { title: "Login | Vue Store" },
    },
    {
      path: "/dashboard",
      component: () => import("../layouts/DashboardLayout.vue"),
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/Dashboard.vue"),
          meta: { require: true, title: "Dashboard | Vue Store" },
        },
        {
          path: "category",
          name: "category",
          component: () => import("../views/categories/CategoryView.vue"),
          meta: { require: true, title: "Categories | Vue Store" },
        },
        {
          path: "myProfile",
          name: "myProfile",
          component: () => import("../views/profile/ProfileView.vue"),
          meta: { require: true, title: "Profile | Vue Store" },
        },
        {
          path: "createProduct",
          name: "createProduct",
          component: () => import("../views/products/CreateProductView.vue"),
          meta: { require: true, title: "Create Product | Vue Store" },
        },
        {
          path: "editProduct/:id",
          name: "editProduct",
          component: () => import("../views/products/EditProductView.vue"),
          meta: { require: true, title: "Edit Product | Vue Store" },
        },
        {
          path: "customerOrder",
          name: "customerOrder",
          component: () => import("../views/order/CustomerOrderView.vue"),
          meta: { require: true, title: "Customer Orders | Vue Store" },
        },
        {
          path: "previewOrder",
          name: "previewOrder",
          component: () => import("../views/order/previewOrderView.vue"),
          meta: { require: true, title: "Preview Order | Vue Store" },
        },
        {
          path: "MyOrder",
          name: "MyOrder",
          component: () => import("../views/order/MyOrderView.vue"),
          meta: { require: true, title: "My Orders | Vue Store" },
        },
      ],
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue"),
      meta: { title: "Register | Vue Store" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundPageView.vue"),
      meta: { title: "404 - Not Found | Vue Store" },
    },
  ],
});

router.beforeEach((to, from) => {
  // Update the tab title based on route meta
  document.title = to.meta.title || "Vue Store";

  let auth = useAuthStore();
  if (!auth.isLoggedIn && to.meta.require) {
    return { name: "login" };
  }
  return true;
});

export default router;