<script setup lang="ts">
import type { VerificationStatus } from '../types';

const model = defineModel<{ search: string; status: '' | VerificationStatus }>({ required: true });

const statuses: Array<{ value: '' | VerificationStatus; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'requires_information', label: 'Requiere info' },
];
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700">Buscar</label>
      <input
        v-model="model.search"
        class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
        placeholder="Nombre o email..."
      />
    </div>

    <div class="w-full sm:w-56">
      <label class="block text-sm font-medium text-gray-700">Estado</label>
      <select
        v-model="model.status"
        class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
      >
        <option v-for="s in statuses" :key="s.label" :value="s.value">{{ s.label }}</option>
      </select>
    </div>
  </div>
</template>
