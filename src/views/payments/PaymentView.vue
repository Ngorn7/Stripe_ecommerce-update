<template>
  <form @submit.prevent="saveCheckout">
    <div class="container-lg py-5 px-3 px-md-4">
      <div v-if="loading" class="full-loader">
        <div class="loader">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
      <div class="row g-4 g-lg-5">
        <!-- left -->
        <div class="col-lg-7">
          <!-- FileTransaction -->
          <div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="text-main">Transaction File</h5>
              <Transition name="badge-pop">
                <span
                  v-if="justUploaded"
                  class="d-inline-flex align-items-center gap-1 px-2 rounded-pill fw-medium bg-btn"
                  style="font-size: 0.8rem"
                >
                  <circle-check size="15" /> File attached
                </span>
              </Transition>
            </div>

            <!-- File row / empty state -->
            <Transition name="swap" mode="out-in">
              <!-- Has file -->
              <div
                v-if="txn.transaction_file"
                key="file-row"
                class="d-flex align-items-center gap-3 p-3 rounded-3 mb-2 shadow-sm file-card"
                :class="justUploaded ? 'file-success' : ''"
              >
                <div
                  class="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                >
                  <file-image
                    :class="['text-main']"
                    :style="{
                      fontSize: '1.25rem',
                      color: justUploaded ? 'var(--pickup)' : 'var(--accent)',
                    }"
                  />
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="fw-bold text-truncate">
                    {{ txn.transaction_file }}
                  </div>
                  <div class="text-muted mt-1">{{ txn.file_size }}</div>
                </div>
                <div class="d-flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    class="d-flex align-items-center justify-content-center rounded-2 action-btn text-main"
                    title="Preview"
                    :disabled="!fileUrl"
                    @click="previewFile"
                  >
                    <eye />
                  </button>
                  <!-- <button
                                    class="d-flex align-items-center justify-content-center rounded-2 action-btn text-main"
                                    title="Download" :disabled="!fileUrl" @click="downloadFile">
                                    <i class="bi bi-download"></i>
                                </button> -->
                </div>
              </div>

              <!-- Empty -->
              <div
                v-else
                key="empty-row"
                class="d-flex align-items-center gap-3 p-3 rounded-3 mb-2 map-empty"
              >
                <file-plus class="text-muted" />
                <span class="text-muted">No file attached yet</span>
              </div>
            </Transition>

            <!-- Upload zone -->
            <label
              class="d-flex align-items-center justify-content-center rounded-3 p-3 w-100 upload-zone"
              :class="{ dragover: dragging }"
              @dragover.prevent="dragging = true"
              @dragleave="dragging = false"
              @drop.prevent="onDrop"
            >
              <div class="d-flex align-items-center gap-3">
                <cloud-upload
                  class="upload-icon"
                  style="font-size: 1.5rem; transition: color 0.2s"
                />
                <div class="d-flex flex-column gap-1">
                  <span
                    class="fw-bold"
                    style="font-size: 0.85rem; color: var(--ink)"
                  >
                    {{
                      txn.transaction_file ? "Replace file" : "Attach file"
                    }}</span
                  >
                  <span class="text-muted" style="font-size: 0.68rem"
                    >drag & drop or click to browse</span
                  >
                </div>
              </div>
              <input type="file" class="d-none" @change="onFileChange" />
            </label>
            <span
              v-if="err.transaction_file"
              class="text-danger d-block mt-1"
              style="font-size: 0.8rem"
            >
              {{ err.transaction_file }}
            </span>
          </div>

          <!-- Pick Up / Delivery toggle -->
          <div class="d-flex align-items-center gap-3 my-4">
            <div class="flex-grow-1"></div>
            <span class="text-uppercase text-main fw-semibold"></span>
            <div class="flex-grow-1"></div>
          </div>

          <div>
            <h5 class="text-main">Logistics Consultation</h5>
            <div class="row g-3 mb-4">
              <div class="col-6">
                <button
                  type="button"
                  class="method-card w-100 d-flex align-items-center gap-3 p-3 rounded-3 text-start shadow-sm"
                  :class="{ 'bg-btn text-white': txn.is_delivery === 1 }"
                  @click="switchMethod(1)"
                >
                  <div
                    class="method-icon d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  >
                    <shopping-bag class="text-main" />
                  </div>
                  <div class="flex-grow-1">
                    <span
                      class="d-block fw-bold"
                      :style="{
                        color: txn.is_delivery === 1 ? '#ffffff' : '#42b883',
                      }"
                      >Pick Up</span
                    >
                    <span
                      class="d-block"
                      :style="{
                        color: txn.is_delivery === 1 ? '#ffffff' : 'gray',
                      }"
                      >Customer collects order</span
                    >
                  </div>
                  <div
                    v-if="txn.is_delivery === 1"
                    class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 check-circle"
                  >
                    <check />
                  </div>
                </button>
              </div>

              <div class="col-6">
                <button
                  type="button"
                  class="method-card w-100 d-flex align-items-center gap-3 p-3 rounded-3 text-start shadow-sm"
                  :class="{ 'bg-btn text-white': txn.is_delivery === 2 }"
                  @click="switchMethod(2)"
                >
                  <div
                    class="method-icon d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  >
                    <truck class="text-main" />
                  </div>
                  <div class="flex-grow-1">
                    <span
                      class="d-block fw-bold"
                      :style="{
                        color: txn.is_delivery === 2 ? '#ffffff' : '#42b883',
                      }"
                      >Delivery</span
                    >
                    <span
                      class="d-block"
                      :style="{
                        color: txn.is_delivery === 2 ? '#ffffff' : 'gray',
                      }"
                      >Ship to address</span
                    >
                  </div>
                  <div
                    v-if="txn.is_delivery === 2"
                    class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 check-circle"
                  >
                    <check />
                  </div>
                </button>
              </div>
            </div>

            <span
              v-if="err.is_delivery"
              class="text-danger d-block mt-1"
              style="font-size: 0.8rem"
            >
              {{ err.is_delivery }}
            </span>

            <!-- Location field -->
            <Transition name="slide-fade">
              <div v-if="txn.is_delivery">
                <div
                  class="d-flex align-items-center justify-content-between mb-2"
                >
                  <span class="text-uppercase text-muted fw-semibold">
                    {{
                      txn.is_delivery === 1
                        ? "Pick-up Location"
                        : "Delivery Address"
                    }}
                  </span>
                  <Transition name="badge-pop">
                    <span
                      v-if="localPlace"
                      class="d-inline-flex align-items-center gap-1 px-2 rounded-pill fw-medium bg-btn"
                      style="font-size: 0.8rem"
                    >
                      <circle-check size="15" /> Saved
                    </span>
                  </Transition>
                </div>

                <!-- Location card -->
                <div
                  class="rounded-3 p-3 location-card shadow-sm"
                  :class="{ 'card-filled': localPlace && !isEditing }"
                >
                  <template v-if="localPlace && !isEditing">
                    <div class="d-flex align-items-center gap-3">
                      <Map class="flex-shrink-0" />
                      <div class="flex-grow-1 overflow-hidden">
                        <span
                          class="d-block fw-medium text-truncate"
                          style="font-size: 0.82rem"
                          >{{ localPlace }}</span
                        >
                        <span
                          class="d-block text-main"
                          style="font-size: 0.62rem"
                          >Tap Edit to change · Opens in Google Maps</span
                        >
                      </div>
                      <a
                        :href="computedMapUrl"
                        target="_blank"
                        rel="noopener"
                        class="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 text-decoration-none icon-btn text-main"
                        @click.stop
                      >
                        <square-arrow-up-right />
                      </a>
                      <button
                        type="button"
                        class="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 icon-btn text-main"
                        @click="isEditing = true"
                        title="Edit"
                      >
                        <pencil />
                      </button>
                    </div>
                  </template>

                  <!-- Input view -->
                  <template v-else>
                    <!-- Card inner label -->
                    <div
                      class="d-flex align-items-center gap-2 mb-2 text-uppercase fw-semibold text-main location-label"
                    >
                      <Map />
                      <span>Location on Map</span>
                    </div>

                    <div class="position-relative">
                      <search
                        class="position-absolute top-50 translate-middle-y text-muted"
                        style="
                          left: 13px;
                          font-size: 0.82rem;
                          pointer-events: none;
                        "
                        size="15"
                      />
                      <input
                        class="form-control search-input themed-input pe-5"
                        :class="{ 'input-filled': localPlace }"
                        type="text"
                        v-model="localPlace"
                        @input="onInput"
                        @keydown.enter="confirmPlace"
                        :placeholder="
                          txn.is_delivery === 1
                            ? 'Branch name or address\u2026'
                            : 'Delivery address or place name\u2026'
                        "
                        @blur="confirmPlace"
                      />
                      <button
                        type="button"
                        v-if="localPlace"
                        class="position-absolute top-50 end-0 translate-middle-y me-2 d-flex align-items-center justify-content-center rounded-2 bg-transparent btn text-main border-0"
                        @click="clearPlace"
                        title="Clear"
                      >
                        <square-x />
                      </button>
                      <!-- <span v-if="err.address" class="text-danger d-block mt-1"
                                                style="font-size: 0.8rem">
                                                {{ err.address }}
                                            </span> -->
                    </div>

                    <div class="d-flex align-items-start gap-2 mt-2">
                      <info class="flex-shrink-0 mt-1" size="16" />
                      <span class="text-muted mt-1" style="font-size: 0.8rem">
                        Type a place name or address — the map preview on the
                        right will update automatically
                      </span>
                    </div>
                  </template>
                </div>
                <span
                  v-if="err.address || err.google_map_url"
                  class="text-danger d-block mt-1"
                  style="font-size: 0.8rem"
                >
                  {{ err.address }} {{ err.google_map_url }}
                </span>
                <!-- <span v-if="err.google_map_url" class="text-danger d-block mt-1"
                                    style="font-size: 0.8rem">
                                    {{ err.google_map_url }}
                                </span> -->
              </div>
            </Transition>
          </div>
        </div>
        <!-- RIGHT -->
        <div class="col-lg-5">
          <!-- QR -->
          <div>
            <h5 class="text-main">Payment QR Code</h5>
            <div class="rounded-3 overflow-hidden border-main">
              <!-- Dark header -->
              <div
                class="d-flex align-items-end justify-content-between px-4 py-3 bg-btn"
              >
                <div class="d-flex flex-column gap-1">
                  <span class="text-uppercase fw-semibold text-white"
                    >Amount Due</span
                  >
                  <span
                    class="fw-black text-white"
                    style="font-size: 1.8rem; line-height: 1"
                  >
                    {{ formatCurrency(txn.amount) }}</span
                  >
                </div>
                <div class="text-end text-white">
                  <span class="d-block text-uppercase fw-semibold">Ref</span>
                  <span class="d-block fw-medium"> {{ txn.id }}</span>
                </div>
              </div>

              <!-- Body -->
              <div class="d-flex justify-content-center align-items-center p-4">
                <div
                  class="d-flex justify-content-center align-items-center w-75"
                >
                  <img
                    src="https://qrcg-free-editor.qr-code-generator.com/latest/assets/images/websiteQRCode_noFrame.png"
                    class="img-thumbnail"
                    alt=""
                  />
                </div>
              </div>

              <div class="text-center">
                <span
                  class="text-uppercase fw-semibold text-main"
                  style="font-size: 0.65rem; letter-spacing: 0.1em"
                >
                  Scan to pay · {{ txn.id }}
                </span>
              </div>

              <div class="w-100">
                <div
                  class="d-flex align-items-center justify-content-between mb-2"
                >
                  <Transition name="badge-pop">
                    <span
                      v-if="txn.amount > 0"
                      class="d-inline-flex align-items-center gap-1 px-2 rounded-pill fw-medium bg-btn"
                      style="font-size: 0.8rem"
                    >
                      <!-- <circle-check size="15" /> Filled -->
                    </span>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

          <!-- Stripe card payment (added) -->
          <div class="mt-5">
            <h5 class="text-main">Or Pay by Card</h5>
            <div class="rounded-3 overflow-hidden border-main">
              <div class="d-flex align-items-end justify-content-between px-4 py-3 bg-btn">
                <div class="d-flex flex-column gap-1">
                  <span class="text-uppercase fw-semibold text-white">Amount Due</span>
                  <span class="fw-black text-white" style="font-size: 1.8rem; line-height: 1">
                    {{ formatCurrency(txn.amount) }}</span
                  >
                </div>
                <div class="text-end text-white">
                  <span class="d-block text-uppercase fw-semibold">Stripe</span>
                  <span class="d-block fw-medium">Secure card payment</span>
                </div>
              </div>
              <div class="p-4">
                <div ref="cardElementRef" class="stripe-card"></div>
                <span v-if="cardError" class="text-danger d-block mt-2" style="font-size: 0.8rem">
                  {{ cardError }}
                </span>
                <span class="text-muted d-block mt-2" style="font-size: 0.7rem">
                  Test card: 4242 4242 4242 4242 · any future date · any CVC.
                  Location above is still required; no transaction file needed.
                </span>
                <div class="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    class="btn bg-btn d-flex align-items-center gap-2 fw-medium px-4 py-2 rounded-5"
                    :disabled="loading"
                    @click="saveStripeCheckout"
                  >
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm me-2 text-white"
                    ></span>
                    <span class="text-white">{{ loading ? "Processing..." : "Pay by Card" }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Map -->
          <div class="mt-5">
            <h5 class="text-main">Map Preview</h5>
            <div class="rounded-3 overflow-hidden map-card">
              <div class="position-relative map-frame">
                <Transition name="map-fade" mode="out-in">
                  <!-- Live map iframe -->
                  <iframe
                    v-if="debouncedPlace"
                    :key="debouncedPlace"
                    :src="embedUrl"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    class="position-absolute top-0 start-0 w-100 h-100 border-0 rounded-3"
                  >
                  </iframe>

                  <!-- Typing state -->
                  <div
                    v-else-if="isTyping"
                    key="typing"
                    class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3"
                  >
                    <div class="d-flex gap-2">
                      <span class="typing-dot rounded-circle"></span>
                      <span class="typing-dot rounded-circle"></span>
                      <span class="typing-dot rounded-circle"></span>
                    </div>
                    <div class="text-center">
                      <p class="fw-bold mb-1" style="font-size: 0.88rem">
                        Looking up location…
                      </p>
                      <p class="text-muted mb-0" style="font-size: 0.68rem">
                        Map will appear when you stop typing
                      </p>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div
                    v-else
                    key="empty"
                    class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3 px-4"
                  >
                    <Map />
                    <div class="text-center">
                      <p class="fw-bold mb-1">No location yet</p>
                      <p
                        class="text-muted mb-0 lh-base"
                        style="font-size: 0.68rem"
                      >
                        Type a place name in the field on the left<br />and the
                        map will update here automatically
                      </p>
                    </div>
                  </div>
                </Transition>

                <!-- Footer -->
                <div
                  class="d-flex align-items-center gap-2 px-3 py-2 map-footer"
                >
                  <map-pin class="flex-shrink-0" style="font-size: 0.9rem" />
                  <div class="flex-grow-1 overflow-hidden">
                    <span
                      class="d-block text-truncate"
                      style="font-size: 0.7rem; color: var(--ink)"
                    >
                      {{ debouncedPlace || placeName || "No location set" }}
                    </span>
                    <span
                      v-if="!debouncedPlace && !placeName"
                      class="d-block text-muted"
                      style="font-size: 0.62rem"
                    >
                      Enter a location above to enable map
                    </span>
                  </div>
                  <a
                    v-if="computedMap"
                    :href="computedMap"
                    target="_blank"
                    rel="noopener"
                    class="z-3 d-flex align-items-center gap-1 flex-shrink-0 px-3 py-1 rounded-2 fw-medium text-decoration-none bg-btn"
                    style="font-size: 0.7rem"
                  >
                    <square-arrow-up-right size="16" /> Open
                  </a>
                </div>
              </div>

              <!-- Helper note below card -->
            </div>
            <div class="d-flex align-items-start gap-2 mt-2 ms-4">
              <info
                class="flex-shrink-0 mt-1"
                style="font-size: 0.72rem"
                size="18"
              />
              <span
                class="text-muted mt-1"
                style="font-size: 0.669rem; line-height: 1.5"
              >
                Map updates automatically 0.8 s after you stop typing a location
                name
              </span>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button
                type="submit"
                class="btn bg-btn d-flex align-items-center gap-2 fw-medium px-4 py-2 rounded-5"
              >
                <span
                  class="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                >
                  <check class="bi bi-check-lg" />
                </span>
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2 text-white"
                ></span>
                <span class="text-white">{{
                  loading ? "Checking..." : "Checkout"
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script setup>
import api from "@/api/https";
import { useCartStore } from "@/stores/cart";
import { notify } from "@/utils/toast";
import {
  checkContent,
  checkFileSize,
  validates,
  require,
} from "@/utils/validate";
import { ref, computed, onUnmounted, watch, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { nextTick } from "vue";
import { loadStripe } from "@stripe/stripe-js";

const cartStore = useCartStore();

const txn = ref({
  id: "TXN-" + Date.now(),
  createdAt: new Date().toLocaleDateString("kh-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  transaction_file: "",
  file_size: "",
  file_object: null,
  is_delivery: 1,
  address: "",
  amount: 0,
  google_map_url: "",
});

// FileTransaction
const dragging = ref(false);
const justUploaded = ref(false);
let blobUrl = null;

watch(
  () => txn.value.file_object,
  (newFile) => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }
    if (newFile) blobUrl = URL.createObjectURL(newFile);
  },
  { immediate: true },
);

// keep amount
onMounted(async () => {
  await cartStore.fetchMyCart();
  txn.value.amount = cartStore.total;
});

watch(
  () => cartStore.total,
  (val) => {
    txn.value.amount = val;
  },
  { immediate: true },
);

const fileUrl = computed(() => blobUrl);

//it cleans up the temporary URL and prevents memory leaks.
onUnmounted(() => {
  if (blobUrl) URL.revokeObjectURL(blobUrl);
});

// const fileIcon = computed(() => {
//     const f = (txn.value.transaction_file || "").toLowerCase();
//     if (f.endsWith(".pdf")) {
//         return "bi bi-file-earmark-pdf-fill";
//     }
//     if (f.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
//         return "bi bi-file-earmark-image-fill";
//     }
//     if (f.match(/\.(xlsx|xls|csv)$/)) {
//         return "bi bi-file-earmark-spreadsheet-fill";
//     }
//     if (f.match(/\.(docx|doc)$/)) {
//         return "bi bi-file-earmark-word-fill";
//     }
//     return "bi bi-file-earmark-fill";
// });

const previewFile = () => {
  if (fileUrl.value) window.open(fileUrl.value, "_blank");
};

// const downloadFile = () => {
//     if (!fileUrl.value) return;
//     const a = document.createElement("a");
//     a.href = fileUrl.value;
//     a.click();
// };

const parseFile = (file) => {
  if (!file) return;
  dragging.value = false;
  const ext = file.name.split(".").pop()?.toUpperCase() || "";

  txn.value.transaction_file = file.name;
  txn.value.file_size = `${(file.size / 1024).toFixed(0)} KB · ${ext}`;
  txn.value.file_object = file;
  // err.value.transaction_file = "";

  justUploaded.value = true;
  setTimeout(() => (justUploaded.value = false), 3000);
};
const onFileChange = (e) => parseFile(e.target.files[0]);
const onDrop = (e) => parseFile(e.dataTransfer.files[0]);

// Pickup / Delivery
const localPlace = ref("");
const isEditing = ref(true);

const computedMapUrl = computed(() =>
  localPlace.value.trim()
    ? `https://www.google.com/maps/search/${encodeURIComponent(localPlace.value.trim())}`
    : "",
);

const onInput = () => {
  const val = localPlace.value.trim();

  txn.value.address = val;
  txn.value.google_map_url = val
    ? `https://maps.google.com/maps?q=${encodeURIComponent(val)}`
    : "";
  // err.value.address = "";
};

const confirmPlace = () => {
  if (localPlace.value.trim()) isEditing.value = false;
};

const clearPlace = () => {
  localPlace.value = "";
  isEditing.value = true;

  // update local txn state directly
  txn.value.address = "";
  txn.value.google_map_url = "";

  // also reset map preview
  debouncedPlace.value = "";
  isTyping.value = false;
};

const switchMethod = (val) => {
  txn.value.is_delivery = val;
  localPlace.value = "";
  isEditing.value = true;
  txn.value.address = "";
  // err.value.is_delivery = "";
  txn.value.google_map_url = "";
};

// QR
const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    val || 0,
  );

//Map
const placeName = computed(() => {
  const url = txn.value.google_map_url || "";
  if (!url) return "";
  const m = url.match(/maps\/search\/([^?#]+)/);
  if (m) return decodeURIComponent(m[1]);
  const q = url.match(/[?&]q=([^&]+)/);
  if (q) return decodeURIComponent(q[1]);
  return "";
});

const debouncedPlace = ref("");
const isTyping = ref(false);
let timer = null;

watch(
  localPlace,
  (val) => {
    clearTimeout(timer);

    if (!val || !val.trim()) {
      isTyping.value = false;
      debouncedPlace.value = "";
      return;
    }

    isTyping.value = true;

    timer = setTimeout(() => {
      debouncedPlace.value = val.trim();
      isTyping.value = false;
    }, 800);
  },
  { immediate: true },
);

const computedMap = computed(() =>
  debouncedPlace.value
    ? `https://www.google.com/maps/search/${encodeURIComponent(debouncedPlace.value)}`
    : "",
);
const embedUrl = computed(() =>
  debouncedPlace.value
    ? `https://maps.google.com/maps?q=${encodeURIComponent(debouncedPlace.value)}&output=embed`
    : "",
);

// Add to onUnmounted
onUnmounted(() => {
  if (blobUrl) URL.revokeObjectURL(blobUrl);
  clearTimeout(timer);
});

const err = reactive({
  transaction_file: "",
  is_delivery: "",
  address: "",
  google_map_url: "",
});

function validate() {
  err.transaction_file = validates(txn.value.file_object, [
    (v) => require(v, "Transaction file is required."),
    (v) => checkFileSize(v),
  ]);

  err.is_delivery = require(txn.value
    .is_delivery, "Please select Pick Up or Delivery.");

  const addressMsg =
    txn.value.is_delivery === 1
      ? "Please enter a pick-up location."
      : "Please enter a delivery address.";

  err.address = validates(txn.value.address, [
    (v) => require(v, addressMsg),
    (v) => checkContent(v, "Location is too short, please be more specific."),
  ]);

  err.google_map_url = require(txn.value
    .google_map_url, "Map URL is missing, please re-enter your location.");

  return (
    !err.transaction_file &&
    !err.address &&
    !err.google_map_url &&
    !err.is_delivery
  );
}

let router = useRouter();
let toast = notify(router);
let loading = ref(false);

const saveCheckout = async () => {
  if (!validate()) return;
  loading.value = true;
  try {
    const { file_object, transaction_file, ...payload } = txn.value;

    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      form.append(key, value ?? "");
    });

    if (file_object) {
      form.append("transaction_file", file_object);
    }

    const res = await api.post("/api/carts/checkout", form);
    console.log("Success:", res.data);
    await cartStore.fetchMyCart();
    toast.success("Checkout Successfully!", "/receipt");
  } catch (err) {
    console.error(err);
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
};

// ---------------- Stripe card payment (added) ----------------
const cardElementRef = ref(null);
const cardError = ref("");
const cardComplete = ref(false);
let stripe = null;
let cardElement = null;

onMounted(async () => {
  await nextTick();
  const key = import.meta.env.VITE_STRIPE_KEY;
  if (!key) {
    cardError.value = "Stripe key missing: set VITE_STRIPE_KEY in .env";
    return;
  }
  stripe = await loadStripe(key);
  if (!stripe || !cardElementRef.value) return;
  cardElement = stripe.elements().create("card", { hidePostalCode: true });
  cardElement.mount(cardElementRef.value);
  cardElement.on("change", (e) => {
    cardComplete.value = e.complete;
    cardError.value = e.error ? e.error.message : "";
  });
});

onUnmounted(() => {
  if (cardElement) cardElement.destroy();
});

// same rules as validate(), except the transaction file is not needed for cards
function validateStripe() {
  err.transaction_file = "";
  err.is_delivery = require(
    txn.value.is_delivery,
    "Please select Pick Up or Delivery.",
  );

  const addressMsg =
    txn.value.is_delivery === 1
      ? "Please enter a pick-up location."
      : "Please enter a delivery address.";

  err.address = validates(txn.value.address, [
    (v) => require(v, addressMsg),
    (v) => checkContent(v, "Location is too short, please be more specific."),
  ]);

  err.google_map_url = require(
    txn.value.google_map_url,
    "Map URL is missing, please re-enter your location.",
  );

  if (!cardComplete.value) cardError.value = "Please enter your full card details.";

  return (
    !err.address && !err.google_map_url && !err.is_delivery && cardComplete.value
  );
}

const saveStripeCheckout = async () => {
  if (!validateStripe()) return;
  if (!stripe || !cardElement) return;
  loading.value = true;
  try {
    const { file_object, transaction_file, ...payload } = txn.value;
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      form.append(key, value ?? "");
    });
    form.append("payment_method", "stripe");

    // 1) backend creates the order + Stripe PaymentIntent and returns client_secret
    const res = await api.post("/api/carts/checkout", form);
    const clientSecret = res.data.data.client_secret;

    // 2) confirm the card in the browser; the webhook marks the order as paid
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });
    if (error) throw new Error(error.message);

    await cartStore.fetchMyCart();
    toast.success("Payment Successfully!", "/receipt");
  } catch (e) {
    console.error(e);
    cardError.value = e.message;
    toast.error(e.message);
    await cartStore.fetchMyCart(); // a declined card puts the items back in the cart
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.stripe-card {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
}

.map-frame {
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
}

.border-main {
  border: 2px solid #42b883;
}

/* transaction file */
.file-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  transition: all 0.25s ease;
}

.file-card:hover {
  border-color: #42b883;
  box-shadow: 0 6px 18px rgba(66, 184, 131, 0.15);
}

.file-success {
  border: 2px solid #42b883;
  background: #f6fffb;
}

.empty-file {
  background: #f8f9fa;
  border: 1px dashed #dcdcdc;
}

.upload-zone {
  border: 2px dashed #e0e0e0;
  background: #fcfcfc;
  transition: all 0.25s ease;
  cursor: pointer;
}

.upload-zone:hover {
  border-color: #42b883;
  background: #f6fffb;
}

.upload-zone.dragover {
  border-color: #42b883;
  background: #ecfdf5;
}

.upload-icon {
  color: #42b883 !important;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e9ecef;
  background: white;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #42b883;
  color: white !important;
  border-color: #42b883;
}

/* pick up / delivery */
.method-card {
  border: 1px solid #e9ecef;
  background: #ffffff;
  transition: all 0.25s ease;
  cursor: pointer;
}

.method-card:hover {
  border-color: #42b883;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.12);
}

.method-icon {
  width: 42px;
  height: 42px;
  background: #f1fdf7;
  color: #42b883;
  font-size: 1.2rem;
}

.check-circle {
  width: 28px;
  height: 28px;
  background: #42b883;
  color: white;
}

/* map */
.location-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  transition: all 0.25s ease;
}

.location-card:hover {
  border-color: #42b883;
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.08);
}

.card-filled {
  border: 2px solid #42b883 !important;
  background: #f6fffb;
}

.themed-input {
  border: 1px solid #e0e0e0;
  padding-left: 34px !important;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.themed-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 0.15rem rgba(66, 184, 131, 0.15);
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #e9ecef;
  background: #ffffff;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  border-color: #42b883;
  color: #42b883 !important;
  background: #f6fffb;
}

/* map-preview */
.map-card {
  border: 1px solid #e9ecef;
  background: #ffffff;
  transition: all 0.25s ease;
}

.map-card:hover {
  border-color: #42b883;
  box-shadow: 0 10px 25px rgba(66, 184, 131, 0.08);
}

.map-empty {
  background: #f8fafc;
  text-align: center;
}

.map-footer {
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}
</style>
