import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useProductStore = defineStore("product", () => {
  let productList = ref([]);
  let productDetail = ref({});
  let loading = ref(false);
  async function fetchProduct(item) {
    loading.value = true;
    try {
      const res = await api.get(`/api/products?page=1&per_page=100&search=${item}`);
      // console.log(res);
      productList.value = res.data.data;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  async function getProductById(id) {
    loading.value = true;
    try {
      const res = await api.get(`/api/products/${id}`);
      productDetail.value = res.data.data;
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  return { productList, productDetail, fetchProduct, getProductById, loading };
});
