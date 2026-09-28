<template>
  <div class="container-fluid py-4 bg-white rounded-5 px-4">
    <div class="d-flex align-items-center justify-content-between mb-5">
      <div class="d-flex align-items-center gap-3">
        <div class="icon-box-title">
          <Store class="text-main" :size="28" />
        </div>
        <div>
          <h3 class="fw-bold mb-0">Sales Overview</h3>
          <p class="text-muted mb-0 small">Monitoring your store performance</p>
        </div>
      </div>
      <button
        @click="goCreateProduct"
        class="btn bg-btn d-flex align-items-center gap-2 px-4 rounded-pill"
      >
        <Plus :size="18" /> New Product
      </button>
    </div>

    <template v-if="order.loading">
      <StatsCardSkeleton />
    </template>

    <template v-else>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="stats-card p-4 border-0 rounded-4 shadow-sm bg-white">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="stat-info">
                <p class="text-secondary fw-medium mb-1">Total Revenue</p>
                <h2 class="fw-bold mb-0 text-dark">
                  ${{ order.formattedRevenue }}
                </h2>
              </div>
              <div class="stat-icon bg-cate-success text-success">
                <DollarSign class="text-success" :size="24" />
              </div>
            </div>
            <div class="stat-footer mt-2 d-flex align-items-center">
              <span
                class="badge bg-cate-success text-success border-0 rounded-pill px-2 py-1"
              >
                <TrendingUp :size="12" class="me-1" /> +14.5%
              </span>
              <span class="text-muted small ms-2">vs last month</span>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stats-card p-4 border-0 rounded-4 shadow-sm bg-white">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="stat-info">
                <p class="text-secondary fw-medium mb-1">Total Orders</p>
                <h2 class="fw-bold mb-0 text-dark">
                  {{ String(order.orderProduct.length).padStart(2, "0") }}
                </h2>
              </div>
              <div class="stat-icon bg-cate-primary">
                <ShoppingBag class="text-primary" :size="24" />
              </div>
            </div>
            <div class="stat-footer mt-2">
              <span class="text-muted small">
                <CheckCircle :size="14" class="text-success me-1" />
                {{ order.pendingOrders.length }} pending today
              </span>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stats-card p-4 border-0 rounded-4 shadow-sm bg-white">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="stat-info">
                <p class="text-secondary fw-medium mb-1">Total Items</p>
                <h2 class="fw-bold mb-0 text-dark">
                  {{ String(own.pagination.total).padStart(2, "0") }}
                </h2>
              </div>
              <div class="stat-icon bg-cate-warning">
                <Store class="text-warning" :size="24" />
              </div>
            </div>
            <div class="stat-footer mt-2">
              <span class="text-muted small">Total products available</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="d-flex align-items-center gap-3 mt-5">
      <div class="icon-box-title">
        <Store class="text-main" :size="28" />
      </div>
      <div>
        <h3 class="fw-bold mb-1">Product Management</h3>
        <p class="text-muted mb-0 small">
          Update and organize your store inventory
        </p>
      </div>
    </div>

    <div class="table-responsive mt-5">
      <div v-if="own.loading" class="text-center py-5">
        <div class="loader">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <p class="mt-3 text-muted small">Loading your products...</p>
      </div>

      <div v-else-if="own.ownProduct.length === 0">
        <p class="text-muted text-center">No Product</p>
      </div>

      <BaseTable
        v-else
        :column="columns"
        :rows="own.ownProduct"
        @delete="handleDelete"
        @edit="handleEdit"
      >
        <template #col-image="{ value }">
          <img :src="value" class="rounded-3" width="70" height="70" />
        </template>

        <template #col-title="{ value }">
          <p class="m-0 fw-medium">{{ value }}</p>
        </template>

        <template #col-categories="{ value }">
          <p class="badge rounded-pill px-4 py-2 fw-medium bg-cate-success">
            {{ value[0]?.name ?? "N/A" }}
          </p>
        </template>

        <template #col-price="{ value }">
          <p class="text-main m-0 fw-bold">US ${{ value }}</p>
        </template>
      </BaseTable>

      <BasePagination
        v-if="own.pagination.last_page && own.pagination.last_page > 1"
        v-bind="own.pagination"
        :class="{ 'd-none': own.loading }"
        @changePage="handleChangePage"
      />

      <!-- Create Modal / Edit Modal -->
      <BaseModal
        v-if="showModal"
        @close-modal="closeModal()"
        position="justify-content-center"
      >
        <template #header>
          <h1 class="modal-title fs-4 mx-auto fw-bold">
            Delete Item #{{ items.id }}
          </h1>
        </template>
        <template #body>
          <img
            :src="items.image"
            alt=""
            width="150"
            height="110"
            class="rounded-4 object-fit-cover mx-auto d-block mb-5"
          />
          <p class="text-center m-0" style="font-size: 18px">
            Are you sure you want to delete {{ items.title }} ?
          </p>
        </template>
        <template #footer>
          <button
            type="button"
            class="btn btn-secondary rounded-pill px-6 py-2"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="btn btn-danger px-6 rounded-pill py-2"
            @click="handleAction"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Delete
          </button>
        </template>
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue";
import { useOwnProductStore } from "@/stores/OwnProduct";
import BaseTable from "@/components/BaseTable.vue";
import BasePagination from "@/components/BasePagination.vue";
import StatsCardSkeleton from "@/components/StatsCardSkeleton.vue";
import { onMounted, ref } from "vue";
import api from "@/api/https";
import { useRouter } from "vue-router";
// import noImage from "@/assets/img/no-image.jpeg";
import { useToast } from "vue-toastification";
import { useOrderStore } from "@/stores/order";
let toast = useToast();

let order = useOrderStore();

const own = useOwnProductStore();
let columns = [
  { label: "Image", key: "image" },
  { label: "Title", key: "title" },
  { label: "Price", key: "price" },
  { label: "Category", key: "categories" },
];
let showModal = ref(false);
let loading = ref(false);
let items = ref([]);
const router = useRouter();
let per_page = ref(2);

async function handleAction() {
  loading.value = true;
  try {
    await api.delete(`/api/products/${items.value.id}`);
    toast.success("Delete Successfully!");
  } catch (err) {
    console.log(err);
  } finally {
    showModal.value = false;
    loading.value = false;
    own.fetchMyOwnProduct();
  }
}

const closeModal = () => {
  if (loading.value) return;
  showModal.value = false;
};

const handleChangePage = (page) => {
  own.fetchMyOwnProduct(page, per_page.value);
};

const handleDelete = (row) => {
  showModal.value = true;
  items.value = row;
};

const handleEdit = (row) => {
  router.push(`/dashboard/editProduct/${row.id}`);
};

const goCreateProduct = () => {
  router.push("/dashboard/createProduct");
};

// const NO_IMAGE_URL = noImage;

// const handleImageError = (event) => {
//   event.target.src = NO_IMAGE_URL;
// };

onMounted(() => {
  own.fetchMyOwnProduct(1, per_page.value);
  order.fetchOrder();
});
</script>

<style scoped>
.bar {
  background-color: #6c757d;
}
.icon-box-title {
  background: #f0fff4;
  padding: 12px;
  border-radius: 14px;
}

.stats-card {
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.stat-icon {
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
