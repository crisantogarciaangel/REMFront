<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { VerificationCreateRequest } from '../types';
import { verificationsApi } from '../services/verifications.api';
import VerificationForm from '../components/VerificationForm.vue';

const BRAND = '#0B3CC1';

const router = useRouter();
const submitting = ref(false);
const error = ref<string | null>(null);

const model = ref<VerificationCreateRequest>({
  full_name: '',
  email: '',
  phone: '',
  country: 'MX',
  document_type: '',
  document_number: '',
  document_url: '',
});

async function handleSubmit() {
  submitting.value = true;
  error.value = null;

  try {
    const created = await verificationsApi.create({ ...model });
    router.push({ name: 'verifications.detail', params: { id: created.id } });
  } catch (e: any) {
    error.value = e?.message ?? 'No se pudo crear la solicitud';
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push({ name: 'verifications.list' });
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="mx-auto max-w-6xl px-4 py-5">
      <!-- Header -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Nueva solicitud</h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            @click="goBack"
            :disabled="submitting"
          >
            ← Volver
          </button>
          <button
            class="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95 disabled:opacity-50"
            :style="{ backgroundColor: BRAND }"
            :disabled="submitting"
            @click="handleSubmit"
          >
            {{ submitting ? 'Guardando…' : 'Crear solicitud' }}
          </button>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
      >
        {{ error }}
      </div>

      <!-- Form Card -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <VerificationForm v-model="model" :submitting="submitting" @submit="handleSubmit" />
      </div>


    </div>
  </div>
</template>
