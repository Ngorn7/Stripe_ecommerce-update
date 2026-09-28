<template>
  <div class="dashboard-container">
    <nav :class="['sidebar', collapsed ? 'collapsed' : '']" style="z-index: 1000;">
      <div class="sidebar-header">
        <div class="brand" :class="{ 'brand-visible': !collapsed }">
          <router-link to="/">
            <img src="../assets/img/logo vue2.png" alt="" class="object-fit-contain" style="width: 130px;">
          </router-link>
        </div>
        <button class="toggle-btn" @click="toggleSidebar">
          <i
            class="bi"
            :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"
          ></i>
        </button>
      </div>

      <div class="nav-links">
        <router-link
          v-for="item in menuItems"
          :key="item.text"
          :to="item.path"
          class="nav-item"
          exact-active-class="active"
        >
          <div class="icon-box">
            <component :is="item.icon" size="24" />
          </div>
          <span class="nav-text" :class="{ 'text-visible': !collapsed }">
            {{ item.text }}
          </span>

          <span class="sidebar-hover-box" v-if="collapsed">
            {{ item.text }}
          </span>
        </router-link>
      </div>
    </nav>

    <main class="main-content">
      <navbar />

      <div class="content-body">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import {
  Store,
  LayersPlus,
  LayoutGrid,
  User,
  ListTodo,
  ListChecks,
  ShoppingBag,
} from "lucide-vue-next";
import { ref } from "vue";
const collapsed = ref(false);
const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

const menuItems = [
  { text: "My Product", path: "/dashboard", icon: Store },
  { text: "My Profile", path: "/dashboard/myProfile", icon: User },
  { text: "Create Product", path: "/dashboard/createProduct", icon: LayersPlus },
  { text: "Category", path: "/dashboard/category", icon: LayoutGrid },
  { text: "Customer Order", path: "/dashboard/customerOrder", icon: ListTodo },
  { text: "Preview Order", path: "/dashboard/previewOrder", icon: ListChecks },
  { text: "My Order", path: "/dashboard/MyOrder", icon: ShoppingBag },
];
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f3f4f6;
}

.sidebar {
  width: 260px;
  background-color: #35495e;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100vh;
  flex-shrink: 0;
  overflow: visible !important; 
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 68px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.brand {
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.3s ease;
  opacity: 0;
}

.brand-visible {
  opacity: 1;
  transform: translateX(0);
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  right: 24px;
}

.nav-links {
  padding: 15px 0;
  flex-grow: 1;
  overflow-y: visible !important; 
  overflow-x: visible !important;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 4px 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.2s ease;
  position: relative;
}

.icon-box {
  width: 60px;
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  z-index: 2;
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateX(-15px);
}

.text-visible {
  opacity: 1;
  transform: translateX(0);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* Tooltip Hover State */
.nav-item:hover .sidebar-hover-box {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(10px);
}

.nav-item.active {
  background: #42b883 !important;
  color: #ffffff !important;
}

/* --- THE CLEAN TEXT BOX (NO ARROW) --- */
.sidebar-hover-box {
  position: absolute;
  left: 65px;
  background-color: #35495e; 
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: transform 0.2s ease, opacity 0.2s ease;
  z-index: 1000; 
  box-shadow: 10px 10px 20px rgba(0,0,0,0.2);
  pointer-events: none;
  border: 1px solid rgba(255,255,255,0.1);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  z-index: auto; 
}

.content-body {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}
</style>