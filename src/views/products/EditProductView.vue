<template>
  <template v-if="productStore.loading">
    <ProductUpdateSkeleton />
  </template>
  <template v-else>
    <div class="container-fluid bg-white rounded-5 p-4">
      <div v-if="loading" class="full-loader">
        <div class="loader">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="icon-box-title">
          <LayersPlus class="text-main" :size="28" />
        </div>
        <div>
          <h3 class="fw-bold mb-1">Product Update</h3>
          <p class="text-muted mb-0 small">
            Modify and save changes to your product
          </p>
        </div>
      </div>

      <div class="mt-5 px-2">
        <form @submit.prevent="submitForm">
          <div class="row gy-3 gx-5">
            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold">Title :</label>
              <BaseInput
                v-model="form.title"
                input-placeholder="Enter Title"
                input-icon="receipt-text"
              />
              <p v-if="err.title" class="text-danger m-0 mt-2">
                {{ err.title }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold">Price :</label>
              <BaseInput
                v-model="form.price"
                input-placeholder="Enter Price"
                input-icon="badge-dollar-sign"
              />
              <p v-if="err.price" class="text-danger m-0 mt-2">
                {{ err.price }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold"
                >Category :</label
              >
              <Select
                v-model="form.category_ids"
                :options="cate.category || []"
                optionLabel="name"
                optionValue="id"
                filter
                placeholder="Select Category"
                class="w-100"
              >
                <template #option="slotProps">
                  <div class="d-flex align-items-center gap-3 py-2">
                    <LayoutGrid />
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </Select>
              <p v-if="err.category" class="text-danger m-0 mt-2">
                {{ err.category }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold"
                >Condition :</label
              >
              <BaseInput
                v-model="form.condition"
                input-placeholder="Enter Condition"
                input-icon="align-center-vertical"
              />
              <p v-if="err.condition" class="text-danger m-0 mt-2">
                {{ err.condition }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold">Story :</label>
              <BaseInput
                v-model="form.story"
                input-placeholder="Enter Story"
                input-icon="book-audio"
              />
              <p v-if="err.story" class="text-danger m-0 mt-2">
                {{ err.story }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold">Detail :</label>
              <BaseInput
                v-model="form.detail"
                input-placeholder="Enter Detail"
                input-icon="list-collapse"
              />
              <p v-if="err.detail" class="text-danger m-0 mt-2">
                {{ err.detail }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold">Image :</label>
              <div
                class="transaction-wrapper p-3 bg-light rounded-4 form-card-height d-flex flex-column"
              >
                <div
                  class="file-status rounded-3 px-3 py-2 mb-3 d-flex align-items-center justify-content-between"
                  :class="{ 'file-success-bg': previewUrl && !isDefaultImage }"
                >
                  <div class="d-flex align-items-center text-truncate">
                    <FileImage
                      v-if="previewUrl && !isDefaultImage"
                      size="20"
                      color="green"
                      class="me-2"
                    />
                    <FilePlus v-else size="20" color="gray" class="me-2" />
                    <span class="text-secondary fw-medium text-truncate">
                      {{
                        image
                          ? image.name
                          : isDefaultImage
                            ? "Default (No Photo)"
                            : "Product Image"
                      }}
                    </span>
                  </div>
                  <i
                    v-if="!isDefaultImage"
                    class="bi bi-x-circle fs-5 text-danger pointer"
                    @click="removeFile"
                  ></i>
                </div>

                <div
                  class="upload-box rounded-3 text-center position-relative overflow-hidden py-2 flex-grow-1"
                  :class="{ 'has-image': previewUrl, dragover: isDragging }"
                  @click="isDefaultImage ? openFile() : null"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                >
                  <input
                    type="file"
                    ref="fileInput"
                    class="d-none"
                    accept="image/*"
                    @change="onFileChange"
                  />
                  <div v-if="previewUrl" class="preview-container h-100">
                    <img :src="previewUrl" class="img-preview" />
                    <div
                      class="preview-overlay d-flex align-items-center justify-content-center gap-3"
                    >
                      <button
                        v-if="!isDefaultImage"
                        type="button"
                        class="action-icon-btn shadow-sm"
                        @click.stop="isModalOpen = true"
                      >
                        <Eye :size="20" />
                      </button>
                      <button
                        type="button"
                        class="action-icon-btn shadow-sm"
                        @click.stop="openFile"
                      >
                        <Upload :size="20" />
                      </button>
                      <button
                        v-if="!isDefaultImage"
                        type="button"
                        class="action-icon-btn btn-delete shadow-sm"
                        @click.stop="removeFile"
                      >
                        <Trash2 :size="20" />
                      </button>
                    </div>
                  </div>
                  <div
                    v-else
                    class="h-100 d-flex flex-column align-items-center justify-content-center"
                  >
                    <i
                      class="bi bi-cloud-arrow-up upload-icon mb-2 d-block"
                    ></i>
                    <div class="fw-semibold">Attach file</div>
                  </div>
                </div>
              </div>
              <p v-if="err.image" class="text-danger m-0 mt-2">
                {{ err.image }}
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold"
                >Description :</label
              >
              <div
                class="p-3 bg-light rounded-4 form-card-height d-flex flex-column"
              >
                <textarea
                  v-model="form.description"
                  class="ps-3 pt-3 form-control rounded-3 flex-grow-1"
                  placeholder="Enter Description"
                ></textarea>
              </div>
              <p v-if="err.description" class="text-danger m-0 mt-2">
                {{ err.description }}
              </p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn bg-btn py-2 px-5 d-block ms-auto mt-5 rounded-5 fw-medium text-white shadow-sm"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <LayersPlus size="20" class="me-1" /> Update Product
          </button>
        </form>
      </div>

      <BaseModal
        v-if="isModalOpen"
        :fullscreen="true"
        @closeModal="isModalOpen = false"
      >
        <template #header>
          <div class="d-flex align-items-center justify-content-between w-100">
            <div class="d-flex align-items-center text-white">
              <FileImage size="24" class="me-2 text-main" />
              <h5 class="fw-bold mb-0 text-truncate">
                {{ image ? image.name : "Product Image" }}
              </h5>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white fs-5"
              @click="isModalOpen = false"
            ></button>
          </div>
        </template>

        <template #body>
          <div
            class="d-flex align-items-center justify-content-center h-100 w-100"
          >
            <img
              v-if="previewUrl"
              :src="previewUrl"
              class="img-fluid rounded-5"
              style="max-height: 100%; max-width: 100%; object-fit: contain"
            />
          </div>
        </template>
      </BaseModal>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryStore } from "@/stores/category";
import { useProductStore } from "@/stores/product";
import { notify } from "@/utils/toast";
import api from "@/api/https";
import BaseInput from "@/components/BaseInput.vue";
import BaseModal from "@/components/BaseModal.vue"; // Added this
import Select from "primevue/select";
import ProductUpdateSkeleton from "@/components/ProductUpdateSkeleton.vue";
import { require, checkContent, isPrice, validates } from "@/utils/validate";

const router = useRouter();
const route = useRoute();
const toast = notify(router);
const loading = ref(false);

const DEFAULT_IMAGE =
  "https://ecommerce201.csm.linkpc.net/storage/products/no_photo.jpg";
const id = Number(route.params.id);
const productStore = useProductStore();
const cate = useCategoryStore();

const fileInput = ref(null);
const image = ref(null);
const previewUrl = ref(null);
const isDragging = ref(false);
const isModalOpen = ref(false); // Added for the modal

const form = ref({
  title: "",
  price: "",
  category_ids: null,
  condition: "",
  story: "",
  detail: "",
  description: "",
});

const isDefaultImage = computed(() => previewUrl.value === DEFAULT_IMAGE);

onMounted(async () => {
  cate.fetchCategory();
  if (id) {
    loading.value = true;
    await productStore.getProductById(id);
    const data = productStore.productDetail;
    if (data) {
      form.value.title = data.title;
      form.value.price = data.price;
      form.value.category_ids = data.categories?.[0]?.id || data.category_id;
      form.value.condition = data.condition;
      form.value.story = data.story;
      form.value.detail = data.detail;
      form.value.description = data.description;
      previewUrl.value = data.image || DEFAULT_IMAGE;
    }
    loading.value = false;
  }
});

function openFile() {
  fileInput.value.click();
}
function onFileChange(event) {
  const file = event.target.files[0];
  if (file) processFile(file);
}
function handleDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) processFile(file);
}
function processFile(file) {
  image.value = file;
  previewUrl.value = URL.createObjectURL(file);
}
function removeFile() {
  image.value = null;
  previewUrl.value = DEFAULT_IMAGE;
  if (fileInput.value) fileInput.value.value = "";
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;
  const formData = new FormData();
  formData.append("title", form.value.title || "");
  formData.append("price", form.value.price || "");
  formData.append("condition", form.value.condition || "");
  formData.append("story", form.value.story || "");
  formData.append("detail", form.value.detail || "");
  formData.append("description", form.value.description || "");
  if (form.value.category_ids)
    formData.append("category_ids", JSON.stringify([form.value.category_ids]));
  if (image.value instanceof File) formData.append("image", image.value);
  else if (isDefaultImage.value) formData.append("image", "");

  try {
    await api.post(`/api/products/${id}`, formData);
    toast.success("Update Product Successfully!", "/dashboard");
  } catch (err) {
    console.error("Update error:", err.response?.data);
  } finally {
    loading.value = false;
  }
}

const err = reactive({
  title: "",
  price: "",
  category: "",
  condition: "",
  story: "",
  detail: "",
  description: "",
  image: "",
});

// Watchers and Validation (kept as per your code)
watch(
  () => form.value.title,
  (v) => (err.title = require(v, "Title is required")),
);
watch(
  () => form.value.price,
  (v) =>
    (err.price = validates(v, [
      (val) => require(val, "Price is required"),
      (val) => isPrice(val, "Price must be a number"),
    ])),
);
watch(
  () => form.value.category_ids,
  (v) => (err.category = require(v, "Category is required")),
);
watch(
  () => form.value.condition,
  (v) => (err.condition = require(v, "Condition is required")),
);
watch(
  () => form.value.story,
  (v) => (err.story = require(v, "Story is required")),
);
watch(
  () => form.value.detail,
  (v) => (err.detail = require(v, "Detail is required")),
);
watch(
  () => form.value.description,
  (v) =>
    (err.description = validates(v, [
      (val) => require(val, "Description is required"),
      (val) => checkContent(val, "Description must be at least 10 characters"),
    ])),
);

function validate() {
  err.title = require(form.value.title, "Title is required");
  err.price = validates(form.value.price, [
    (v) => require(v, "Price is required"),
    (v) => isPrice(v, "Price must be a number"),
  ]);
  err.category = require(form.value.category_ids, "Category is required");
  err.condition = require(form.value.condition, "Condition is required");
  err.story = require(form.value.story, "Story is required");
  err.detail = require(form.value.detail, "Detail is required");
  err.description = validates(form.value.description, [
    (v) => require(v, "Description is required"),
    (v) => checkContent(v, "Description must be at least 10 characters"),
  ]);
  return (
    !err.title &&
    !err.price &&
    !err.category &&
    !err.condition &&
    !err.story &&
    !err.detail &&
    !err.description
  );
}
</script>

<style scoped>
.form-card-height {
  height: 250px;
}
.transaction-wrapper {
  border: 1px solid #edf2f7;
}
.file-status {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
}
.file-success-bg {
  border-color: #42b883;
  background: #f0fff4;
}
.upload-box {
  border: 2px dashed #cbd5e0;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-box:hover,
.upload-box.dragover {
  border-color: #42b883;
  background: #f6fffb;
}
.upload-box.has-image {
  border-style: solid;
  border-color: #42b883;
  padding: 0 !important;
}
.upload-icon {
  font-size: 32px;
  color: #42b883;
}
.preview-container {
  width: 100%;
  position: relative;
}
.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 5;
}
.upload-box:hover .preview-overlay {
  opacity: 1;
}
.action-icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}
.action-icon-btn:hover {
  background: #f8f9fa;
}
.btn-delete:hover {
  color: #e53e3e !important;
}
.pointer {
  cursor: pointer;
}
textarea {
  resize: none;
}
.icon-box-title {
  background: #f0fff4;
  padding: 12px;
  border-radius: 14px;
}
</style>
