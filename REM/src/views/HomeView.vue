<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="mx-auto max-w-5xl p-6">
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold">Backoffice</h1>
      <p class="mt-2 text-sm text-gray-600">
        Módulo interno para gestionar solicitudes de verificación
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <RouterLink
          to="/verifications"
          class="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Ir a Verificaciones
        </RouterLink>

        <RouterLink
          to="/verifications/new"
          class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Crear solicitud
        </RouterLink>
      </div>

      <div class="mt-8 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        <p class="font-medium">Tip</p>
        <p class="mt-1">
          Asegúrate de tener configurado <code class="rounded bg-white px-1">VITE_API_BASE_URL</code> en tu <code class="rounded bg-white px-1">.env</code>
          como: <code class="rounded bg-white px-1">http://localhost:8000/api/v1</code>
        </p>
      </div>
    </div>
  </div>
</template>
