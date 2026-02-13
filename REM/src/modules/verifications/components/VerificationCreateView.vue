<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { VerificationCreateRequest } from '../types';
import { verificationsApi } from '../services/verifications.api';
import VerificationForm from '../components/VerificationForm.vue';

const router = useRouter();

const submitting = ref(false);
const error = ref<string | null>(null);

const model = reactive<VerificationCreateRequest>({
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
  <div class="mx-auto max-w-3xl p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Crear verificación</h1>

      <button
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        @click="goBack"
      >
        Volver
      </button>
    </div>

    <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <VerificationForm v-model="model" :submitting="submitting" @submit="handleSubmit" />
    </div>
  </div>
</template>
