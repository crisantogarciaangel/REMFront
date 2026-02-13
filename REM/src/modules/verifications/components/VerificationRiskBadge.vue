<script setup lang="ts">
import type { RiskLevel } from '../types';

const props = defineProps<{ level: RiskLevel; score: number }>();

const map = {
   low: { label: 'Bajo', cls: 'bg-blue-50 text-[#0B3CC1]' },
  medium: { label: 'Medio', cls: 'bg-yellow-50 text-yellow-700' },
  high: { label: 'Alto', cls: 'bg-red-50 text-red-700' },
} as const;

const item = map[props.level] ?? { label: String(props.level), cls: 'bg-gray-100 text-gray-800' };
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" :class="item.cls">
    Riesgo: {{ item.label }} <span class="ml-2 opacity-70">({{ score }})</span>
  </span>
</template>
