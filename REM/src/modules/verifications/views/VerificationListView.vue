<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { verificationsApi } from '../services/verifications.api';
import type { Verification, VerificationStatus } from '../types';

import VerificationFilters from '../components/VerificationFilters.vue';
import VerificationStatusBadge from '../components/VerificationStatusBadge.vue';
import VerificationRiskBadge from '../components/VerificationRiskBadge.vue';

const BRAND = '#0B3CC1';

const router = useRouter();
const loading = ref(false);
const error = ref<string | null>(null);

const items = ref<Verification[]>([]);
const limit = ref(10);
const offset = ref(0);
const total = ref<number | null>(null);

const filters = ref<{ search: string; status: '' | VerificationStatus }>({
  search: '',
  status: '',
});

const page = computed(() => Math.floor(offset.value / limit.value) + 1);
const hasPrev = computed(() => offset.value > 0);
const hasNext = computed(() => {
  if (total.value === null) return items.value.length === limit.value;
  return offset.value + limit.value < total.value;
});
const showingText = computed(() => {
  if (items.value.length === 0) return '0 resultados';
  const from = offset.value + 1;
  const to = offset.value + items.value.length;
  const t = total.value ?? '—';
  return `${from}–${to} de ${t}`;
});

async function load() {
  loading.value = true;
  error.value = null;

  try {
    const res = await verificationsApi.list({
      search: filters.value.search.trim() || undefined,
      status: (filters.value.status || undefined) as any,
      limit: limit.value,
      offset: offset.value,
    });
    items.value = res.items;
    total.value = res.total;
  } catch (e: any) {
    error.value = e?.message ?? 'Error cargando verificaciones';
  } finally {
    loading.value = false;
  }
}

watch(
  filters,
  () => {
    offset.value = 0;
    load();
  },
  { deep: true, immediate: true }
);

function goNew() {
  router.push({ name: 'verifications.create' });
}
function goDetail(id: string) {
  router.push({ name: 'verifications.detail', params: { id } });
}

async function prevPage() {
  if (!hasPrev.value) return;
  offset.value = Math.max(0, offset.value - limit.value);
  await load();
}
async function nextPage() {
  if (!hasNext.value) return;
  offset.value = offset.value + limit.value;
  await load();
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const a = parts[0]?.[0] ?? '';
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (a + b).toUpperCase();
}

const limitOptions = [10, 20, 50, 100];
</script>

<template>
  <!-- fondo gris admin (como filtros) -->
  <div class="min-h-screen bg-gray-100">
    <div class="mx-auto max-w-6xl px-4 py-5">
      <!-- header compacto -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Solicitudes de Verificacion</h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            @click="load"
            :disabled="loading"
          >
            ↻ Recargar
          </button>

          <button
            class="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95"
            :style="{ backgroundColor: BRAND }"
            @click="goNew"
          >
            ＋ Nueva solicitud
          </button>
        </div>
      </div>

      <!-- filtros (card) -->
      <div class="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <VerificationFilters v-model="filters" />

        <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-xs text-gray-500">{{ showingText }}</div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-gray-600">Por página</span>
              <select
                v-model.number="limit"
                class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                @change="offset = 0; load()"
              >
                <option v-for="n in limitOptions" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <button
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
              :disabled="!hasPrev || loading"
              @click="prevPage"
              title="Anterior"
            >
              ←
            </button>
            <button
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
              :disabled="!hasNext || loading"
              @click="nextPage"
              title="Siguiente"
            >
              →
            </button>
            <span class="text-xs text-gray-500">Pág. {{ page }}</span>
          </div>
        </div>
      </div>

      <!-- error -->
      <div
        v-if="error"
        class="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
      >
        {{ error }}
      </div>

      <!-- tabla pro (card + hover + avatar + acción visible) -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5">
          <div class="text-sm font-semibold text-gray-900">Solicitudes</div>
          <div class="text-xs text-gray-500">Click en una fila para ver detalle</div>
        </div>

        <div v-if="loading" class="p-6 text-sm text-gray-600">Cargando…</div>

        <div v-else-if="items.length === 0" class="p-10 text-center">
          <div class="text-sm font-semibold text-gray-900">Sin resultados</div>
          <div class="mt-1 text-sm text-gray-600">Ajusta filtros o crea una nueva solicitud.</div>
          <button
            class="mt-4 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95"
            :style="{ backgroundColor: BRAND }"
            @click="goNew"
          >
            ＋ Crear solicitud
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th class="px-4 py-3 sm:px-5">Solicitante</th>
                <th class="px-4 py-3 sm:px-5">País</th>
                <th class="px-4 py-3 sm:px-5">Estado</th>
                <th class="px-4 py-3 sm:px-5">Riesgo</th>
                <th class="px-4 py-3 sm:px-5">Creación</th>
                <th class="px-4 py-3 text-right sm:px-5">Acción</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="it in items"
                :key="it.id"
                class="cursor-pointer transition hover:bg-gray-50"
                @click="goDetail(it.id)"
              >
                <td class="px-4 py-4 sm:px-5">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold shadow-sm"
                      :style="{ color: BRAND }"
                      aria-hidden="true"
                    >
                      {{ initials(it.full_name) }}
                    </div>

                    <div class="min-w-0">
                      <div class="truncate font-semibold text-gray-900">{{ it.full_name }}</div>
                      <div class="mt-1 truncate text-xs text-gray-500">{{ it.email }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 sm:px-5">
                  <div class="font-medium text-gray-900">{{ it.country }}</div>
                  <div class="mt-1 text-xs text-gray-500">{{ it.document_type }}</div>
                </td>

                <td class="px-4 py-4 sm:px-5">
                  <VerificationStatusBadge :status="it.status" />
                </td>

                <td class="px-4 py-4 sm:px-5">
                  <VerificationRiskBadge :level="it.risk_level" :score="it.risk_score" />
                </td>

                <td class="px-4 py-4 text-sm text-gray-700 sm:px-5">
                  {{ new Date(it.created_at).toLocaleString() }}
                </td>

                <td class="px-4 py-4 text-right sm:px-5">
                  <button
                    class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
                    @click.stop="goDetail(it.id)"
                  >
                    Ver <span :style="{ color: BRAND }">→</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-5">
          <div class="text-xs text-gray-500">{{ showingText }}</div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
              :disabled="!hasPrev || loading"
              @click="prevPage"
            >
              ←
            </button>
            <button
              class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
              :disabled="!hasNext || loading"
              @click="nextPage"
            >
              →
            </button>
            <span class="text-xs text-gray-500">Pág. {{ page }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
