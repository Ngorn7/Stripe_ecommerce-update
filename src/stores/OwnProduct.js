import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useOwnProductStore = defineStore("own", () => {
  let loading = ref(false);
  let ownProduct = ref([]);
  const pagination = ref({
    has_page: true,
    on_first_page: true,
    has_more_pages: false,
    first_item: 1,
    last_item: 1,
    total: 0,
    current_page: 1,
    last_page: 0,
  });
  async function fetchMyOwnProduct(page = 1, per_page = 2) {
    loading.value = true;
    try {
      const res = await api.get(
        `/api/profile/products?page=${page}&per_page=${per_page}`,
      );
      console.log(res);
      ownProduct.value = res.data.data;
      if (res.data.paginate) {
        pagination.value = res.data.paginate;
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }
  return { loading, ownProduct, pagination, fetchMyOwnProduct };
});
