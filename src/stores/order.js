import api from "@/api/https";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useOrderStore = defineStore("order", () => {
  const loading = ref(false);
  const orderProduct = ref([]);
  const myOrder = ref([]);

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

  const processedCurrentPage = ref(1);
  const itemsPerPage = 5;

  const totalApprovedRevenue = computed(() => {
    return orderProduct.value
      .filter((item) => item.status === 2)
      .reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.qty) || 1;
        return sum + itemPrice * itemQty;
      }, 0);
  });

  const formattedRevenue = computed(() => {
    return totalApprovedRevenue.value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  const allProcessed = computed(() =>
    orderProduct.value.filter((item) => item.status === 2 || item.status === 3),
  );

  const processedOrders = computed(() => {
    const start = (processedCurrentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allProcessed.value.slice(start, end);
  });

  const processedPaginationUI = computed(() => {
    const total = allProcessed.value.length;
    const lastPage = Math.ceil(total / itemsPerPage);
    const currentPage = processedCurrentPage.value;

    const first = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const last = Math.min(currentPage * itemsPerPage, total);

    return {
      current_page: currentPage,
      last_page: lastPage,
      total: total,
      first_item: first,
      last_item: last,
      on_first_page: currentPage === 1,
      has_more_pages: currentPage < lastPage,
      has_page: lastPage > 1,
    };
  });

  const pendingOrders = computed(() =>
    orderProduct.value.filter((item) => item.status === 1),
  );

  async function fetchOrder(page = 1) {
    loading.value = true;
    try {
      const res = await api.get(
        `/api/profile/payment-check?page=${page}&per_page=100`,
      );
      orderProduct.value = res.data.data;
      if (res.data.paginate) {
        pagination.value = res.data.paginate;
      }
      processedCurrentPage.value = 1;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyOrder(page = 1, per_page = 5) {
    loading.value = true;
    try {
      const res = await api.get(
        `/api/profile/purchased?page=${page}&per_page=${per_page}`,
      );
      myOrder.value = res.data.data;
      if (res.data.paginate) {
        pagination.value = res.data.paginate;
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function changeStatus(id, action) {
    try {
      await api.put(`/api/payments/${action}/${id}`);
      await fetchOrder();
    } catch (err) {
      console.log(err);
    }
  }

  return {
    loading,
    orderProduct,
    pendingOrders,
    processedOrders,
    processedPaginationUI,
    processedCurrentPage,
    totalApprovedRevenue,
    formattedRevenue,
    myOrder,
    pagination,
    fetchOrder,
    changeStatus,
    fetchMyOrder,
  };
});
