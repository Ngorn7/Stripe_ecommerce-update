import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api/https";

export const useAuthStore = defineStore("auth", () => {
  let user = ref(null);
  let token = ref(localStorage.getItem("token"));
  let isLoggedIn = computed(() => !!token.value);

  async function login(email, password) {
    const res = await api.post("/api/login", { email, password });
    console.log(res);
    user.value = res.data.data.name;
    token.value = res.data.data.token;
    localStorage.setItem("token", token.value);
    if (!res.data.result) {
      throw new Error(res.data.message || "Invalid email or password");
    }
  }

  async function logout() {
    const res = await api.delete("/api/logout");
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  }

  async function register(name, email, password, password_confirmation) {
    await api.post("/api/register", {
      name,
      email,
      password,
      password_confirmation,
    });
  }

  return { user, token, isLoggedIn, login, logout, register };
});
