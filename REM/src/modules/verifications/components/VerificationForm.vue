<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { VerificationCreateRequest } from '../types';
import { isValidEmail, isValidPhone } from '../utils/validators';



const BRAND = '#0B3CC1';

const props = defineProps<{
  modelValue: VerificationCreateRequest;
  submitting?: boolean;
}>();

const DOCUMENT_RULES: Record<string, { min: number; max?: number; exact?: number }> = {
  INE: { exact: 18 },
  Pasaporte: { min: 6, max: 9 },
  Licencia: { min: 8 },
};

const emit = defineEmits<{
  (e: 'update:modelValue', value: VerificationCreateRequest): void;
  (e: 'submit'): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

watch(
  () => model.value.document_type,
  () => {
    model.value.document_number = '';
    touched.document_number = false;
  }
);

type Key = keyof VerificationCreateRequest;

const touched = reactive<Record<Key, boolean>>({
  full_name: false,
  email: false,
  phone: false,
  country: false,
  document_type: false,
  document_number: false,
  document_url: false,
});

function markTouched(k: Key) {
  touched[k] = true;
}
function markAllTouched() {
  (Object.keys(touched) as Key[]).forEach((k) => (touched[k] = true));
}

function errorFor(k: Key): string | null {
  const v = String((model.value as any)[k] ?? '').trim();

  if (!v) return 'Requerido';
  if (k === 'email' && !isValidEmail(v)) return 'Email inválido';
  if (k === 'phone' && !isValidPhone(v)) return 'Teléfono inválido (8–15 dígitos)';
  if (k === 'document_number') {
  const type = model.value.document_type;
  const rule = DOCUMENT_RULES[type];

  if (!rule) return null; // aún no hay tipo seleccionado

  if (rule.exact && v.length !== rule.exact) {
    return `Debe tener exactamente ${rule.exact} caracteres`;
  }

  if (rule.min && v.length < rule.min) {
    return `Debe tener al menos ${rule.min} caracteres`;
  }

  if (rule.max && v.length > rule.max) {
    return `Debe tener máximo ${rule.max} caracteres`;
  }
}
  if (k === 'document_url' && v.length < 8) return 'URL demasiado corta';
  return null;
}

const isValid = computed(() => {
  const keys = Object.keys(touched) as Key[];
  return keys.every((k) => errorFor(k) === null);
});

function submit() {
  markAllTouched();
  if (!isValid.value) return;
  emit('submit');
}

function resetForm() {
  emit('update:modelValue', {
    full_name: '',
    email: '',
    phone: '',
    country: 'MX',
    document_type: '',
    document_number: '',
    document_url: '',
  });

  (Object.keys(touched) as Key[]).forEach((k) => (touched[k] = false));
}

function inputClass(k: Key) {
  const hasError = touched[k] && !!errorFor(k);
  return [
    'w-full rounded-xl border bg-white px-10 py-2 text-sm outline-none transition',
    'focus:ring-2 focus:ring-blue-100',
    hasError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400',
    props.submitting ? 'opacity-70' : '',
  ].join(' ');
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <!-- Top notice -->
    <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-start gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          :style="{ backgroundColor: BRAND }"
        >
          <!-- shield icon -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="min-w-0">
          <div class="text-sm font-semibold text-gray-900">Nueva Solicitud</div>
        </div>
      </div>
    </div>

    <!-- Section: Applicant -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <div class="inline-flex items-center gap-2">
            <span class="rounded-full px-2 py-1 text-xs font-semibold text-white" :style="{ backgroundColor: BRAND }">
              1
            </span>
            <h3 class="text-sm font-semibold text-gray-900">Datos del solicitante</h3>
          </div>
          <p class="mt-1 text-xs text-gray-500">Datos mínimos para iniciar el proceso.</p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- full_name -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Nombre completo</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- user icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" />
              </svg>
            </span>
            <input
              v-model="model.full_name"
              type="text"
              placeholder="Juan Pérez"
              :class="inputClass('full_name')"
              :disabled="submitting"
              @blur="markTouched('full_name')"
            />
          </div>
          <p v-if="touched.full_name && errorFor('full_name')" class="mt-1 text-xs text-red-600">
            {{ errorFor('full_name') }}
          </p>
        </div>

        <!-- email -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- mail icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4V6z" stroke="currentColor" stroke-width="2" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <input
              v-model="model.email"
              type="text"
              placeholder="juan@correo.com"
              :class="inputClass('email')"
              :disabled="submitting"
              @blur="markTouched('email')"
            />
          </div>
          <p v-if="touched.email && errorFor('email')" class="mt-1 text-xs text-red-600">
            {{ errorFor('email') }}
          </p>
        </div>

        <!-- phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- phone icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 3.2 10.8 19.8 19.8 0 0 1 .1 2.2 2 2 0 0 1 2.1 0h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L6 7a16 16 0 0 0 11 11l.6-.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <input
              v-model="model.phone"
              type="text"
              inputmode="numeric"
              placeholder="5512345678"
              :class="inputClass('phone')"
              :disabled="submitting"
              @blur="markTouched('phone')"
            />
          </div>
          <p v-if="touched.phone && errorFor('phone')" class="mt-1 text-xs text-red-600">
            {{ errorFor('phone') }}
          </p>
        </div>

        <!-- country -->
        <div>
          <label class="block text-sm font-medium text-gray-700">País</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- globe icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22a10 10 0 100-20 10 10 0 000 20z" stroke="currentColor" stroke-width="2" />
                <path d="M2 12h20" stroke="currentColor" stroke-width="2" />
                <path
                  d="M12 2a15 15 0 010 20"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <input
              v-model="model.country"
              type="text"
              placeholder="MX"
              :class="inputClass('country')"
              :disabled="submitting"
              @blur="markTouched('country')"
            />
          </div>
          <p v-if="touched.country && errorFor('country')" class="mt-1 text-xs text-red-600">
            {{ errorFor('country') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Section: Document -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div class="inline-flex items-center gap-2">
        <span class="rounded-full px-2 py-1 text-xs font-semibold text-white" :style="{ backgroundColor: BRAND }">
          2
        </span>
        <h3 class="text-sm font-semibold text-gray-900">Documento</h3>
      </div>
      <p class="mt-1 text-xs text-gray-500">Datos del documento y evidencia simulada.</p>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- document_type -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de documento</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- id icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4V6z" stroke="currentColor" stroke-width="2" />
                <path d="M8 10h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M8 14h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <select
              v-model="model.document_type"
              :class="inputClass('document_type')"
              :disabled="submitting"
              @blur="markTouched('document_type')"
            >
              <option value="" disabled>Selecciona…</option>
              <option value="INE">INE</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Licencia">Licencia</option>
            </select>
          </div>
          <p v-if="touched.document_type && errorFor('document_type')" class="mt-1 text-xs text-red-600">
            {{ errorFor('document_type') }}
          </p>
        </div>

        <!-- document_number -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Número de documento</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- hash icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 3L8 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M16 3l-2 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M4 8h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M3 16h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <input
              v-model="model.document_number"
              type="text"
              placeholder="ABC123456"
              :class="inputClass('document_number')"
              :disabled="submitting"
              @blur="markTouched('document_number')"
            />
          </div>
          <p v-if="touched.document_number && errorFor('document_number')" class="mt-1 text-xs text-red-600">
            {{ errorFor('document_number') }}
          </p>
        </div>

        <!-- document_url -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">URL de documento / selfie</label>
          <div class="relative mt-1">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <!-- link icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <input
              v-model="model.document_url"
              type="text"
              placeholder="https://example.com/document.jpg"
              :class="inputClass('document_url')"
              :disabled="submitting"
              @blur="markTouched('document_url')"
            />
          </div>
          <p v-if="touched.document_url && errorFor('document_url')" class="mt-1 text-xs text-red-600">
            {{ errorFor('document_url') }}
          </p>

          <div v-if="model.document_url.trim().length >= 8" class="mt-2">
            <a
              :href="model.document_url"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-2 text-xs font-medium"
              :style="{ color: BRAND }"
            >
              Vista previa del enlace <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-xs text-gray-500">
          Al enviar, se generará el registro y se calculará el riesgo automáticamente.
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            :disabled="submitting"
            @click="resetForm"
          >
            Limpiar
          </button>

          <button
            type="submit"
            class="rounded-xl px-5 py-2 text-sm font-medium text-white shadow-sm hover:brightness-95 disabled:opacity-50"
            :style="{ backgroundColor: BRAND }"
            :disabled="submitting"
          >
            {{ submitting ? 'Guardando…' : 'Crear solicitud' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
