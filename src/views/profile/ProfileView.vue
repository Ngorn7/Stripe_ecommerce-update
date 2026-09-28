<template>
  <div>
    <template v-if="MyProfileStore.loading">
      <ProfileSkeleton />
    </template>
    <template v-else>
      <div class="container-fluid py-4 bg-white rounded-5 px-4 shadow-sm">
        <div class="d-flex align-items-center gap-3 mt-5 mb-5">
          <div class="icon-box-title">
            <User class="text-main" :size="28" />
          </div>
          <div>
            <h3 class="fw-bold mb-1">My Profile</h3>
            <p class="text-muted mb-0 small">
              Manage your account and store details
            </p>
          </div>
        </div>

        <div class="d-flex align-content-center bg-light rounded-5 px-5">
          <div class="col-lg-6">
            <div class="d-flex pb-3">
              <div class="border-0 me-4 mt-3">
                <div
                  class="position-relative mx-auto"
                  style="width: 150px; height: 150px"
                >
                  <img
                    id="avatar"
                    :src="MyProfileStore.myProfile?.avatar"
                    class="rounded-circle border w-100 h-100 object-fit-cover"
                    alt="profile"
                  />
                  <div
                    class="dropdown position-absolute bg-main rounded-circle"
                    style="bottom: 50px; right: -12px"
                  >
                    <span
                      class="d-flex justify-content-center align-items-center bg-btn text-white rounded-circle shadow"
                      data-bs-toggle="dropdown"
                      style="width: 35px; height: 35px; cursor: pointer"
                    >
                      <Pencil size="20" />
                    </span>

                    <ul class="dropdown-menu px-2 bg-main border">
                      <li>
                        <input
                          id="uploadImage"
                          type="file"
                          @change="handleFile"
                          accept="image/*"
                          style="display: none"
                        />
                        <label
                          for="uploadImage"
                          class="btn dropdown-item mb-1 nav-text"
                        >
                          <Pencil class="me-2" size="21" /> Change Profile
                        </label>
                      </li>
                      <li>
                        <button
                          class="btn dropdown-item nav-text"
                          type="button"
                          @click="Remove_Modal"
                        >
                          <Trash2 class="me-2 text-danger" size="21" /> Remove
                          Profile
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <h4 class="fw-bold">{{ MyProfileStore.myProfile?.name }}</h4>
                <div class="lh-1 mt-3">
                  <p>
                    <span class="text-muted">Email:</span>
                    {{ MyProfileStore.myProfile?.email }}
                  </p>
                  <p>
                    <span class="text-muted">Created At:</span>
                    {{ formatDate(MyProfileStore.myProfile?.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="d-flex justify-content-end mt-10">
              <button
                class="btn bg-btn rounded-pill py-2 px-6 me-3"
                @click="editModal"
              >
                Edit Profile
              </button>
              <button
                class="btn btn-danger rounded-pill py-2 px-6"
                @click="toggleModal"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div class="bg-light rounded-5 px-5 mt-5">
          <div class="row">
            <div class="col-lg-6">
              <h5 class="mt-4 mb-5 fw-bold">Personal Information</h5>
              <ul class="timeline">
                <li>
                  <span class="text-gray">Full Name</span>
                  <p class="fs-5 fw-bold">
                    {{ MyProfileStore.myProfile.name }}
                  </p>
                </li>
                <li>
                  <span class="text-gray">Email</span>
                  <p class="fw-bold fs-5">
                    {{ MyProfileStore.myProfile.email }}
                  </p>
                </li>
                <li>
                  <span class="text-gray">Address</span>
                  <p class="fw-bold fs-5">
                    {{ MyProfileStore.myProfile?.location ?? "N/A" }}
                  </p>
                </li>
              </ul>
            </div>
            <div class="col-lg-6">
              <ul class="mt-11 timeline">
                <li>
                  <span class="text-gray">Email</span>
                  <p class="fw-bold fs-5">
                    {{ MyProfileStore.myProfile.email }}
                  </p>
                </li>
                <li>
                  <span class="text-gray">ID</span>
                  <p class="fw-bold fs-5">{{ MyProfileStore.myProfile.id }}</p>
                </li>
                <li>
                  <span class="text-gray">Phone Number</span>
                  <p class="fw-bold fs-5">
                    {{ MyProfileStore.myProfile?.phone ?? "N/A" }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <BaseModal
          v-if="showCropper"
          @closeModal="showCropper = false"
          position="justify-content-center"
        >
          <template #header>
            <h5 class="modal-title mx-auto fw-bold">Crop Profile Picture</h5>
          </template>

          <template #body>
            <div class="cropper-container mb-5">
              <Cropper
                ref="cropperRef"
                :src="imageSource"
                :stencil-props="{
                  aspectRatio: 1 / 1,
                  movable: true,
                  resizable: true,
                }"
                :stencil-component="CircleStencil"
                image-restriction="stencil"
                class="cropper-instance"
              />
            </div>
            <p class="text-center text-muted m-0">
              Scroll to zoom • Drag to move
            </p>
          </template>

          <template #footer>
            <button
              class="btn btn-secondary rounded-pill px-6 py-2"
              @click="showCropper = false"
            >
              Cancel
            </button>
            <button
              class="btn bg-btn text-white rounded-pill px-6"
              @click="cropAndUpload"
              :disabled="Loading"
            >
              <span
                v-if="Loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Confirm Crop
            </button>
          </template>
        </BaseModal>

        <BaseModal
          v-if="remove"
          @closeModal="Remove_Modal"
          position="justify-content-center"
        >
          <template #header
            ><h5 class="modal-title mx-auto fw-bold">
              Remove Profile
            </h5></template
          >
          <template #body
            ><p class="text-center mb-0">
              Are you sure you want to remove your profile image?
            </p></template
          >
          <template #footer>
            <button
              type="button"
              class="btn btn-secondary rounded-pill px-6 py-2"
              @click="Remove_Modal"
            >
              Cancel
            </button>
            <button
              class="btn btn-danger rounded-pill px-6 py-2"
              @click="removeAvatar"
              :disabled="Loading"
            >
              <span
                v-if="Loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Confirm Remove
            </button>
          </template>
        </BaseModal>

        <BaseModal v-if="edit" @closeModal="editModal">
          <template #header
            ><h5 class="modal-title mx-auto fw-bold">Edit Profile</h5></template
          >
          <template #body>
            <div class="mb-3">
              <label class="mb-2">Name</label>
              <BaseInput
                inputPlaceholder="Enter your name"
                inputIcon="User"
                v-model="editProfile.name"
              />
              <p v-if="err.name" class="text-danger m-0">
                {{ err.name }}
              </p>
            </div>

            <div class="mb-3">
              <label class="mb-2">Email</label>
              <BaseInput
                inputPlaceholder="Enter your email"
                inputIcon="Mail"
                v-model="editProfile.email"
              />
              <p v-if="err.email" class="text-danger m-0">
                {{ err.email }}
              </p>
            </div>
            <div class="mb-3">
              <label class="mb-2">Location</label>
              <BaseInput
                inputPlaceholder="Enter your location"
                inputIcon="MapPin"
                v-model="editProfile.location"
              />
              <p v-if="err.location" class="text-danger m-0">
                {{ err.location }}
              </p>
            </div>
            <div class="mb-3">
              <label class="mb-2">Phone</label>
              <BaseInput
                inputPlaceholder="Enter your phone"
                inputIcon="Phone"
                v-model="editProfile.phone"
              />
              <p v-if="err.phone" class="text-danger m-0">
                {{ err.phone }}
              </p>
            </div>
          </template>
          <template #footer>
            <button
              type="button"
              class="btn btn-secondary rounded-pill px-6 py-2"
              @click="editModal"
            >
              Cancel
            </button>
            <button
              class="btn bg-btn text-white rounded-pill py-2 px-6"
              @click="UpdateProfile"
              :disabled="Loading"
            >
              <span
                v-if="Loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Update
            </button>
          </template>
        </BaseModal>

        <BaseModal
          v-if="open"
          @closeModal="toggleModal"
          position="justify-content-center"
        >
          <template #header
            ><h5 class="modal-title mx-auto fw-bold">Sign out</h5></template
          >
          <template #body
            ><p class="text-center mb-0">
              Are you sure you want to sign out?
            </p></template
          >
          <template #footer>
            <button
              type="button"
              class="btn btn-secondary rounded-pill px-6 py-2"
              @click="toggleModal"
            >
              Cancel
            </button>
            <button
              class="btn btn-danger rounded-pill py-2 px-6"
              @click="handleLogout"
            >
              Sign out
            </button>
          </template>
        </BaseModal>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/https";

import BaseModal from "@/components/BaseModal.vue";
import BaseInput from "@/components/BaseInput.vue";
import ProfileSkeleton from "@/components/ProfileSkeleton.vue";

// Cropper
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

import { require, isEmail, validates, isPrice, checkPhone } from "@/utils/validate";

const router = useRouter();
const MyProfileStore = useProfileStore();
const AuthStore = useAuthStore();
const toast = useToast();
const route = useRoute();

const open = ref(false);
const edit = ref(false);
const remove = ref(false);
const Loading = ref(false);
const showCropper = ref(false);
const imageSource = ref(null);
const cropperRef = ref(null);

const editProfile = ref({ name: "", email: "", location: "", phone: "" });

onMounted(async () => {
  await MyProfileStore.fetchMyProfile();
  if (MyProfileStore.myProfile) {
    editProfile.value = { ...MyProfileStore.myProfile };
  }
  if (MyProfileStore.mustEdit) {
    edit.value = true; 
    validate();
    MyProfileStore.mustEdit = false;
  }
});

const err = reactive({
  name: "",
  email: "",
  location: "",
  phone: "",
});

watch(
  () => editProfile.value.email,
  (newValue) => {
    err.email = validates(newValue, [
      (v) => require(v, "Email is required"),
      (v) => isEmail(v, "Wrong Format Email"),
    ]);
  },
);

watch(
  () => editProfile.value.phone,
  (newValue) => {
    err.phone = validates(newValue, [
      (v) => require(v, "Phone is required"),
      (v) => isPrice(v, "Phone must be a number"),
      (v) => checkPhone(v, "Phone must be at least 9 digits"),
    ]);
  },
);

watch(
  () => editProfile.value.name,
  (newValue) => {
    err.name = require(newValue, "Name is required");
  },
);

watch(
  () => editProfile.value.location,
  (newValue) => {
    err.location = require(newValue, "Location is required");
  },
);

function validate() {
  err.email = validates(editProfile.value.email, [
    (v) => require(v, "Email is require"),
    (v) => isEmail(v, "Wrong Format Email"),
  ]);

  err.phone = validates(editProfile.value.phone, [
    (v) => require(v, "Phone is require"),
    (v) => isPrice(v, "Phone must be a number"),
    (v) => isPrice(v, "Phone must be at least 9 digits"),
  ]);

  err.name = require(editProfile.value.name, "Name is require");
  err.location = require(editProfile.value.location, "Location is require");

  return !err.email && !err.name && !err.location && !err.phone;
}

const toggleModal = () => (open.value = !open.value);

const editModal = () => {
  edit.value = !edit.value;
  // Reset data back to store version if modal is closed
  if (edit.value === false) {
    editProfile.value = { ...MyProfileStore.myProfile };
    err.name = "";
    err.email = "";
    err.location = "";
    err.phone = "";
  }
};

const Remove_Modal = () => (remove.value = !remove.value);

const handleFile = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (imageSource.value) URL.revokeObjectURL(imageSource.value);

  imageSource.value = URL.createObjectURL(file);
  showCropper.value = true;
  event.target.value = "";
};

async function cropAndUpload() {
  const { canvas } = cropperRef.value.getResult();
  if (!canvas) return;

  Loading.value = true;
  canvas.toBlob(async (blob) => {
    try {
      let formData = new FormData();
      formData.append("image", blob, "avatar.jpg");
      await api.post("/api/profile/image", formData);
      toast.success("Profile image updated successfully");
      await MyProfileStore.fetchMyProfile();
      showCropper.value = false;
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      Loading.value = false;
    }
  }, "image/jpeg");
}

async function removeAvatar() {
  const defaultImage = "no_photo.jpg";
  const currentAvatar = MyProfileStore.myProfile?.avatar || "";

  if (currentAvatar.includes(defaultImage)) {
    toast.warning("You are already using the default profile picture");
    remove.value = false;
    return;
  }

  try {
    Loading.value = true;
    await api.delete("/api/profile/image");
    toast.success("Profile image removed");
    await MyProfileStore.fetchMyProfile();
  } catch (error) {
    toast.error("Failed to remove image");
  } finally {
    Loading.value = false;
    remove.value = false;
  }
}

async function UpdateProfile() {
  if (!validate()) return;
  Loading.value = true;
  try {
    await api.put("/api/profile/info", editProfile.value);
    toast.success("Profile updated");
    await MyProfileStore.fetchMyProfile();
    edit.value = false;
  } catch (error) {
    toast.error("Update failed");
  } finally {
    Loading.value = false;
  }
}

async function handleLogout() {
  AuthStore.logout();
  router.push({ name: "login" });
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
</script>

<style scoped>
.cropper-container {
  height: 400px;
  background: #111;
  overflow: hidden;
  border-radius: 8px;
}

.cropper-instance {
  height: 100%;
  width: 100%;
}

:deep(.vue-circle-stencil) {
  border: 2px solid #fff;
}

:deep(.vue-cropper__stencil) {
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.6);
}

.object-fit-cover {
  object-fit: cover;
}

ul.timeline {
  list-style-type: none;
  position: relative;
}
ul.timeline:before {
  content: " ";
  background: #d4d9df;
  display: inline-block;
  position: absolute;
  left: 29px;
  width: 2px;
  height: 100%;
  z-index: 400;
}
ul.timeline > li {
  margin: 20px 0;
  padding-left: 30px;
}
ul.timeline > li:before {
  content: " ";
  background: white;
  display: inline-block;
  position: absolute;
  border-radius: 50%;
  border: 3px solid #333;
  left: 20px;
  width: 20px;
  height: 20px;
  z-index: 400;
}

.text-gray {
  color: #707070 !important;
  font-size: 14px;
}
.icon-box-title {
  background: #f0fff4;
  padding: 12px;
  border-radius: 14px;
}

.dropdown-menu {
  border-radius: 12px !important;
  padding: 10px !important;
  border: 1px solid #edf2f7 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 6px 25px;
  border-radius: 5px;
}

.dropdown-item:hover {
  background-color: #edf2f7 !important;
  border-radius: 5px;
}
</style>
