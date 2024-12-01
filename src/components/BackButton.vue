<template>
  <button
    @click="goBack"
    class="text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back() // Regresa a la página anterior
}
</script>

<style scoped>
/* Personalización adicional opcional */
button {
  transition: all 0.2s ease-in-out;
}
</style>
