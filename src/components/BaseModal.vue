<template>
  <div>
    <div
      class="modal d-block"
      tabindex="-1"
      aria-hidden="true"
      :style="{ background: fullscreen ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)' }"
      @click.self="$emit('closeModal')"
    >
      <div 
        class="modal-dialog" 
        :class="[fullscreen ? 'modal-fullscreen' : 'modal-dialog-centered']"
      >
        <div 
          class="modal-content px-2" 
          :class="{ 'bg-black text-white border-0': fullscreen }"
        >
          <div class="modal-header border-0">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div :class="`modal-footer border-0 d-flex ${position}`">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  position: {
    type: String,
    default: "",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  }
});
defineEmits(["closeModal"]);
</script>