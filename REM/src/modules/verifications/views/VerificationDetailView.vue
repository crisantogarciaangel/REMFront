<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verificationsApi } from '../services/verifications.api';
import type { Verification, VerificationStatus } from '../types';

import VerificationStatusBadge from '../components/VerificationStatusBadge.vue';
import VerificationRiskBadge from '../components/VerificationRiskBadge.vue';

const BRAND = '#0B3CC1';

const route = useRoute();
const router = useRouter();

const id = computed(() => String(route.params.id || ''));

const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const item = ref<Verification | null>(null);
const statusDraft = ref<VerificationStatus>('pending');

const statusOptions: Array<{ value: VerificationStatus; label: string }> = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'requires_information', label: 'Requiere info' },
];

const isFinal = computed(() => {
  const s = item.value?.status;
  return s === 'approved' || s === 'rejected';
});

const visibleStatusOptions = computed(() => {
  if (!item.value) return statusOptions;
  if (isFinal.value) return statusOptions.filter((o) => o.value === item.value!.status);
  return statusOptions;
});

async function load() {
  loading.value = true;
  error.value = null;

  try {
    const res = await verificationsApi.getById(id.value);
    item.value = res;
    statusDraft.value = res.status;
  } catch (e: any) {
    error.value = e?.message ?? 'No se pudo cargar el detalle';
  } finally {
    loading.value = false;
  }
}

async function saveStatus() {
  if (!item.value) return;

  saving.value = true;
  error.value = null;
  success.value = null;

  try {
    await verificationsApi.updateStatus(item.value.id, { status: statusDraft.value });

    const fresh = await verificationsApi.getById(item.value.id);
    item.value = fresh;
    statusDraft.value = fresh.status;

    success.value = 'Estado actualizado correctamente';
    setTimeout(() => (success.value = null), 1500);
  } catch (e: any) {
    error.value = e?.message ?? 'No se pudo actualizar el estado';
  } finally {
    saving.value = false;
  }
}

function goBack() {
  router.push({ name: 'verifications.list' });
}

onMounted(load);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="mx-auto max-w-6xl px-4 py-5">
      <!-- Header -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <h1 class="truncate text-2xl font-semibold text-gray-900">Detalle de verificación</h1>
          <p class="mt-1 truncate text-sm text-gray-600">ID: {{ id }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            @click="goBack"
          >
            ← Volver
          </button>

          <button
            class="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95 disabled:opacity-50"
            :style="{ backgroundColor: BRAND }"
            :disabled="saving || !item || isFinal || statusDraft === item.status"
            @click="saveStatus"
            title="Guarda el estado seleccionado"
          >
            {{ saving ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </div>
      </div>

      <!-- Alerts -->
      <div
        v-if="error"
        class="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm"
      >
        {{ success }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        Cargando…
      </div>

      <!-- Not found -->
      <div v-else-if="!item" class="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        No se encontró la verificación.
      </div>

      <!-- Content -->
      <div v-else class="space-y-4">
        <!-- 2 columns layout -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <!-- LEFT (2 cols) - uniform: 2 rows -->
          <div class="grid grid-rows-2 gap-4 lg:col-span-2">
            <!-- Summary (row 1) -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-full flex flex-col">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0">
                  <div class="text-lg font-semibold text-gray-900">{{ item.full_name }}</div>
                  <div class="mt-1 text-sm text-gray-600">{{ item.email }} · {{ item.phone }}</div>

                  <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div class="text-xs text-gray-500">País</div>
                      <div class="mt-1 text-sm font-medium text-gray-900">{{ item.country }}</div>
                    </div>

                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div class="text-xs text-gray-500">Creación</div>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ new Date(item.created_at).toLocaleString() }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <VerificationStatusBadge :status="item.status" />
                  <VerificationRiskBadge :level="item.risk_level" :score="item.risk_score" />
                </div>
              </div>

              <!-- Evidence -->
              <div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div class="text-xs font-medium text-gray-600">Evidencia (URL)</div>

                <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div class="min-w-0 text-sm text-gray-900">
                    <span class="break-all">{{ item.document_url }}</span>
                  </div>

                  <a
                    :href="item.document_url"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
                  >
                    Abrir <span :style="{ color: BRAND }">↗</span>
                  </a>
                </div>
              </div>

              <!-- optional spacer to help equal feel -->
              <div class="mt-auto"></div>
            </div>

            <!-- Key/Value details (row 2) -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-full flex flex-col">
              <div>
                <div class="text-sm font-semibold text-gray-900">Datos de la solicitud</div>
                <p class="mt-1 text-xs text-gray-500">Campos clave para revisión rápida.</p>
              </div>

              <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-gray-200 bg-white p-4">
                  <div class="text-xs text-gray-500">Tipo de documento</div>
                  <div class="mt-1 text-sm font-medium text-gray-900">{{ item.document_type }}</div>
                </div>

                <div class="rounded-xl border border-gray-200 bg-white p-4">
                  <div class="text-xs text-gray-500">Estado actual</div>
                  <div class="mt-2">
                    <VerificationStatusBadge :status="item.status" />
                  </div>
                </div>

                <div class="rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2">
                  <div class="text-xs text-gray-500">Número de documento</div>
                  <div class="mt-1 text-sm font-medium text-gray-900 break-all">{{ item.document_number }}</div>
                </div>
              </div>

              <div class="mt-auto"></div>
            </div>
          </div>

          <!-- RIGHT (1 col) - uniform: 2 rows -->
          <div class="grid grid-rows-2 gap-4">
            <!-- Decision (row 1) -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-full flex flex-col">
              <div>
                <div class="text-sm font-semibold text-gray-900">Decisión operativa</div>
                <p class="mt-1 text-xs text-gray-500">Actualiza el estado según revisión.</p>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    v-model="statusDraft"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                    :disabled="saving || isFinal"
                  >
                    <option v-for="s in visibleStatusOptions" :key="s.value" :value="s.value">
                      {{ s.label }}
                    </option>
                  </select>

                  <p v-if="isFinal" class="mt-2 text-xs text-gray-500">
                    Esta solicitud está en un estado final y ya no se puede modificar.
                  </p>
                </div>
              </div>

              <!-- push button to bottom -->
              <div class="mt-auto pt-4">
                <button
                  class="w-full rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95 disabled:opacity-50"
                  :style="{ backgroundColor: BRAND }"
                  :disabled="saving || isFinal || statusDraft === item.status"
                  @click="saveStatus"
                >
                  {{ saving ? 'Guardando…' : 'Guardar estado' }}
                </button>
              </div>
            </div>

            <!-- Risk panel (row 2) -->
            <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-full flex flex-col">
              <div>
                <div class="text-sm font-semibold text-gray-900">Riesgo</div>
                <p class="mt-1 text-xs text-gray-500">Resultado calculado por reglas del backend.</p>

                <div class="mt-3 flex items-center justify-between">
                  <div class="text-xs text-gray-500">Nivel</div>
                  <VerificationRiskBadge :level="item.risk_level" :score="item.risk_score" />
                </div>

                <div class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div class="text-xs text-gray-500">Score</div>
                  <div class="mt-1 text-2xl font-semibold text-gray-900">{{ item.risk_score }}</div>
                </div>

                <div class="mt-3 text-xs text-gray-500">
                  Penalizaciones típicas: dominio email riesgoso, país restringido, longitud de documento.
                </div>
              </div>

              <div class="mt-auto"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- end content -->
    </div>
  </div>
</template>
