<script setup>
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/order';
import { useProfileStore } from '@/stores/profile';
import { ShoppingBag } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';
const profile = useProfileStore();
const cart = useCartStore();
const order = useOrderStore();

onMounted(async () => {
    await profile.fetchMyProfile();
    await cart.fetchMyCart();
    await order.fetchMyOrder(1,100);
});

const latestTimestamp = computed(() => {
    if (!order.myOrder.length) return null;
    return order.myOrder.reduce((latest, item) =>
        item.created_at > latest ? item.created_at : latest,
        order.myOrder[0].created_at
    );
});

const latestOrderItems = computed(() =>
    order.myOrder.filter(item => item.created_at === latestTimestamp.value)
);

const grandTotal = computed(() =>
    latestOrderItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value ?? 0);
}

</script>

<template>
    <div class="d-flex justify-content-center mt-7">
        <div class="w-100" style="max-width: 720px;">
            <div class="bg-white rounded-4 overflow-hidden shadow">

                <!-- Header -->
                <div class="receipt-header d-flex justify-content-between align-items-center px-4 py-4">
                    <div>
                        <div class="fs-4 fw-bold text-white">
                            <img src="../../assets/img/logo vue2.png" width="180px" class="ms-n5" alt="">
                        </div>
                        <!-- <div class="text-white opacity-75 mt-n3">Thank you for your purchase!</div> -->
                    </div>
                    <div class="text-end">
                        <div class="text-white fw-bold text-uppercase ls-wide">Receipt</div>
                        <!-- <div class="text-white opacity-75 small mt-1">Order ID: #{{}}</div> -->
                        <div class="text-white opacity-75 small"> {{ formatDate(latestTimestamp) }}</div>
                        <div class="mt-2">
                            <span class="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2"
                                style="background: rgba(255,255,255,0.2); color: white; font-size: 0.75rem;">
                                <span class="rounded-circle bg-white d-inline-block"
                                    style="width:7px;height:7px;"></span>
                                Paid
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Body -->
                <div class="px-4 py-4">

                    <!-- Billed / Shipped -->
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="text-uppercase fw-bold small mb-2"
                                style="font-size: 0.65rem; letter-spacing: 0.1em;">
                                Billed To
                            </div>
                            <div class="fw-bold text-dark">{{ profile.myProfile?.name ?? "N/A" }}</div>
                            <div class="text-muted small lh-lg">
                                {{ profile.myProfile?.email ?? "N/A" }}
                            </div>
                        </div>
                        <div class="col-6 text-end">
                            <div class="text-uppercase fw-bold small mb-2"
                                style=" font-size: 0.65rem; letter-spacing: 0.1em;">
                                Shipped To
                            </div>
                            <!-- <div class="fw-bold text-dark">{{ latestOrderItems[0]?.buyer?.name ?? "N/A" }}</div> -->
                            <div class="text-muted small lh-lg">
                                {{ latestOrderItems[0]?.address ?? "N/A" }}<br>{{ profile.myProfile?.phone ?? "N/A" }}
                            </div>
                        </div>
                    </div>

                    <hr class="dashed-hr my-4">

                    <!-- Items Table -->
                    <table class="table table-borderless mb-4">
                        <thead class="rounded">
                            <tr>
                                <th class="rounded-start ps-3">Item</th>
                                <th class="text-center">Qty</th>
                                <th class="text-end">Unit Price</th>
                                <th class="text-end rounded-end pe-3">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="order.loading">
                                <td colspan="4" class="text-center text-muted py-4">
                                    <div class="spinner-border spinner-border-sm text-success me-2"></div>
                                    Loading items...
                                </td>
                            </tr>
                            <tr v-else-if="latestOrderItems.length === 0">
                                <td colspan="4" class="text-center text-muted py-4">No orders found.</td>
                            </tr>
                            <tr v-else v-for="item in latestOrderItems" :key="item.id">
                                <td class="ps-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <img :src="item.product.image" width="40" height="40"
                                            class="rounded-2 object-fit-cover" alt="">
                                        <div>
                                            <div class="fw-semibold">{{ item.product.title }}</div>
                                            <div class="text-muted" style="font-size: 0.75rem;">
                                                {{ item.product.categories?.[0]?.name ?? "—" }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center align-middle">{{ item.qty }}</td>
                                <td class="text-end align-middle">{{ formatCurrency(item.price) }}</td>
                                <td class="text-end align-middle fw-semibold pe-3">
                                    {{ formatCurrency(item.qty * item.price) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Totals -->
                    <div class="row justify-content-end">
                        <div class="col-md-6">
                            <div class="rounded-3 p-3"
                                style="background:  #f6fffb;; border: 1.5px solid rgba(66,184,131,0.2);">
                                <div class="d-flex justify-content-between text-muted small mb-2">
                                    <span>Subtotal</span>
                                    <span>{{ formatCurrency(grandTotal) }}</span>
                                </div>
                                <div class="d-flex justify-content-between text-muted small mb-2">
                                    <span>Shipping</span>
                                    <span>{{ latestOrderItems[0]?.is_delivery === 2 ? '$2.00' : 'Free' }}</span>
                                </div>
                                <hr style="border-color: rgba(66,184,131,0.2);">
                                <div class="d-flex justify-content-between fw-bold">
                                    <span class="text-dark">Total Paid</span>
                                    <span class="text-main">
                                        {{ formatCurrency(grandTotal + (latestOrderItems[0]?.is_delivery === 2 ? 2 : 0))}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="d-flex justify-content-center gap-3 mt-4 no-print">
                        <button onclick="window.print()" class="btn bg-btn rounded-pill px-4 py-2 fw-semibold">
                            <download class="fa-solid fa-print me-2" />Download Receipt
                        </button>
                        <router-link to="/shopping" class="btn btn-outline-success rounded-pill px-4 py-2 fw-semibold">
                            <ShoppingBag class="fa-solid fa-arrow-left me-2" />Continue Shopping
                        </router-link>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.receipt-header {
    background-color: #42b883;
    position: relative;
    overflow: hidden;
}

.receipt-header::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.receipt-header::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: 30%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
}

.dashed-hr {
    border-top: 2px dashed #39de4c;
}

.table thead th {
    background-color: #ecfdf5;
    color: #2d8a63;
    border: none;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.btn-outline-success:hover {
    background-color: #42b883 !important;
    border: none;
}

.table tbody tr td {
    vertical-align: middle;
    font-size: 0.88rem;
}

.table tbody tr:hover td {
    background-color: #f6fffb;
}

@media print {
    body * {
        visibility: hidden;
    }

    .receipt-print,
    .receipt-print * {
        visibility: visible;
    }

    .receipt-print {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .no-print {
        display: none !important;
    }
}
</style>