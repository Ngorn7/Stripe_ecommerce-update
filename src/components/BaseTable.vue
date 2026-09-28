<template>
  <div class="table-responsive border rounded-3 bg-white shadow-sm">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th
            v-for="th in column"
            :key="th.key"
            class="py-3 px-4 text-secondary text-uppercase fw-bold text-start align-middle"
          >
            {{ th.label }}
          </th>
          <th
            class="py-3 pe-7 text-secondary text-uppercase fw-bold align-middle text-end actions-th"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="col in column" :key="col.key" class="px-4">
            <slot :name="`col-${col.key}`" :value="row[col.key]">
              <span class="text-dark fw-medium">{{ row[col.key] }}</span>
            </slot>
          </td>
          <td class="px-4">
            <div class="d-flex justify-content-center gap-2">
              <button class="btn border-0" @click="$emit('edit', row)">
                <SquarePen />
              </button>
              <button class="btn border-0" @click="$emit('delete', row)">
                <Trash2 />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: { type: Array, default: () => [] },
  column: { type: Array, default: () => [] },
  loading: Boolean,
  itemPerPage: Number,
  pagination: Object,
});

defineEmits(["delete", "edit"]);
</script>

<style scoped>
.actions-th {
  width: 120px;
  white-space: nowrap;
}

.table thead th {
  font-size: .9rem;
  letter-spacing: 1px;
  color: #6c757d;
  padding: 15px 10px;
  text-transform: uppercase;
}
</style>
