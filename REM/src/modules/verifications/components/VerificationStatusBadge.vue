<script setup lang="ts">
import type { VerificationStatus } from '../types';

const props = defineProps<{ status: VerificationStatus }>();

const map = {
  pending: { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprobada', cls: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rechazada', cls: 'bg-red-100 text-red-800' },
  requires_information: { label: 'Requiere info', cls: 'bg-blue-100 text-blue-800' },
} as const;

const item = map[props.status];
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" :class="item.cls">
    {{ item.label }}
  </span>
</template>
