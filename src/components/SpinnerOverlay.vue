<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="relative">
      <!-- Spinner -->
      <span class="loading loading-spinner loading-lg text-white"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Prop para controlar la visibilidad del spinner
defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>
/* Bloquear eventos del teclado y mouse */
.fixed {
  pointer-events: all; /* Permite que el spinner bloquee la interacción */
}
body.no-scroll {
  overflow: hidden; /* Evitar scroll en la página */
}
</style>
