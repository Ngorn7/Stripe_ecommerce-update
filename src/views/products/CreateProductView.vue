<template>
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
        <h3 class="fw-bold mb-1">Product Creation</h3>
        <p class="text-muted mb-0 small">
          Create and publish a new product to your inventory
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
            <p v-if="err.title" class="text-danger m-0">{{ err.title }}</p>
          </div>

          <div class="col-md-6">
            <label class="form-label text-secondary fw-bold">Price :</label>
            <BaseInput
              v-model="form.price"
              input-placeholder="Enter Price"
              input-icon="badge-dollar-sign"
            />
            <p v-if="err.price" class="text-danger m-0">{{ err.price }}</p>
          </div>

          <div class="col-md-6">
            <label class="form-label text-secondary fw-bold">Category :</label>
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
            <label class="form-label text-secondary fw-bold">Condition :</label>
            <BaseInput
              v-model="form.condition"
              input-placeholder="Enter Condition"
              input-icon="align-center-vertical"
            />
            <p v-if="err.condition" class="text-danger m-0">
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
            <p v-if="err.story" class="text-danger m-0">{{ err.story }}</p>
          </div>

          <div class="col-md-6">
            <label class="form-label text-secondary fw-bold">Detail :</label>
            <BaseInput
              v-model="form.detail"
              input-placeholder="Enter Detail"
              input-icon="list-collapse"
            />
            <p v-if="err.detail" class="text-danger m-0">{{ err.detail }}</p>
          </div>

          <div class="col-md-6">
            <label class="form-label text-secondary fw-bold">Image :</label>
            <div
              class="transaction-wrapper p-3 bg-light rounded-4 form-card-height d-flex flex-column"
            >
              <div
                class="file-status rounded-3 px-3 py-2 mb-3 d-flex align-items-center justify-content-between"
                :class="{ 'file-success-bg': image }"
              >
                <div class="d-flex align-items-center text-truncate">
                  <FileImage
                    v-if="image"
                    size="20"
                    color="green"
                    class="me-2"
                  />
                  <FilePlus v-else size="20" color="gray" class="me-2" />
                  <span class="text-secondary fw-medium text-truncate">
                    {{ image ? image.name : "No file attached yet" }}
                  </span>
                </div>
                <i
                  v-if="image"
                  class="bi bi-x-circle fs-5 text-danger pointer"
                  @click="removeFile"
                ></i>
              </div>

              <div
                class="upload-box rounded-3 text-center position-relative overflow-hidden py-2 flex-grow-1"
                :class="{ 'has-image': image, dragover: isDragging }"
                @click="!image ? openFile() : null"
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

                <div
                  v-if="!image"
                  class="h-100 d-flex flex-column align-items-center justify-content-center"
                >
                  <i class="bi bi-cloud-arrow-up upload-icon mb-2 d-block"></i>
                  <div class="fw-semibold">Attach file</div>
                  <small class="text-muted"
                    >drag & drop or click to browse</small
                  >
                </div>

                <div v-else class="preview-container h-100">
                  <img :src="previewUrl" class="img-preview" />
                  <div
                    class="preview-overlay d-flex align-items-center justify-content-center gap-3"
                  >
                    <button
                      type="button"
                      class="action-icon-btn shadow-sm"
                      @click.stop="isModalOpen = true"
                    >
                      <Eye />
                    </button>
                    <button
                      type="button"
                      class="action-icon-btn btn-delete shadow-sm"
                      @click.stop="removeFile"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="err.image" class="text-danger m-0 mt-2">{{ err.image }}</p>
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
          <LayersPlus size="20" class="me-1" /> Publish Product
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
            <h5 class="fw-bold mb-0 text-truncate">{{ image?.name }}</h5>
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

<script setup>
import { ref, onMounted, watch, reactive, nextTick } from "vue";
import { useRouter } from "vue-router";
import Select from "primevue/select";
import BaseInput from "@/components/BaseInput.vue";
import BaseModal from "@/components/BaseModal.vue";
import { useCategoryStore } from "@/stores/category";
import api from "@/api/https";
import { notify } from "@/utils/toast";
import { require, isPrice, validates, checkContent } from "@/utils/validate";

let router = useRouter();
let toast = notify(router);
let loading = ref(false);
const isResetting = ref(false); // Flag to stop watchers during form clear

const cate = useCategoryStore();
const fileInput = ref(null);
const image = ref(null);
const previewUrl = ref(null);
const isDragging = ref(false);
const isModalOpen = ref(false);

const form = ref({
  title: "",
  price: "",
  category_ids: null,
  condition: "",
  story: "",
  detail: "",
  description: "",
  image: null,
});

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

onMounted(() => {
  cate.fetchCategory();
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
  form.value.image = file;
  previewUrl.value = URL.createObjectURL(file);
}
function removeFile() {
  image.value = null;
  form.value.image = null;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (fileInput.value) fileInput.value.value = "";
}

async function submitForm() {
  if (!validate()) return;
  loading.value = true;
  const formData = new FormData();
  formData.append("title", form.value.title);
  formData.append("price", form.value.price);
  if (form.value.category_ids)
    formData.append("category_ids", JSON.stringify([form.value.category_ids]));
  formData.append("condition", form.value.condition);
  formData.append("story", form.value.story);
  formData.append("detail", form.value.detail);
  formData.append("description", form.value.description);
  if (form.value.image) formData.append("image", form.value.image);

  try {
    await api.post("/api/products", formData);

    isResetting.value = true;

    form.value = {
      title: "",
      price: "",
      category_ids: null,
      condition: "",
      story: "",
      detail: "",
      description: "",
      image: null,
    };
    removeFile();

    Object.keys(err).forEach((key) => (err[key] = ""));

    toast.success("Create Product Successfully!", "/dashboard");

    await nextTick();
    isResetting.value = false;
  } catch (error) {
    console.error("Upload error:", error.response?.data);
  } finally {
    loading.value = false;
  }
}

watch(
  () => form.value.title,
  (v) => {
    if (isResetting.value) return;
    err.title = require(v, "Title is required");
  },
);
watch(
  () => form.value.price,
  (v) => {
    if (isResetting.value) return;
    err.price = validates(v, [
      (val) => require(val, "Price is required"),
      (val) => isPrice(val, "Price must be a number"),
    ]);
  },
);
watch(
  () => form.value.category_ids,
  (v) => {
    if (isResetting.value) return;
    err.category = require(v, "Category is required");
  },
);
watch(
  () => form.value.condition,
  (v) => {
    if (isResetting.value) return;
    err.condition = require(v, "Condition is required");
  },
);
watch(
  () => form.value.story,
  (v) => {
    if (isResetting.value) return;
    err.story = require(v, "Story is required");
  },
);
watch(
  () => form.value.detail,
  (v) => {
    if (isResetting.value) return;
    err.detail = require(v, "Detail is required");
  },
);
watch(
  () => form.value.description,
  (v) => {
    if (isResetting.value) return;
    err.description = validates(v, [
      (val) => require(val, "Description is required"),
      (val) => checkContent(val, "Description must be at least 10 characters"),
    ]);
  },
);
watch(
  () => form.value.image,
  (v) => {
    if (isResetting.value) return;
    err.image = require(v, "Image is required");
  },
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
  err.image = require(form.value.image, "Image is required");
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
    !err.image &&
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
  font-size: 1.2rem;
  color: #333;
}
.action-icon-btn:hover {
  background: #f8f9fa;
}
.btn-delete:hover {
  color: #e53e3e;
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
