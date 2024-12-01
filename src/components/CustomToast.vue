<template>
  <div
    v-if="visible"
    :class="`toast-item fixed bottom-4 right-4 z-50 p-4 rounded shadow-lg transition-transform transform ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`"
    :style="{ backgroundColor: color }"
  >
    <p class="text-white font-semibold">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#4caf50' // Default: green (success)
  },
  duration: {
    type: Number,
    default: 3000 // Default: 3 seconds
  }
})

const visible = ref(false)
const isVisible = ref(false)
let timeoutId: ReturnType<typeof setTimeout>

onMounted(() => {
  showToast()
})

onBeforeUnmount(() => {
  clearTimeout(timeoutId)
})

// Show the toast and start the timer to hide it
const showToast = () => {
  visible.value = true
  isVisible.value = true

  timeoutId = setTimeout(() => {
    isVisible.value = false
    setTimeout(() => (visible.value = false), 300) // Give time for the animation to complete
  }, props.duration)
}
</script>

<style scoped>
.toast-item {
  min-width: 250px;
  max-width: 350px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
