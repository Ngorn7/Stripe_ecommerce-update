<template>
  <div class="container-fluid py-4 bg-white rounded-5 px-4 shadow-sm">
    <div class="d-flex align-items-center justify-content-between mb-5">
      <div class="d-flex align-items-center gap-3">
        <div class="p-3 bg-icon rounded-4">
          <ListTodo class="text-main" :size="28" />
        </div>
        <div>
          <h3 class="fw-bold mb-0">Order Actions</h3>
          <p class="text-muted mb-0 small">
            Pending Approval: {{ order.pendingOrders.length }}
          </p>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <div v-if="order.loading" class="text-center py-5">
        <div class="loader mx-auto">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <p class="mt-3 text-muted small">Fetching pending data...</p>
      </div>

      <table v-else class="table table-hover align-middle">
        <thead class="bg-light">
          <tr>
            <th class="border-0 ps-4">Product Info</th>
            <th class="border-0">Buyer</th>
            <th class="border-0 text-center">Amount Info</th>
            <th class="border-0 text-center">Payment Proof</th>
            <th class="border-0 text-center">Status</th>
            <th class="border-0 text-center ps-12">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in order.pendingOrders"
            :key="item.id"
            class="border-bottom"
          >
            <td class="ps-4 py-3">
              <div class="d-flex align-items-center gap-3">
                <img
                  :src="item.product?.image"
                  class="rounded-3 shadow-sm"
                  width="50"
                  height="50"
                  style="object-fit: cover"
                />
                <div>
                  <div class="fw-bold text-dark">{{ item.product?.title }}</div>
                  <small class="text-muted">ID: #{{ item.id }}</small>
                </div>
              </div>
            </td>

            <td>
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="item.buyer?.avatar"
                  class="rounded-circle"
                  width="30"
                  height="30"
                />
                <div class="small fw-semibold">{{ item.buyer?.name }}</div>
              </div>
            </td>

            <td class="text-center">
              <div class="fw-bold text-main">
                Total: US ${{ (item.price * item.qty).toLocaleString() }}
              </div>
              <div class="text-muted extra-small">
                US ${{ item.price }} | Qty {{ item.qty }}
              </div>
            </td>

            <td class="text-center">
              <div v-if="item.transaction_file">
                <a
                  :href="item.transaction_file"
                  target="_blank"
                  class="btn btn-sm btn-light border rounded-pill px-3"
                >
                  <FileText :size="14" class="me-1" /> View Receipt
                </a>
              </div>
              <div v-else class="text-danger small fw-bold">
                <AlertCircle :size="15" /> No File
              </div>
            </td>

            <td class="text-center">
              <span
                class="badge rounded-pill px-3 py-2 fw-medium bg-cate-warning"
                >Pending</span
              >
            </td>

            <td class="pe-4 text-end">
              <div class="d-flex justify-content-end gap-3">
                <button
                  @click="openModal(item, 'approve')"
                  class="btn text-main border-0"
                  :disabled="!item.transaction_file"
                >
                  <circle-check size="35" />
                </button>
                <button
                  @click="openModal(item, 'reject')"
                  class="btn text-danger border-0"
                >
                  <circle-x size="35" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="order.pendingOrders.length === 0 && !order.loading">
            <td colspan="6" class="text-center py-5 text-muted">
              All caught up! No pending orders.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal
      v-if="showModal"
      @closeModal="closeModal"
      position="justify-content-center"
    >
      <template #header>
        <h1 class="modal-title fs-4 mx-auto fw-bold">
          {{ modalTitle }} #{{ selectedOrder.id }}
        </h1>
      </template>
      <template #body>
        <img
          :src="selectedOrder.product.image"
          alt=""
          width="150"
          height="110"
          class="rounded-4 object-fit-cover mx-auto d-block mb-5"
        />
        <p class="text-center m-0" style="font-size: 18px">
          {{ modalBody }}
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
          :class="`btn ${color} px-6 rounded-pill py-2 border-0 text-white`"
          :disabled="loading"
          @click="handleAction"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2 text-white"
          ></span>
          {{ modalFooter }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useOrderStore } from "@/stores/order";
import BaseModal from "@/components/BaseModal.vue";
import { useToast } from "vue-toastification";
let toast = useToast();
const order = useOrderStore();
const showModal = ref(false);
const selectedOrder = ref(null);
let modalTitle = ref("");
let modalBody = ref("");
let modalFooter = ref("");
let color = ref("");
let loading = ref(false);
let actionType = ref("");
onMounted(() => {
  order.fetchOrder();
});

const closeModal = () => {
  if (loading.value) return;
  showModal.value = false;
};

const openModal = (item, status) => {
  showModal.value = true;
  selectedOrder.value = item;
  actionType.value = status;
  if (status == "reject") {
    modalTitle.value = "Reject Order";
    modalBody.value = "Are you sure you want to reject this order ?";
    modalFooter.value = "Reject";
    color.value = "btn-danger";
  } else {
    modalTitle.value = "Approve Order";
    modalBody.value = "Are you sure you want to approve this order ?";
    modalFooter.value = "Approve";
    color.value = "bg-btn";
  }
};

async function handleAction() {
  loading.value = true;
  try {
    await order.changeStatus(selectedOrder.value.id, actionType.value);

    if (actionType.value === "approve") {
      toast.success("Approved Successfully!");
    } else {
      toast.error("Rejected Successfully!");
    }
  } catch (err) {
    console.log(err);
  } finally {
    showModal.value = false;
    loading.value = false;
  }
}
</script>

<style scoped>
.extra-small {
  font-size: 0.75rem;
}

.table thead th {
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  color: #6c757d;
  padding: 15px 10px;
  text-transform: uppercase;
}

.bar {
  background-color: #6c757d !important;
}
</style>
