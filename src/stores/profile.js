import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useProfileStore = defineStore("profile", () => {
  let loading = ref(false);
  let myProfile = ref([]);
  let mustEdit = ref(false);
  async function fetchMyProfile() {
    loading.value = true;
    try {
      const res = await api.get("/api/me");
      myProfile.value = res.data.data;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  return { loading, myProfile, fetchMyProfile };
});
