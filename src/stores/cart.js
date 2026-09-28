import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";
export const useCartStore = defineStore("cart", () => {
  const toast = useToast();
  let loadingCart = ref(false);
  let loadingAdd = ref(false);
  let loadingDelete = ref(false);
  let myCart = ref([]);
  let countQty = ref(1);
  let countProduct = ref(0);
  let total = ref(0);
  async function fetchMyCart() {
    loadingCart.value = true;
    try {
      const res = await api.get("/api/profile/carts");
      // console.log(res);
      myCart.value = res.data.data.items;
      total.value = res.data.data.total;
      countProduct.value = myCart.value.length;
    } catch (err) {
      console.log(err);
    } finally {
      loadingCart.value = false;
    }
  }

  async function addToMyCart(product_id, qty) {
    const exists = myCart.value.find((item) => item.product.id === product_id);

    if (exists && exists.qty === qty) {
      toast.warning("This product is already in your cart!");
      return;
    }

    loadingAdd.value = true;
    try {
      const res = await api.post("/api/carts", {
        product_id: product_id,
        qty: qty,
      });

      await fetchMyCart();
      // console.log(res);

      if (!exists) toast.success("Product added to cart!");
      else toast.info("Quantity updated!");

    } catch (err) {
      console.log(err);
    } finally {
      loadingAdd.value = false;
    }
  }

  async function deleteMyCart(id) {
    loadingDelete.value = true;
    try {
      await api.delete(`/api/carts/${id}`);
      await fetchMyCart();
    } catch (err) {
      console.log(err);
    } finally {
      loadingDelete.value = false;
    }
  }

  return {
    loadingCart,
    loadingAdd,
    loadingDelete,
    myCart,
    countQty,
    countProduct,
    total,
    fetchMyCart,
    addToMyCart,
    deleteMyCart,
  };
});
