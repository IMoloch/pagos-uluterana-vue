<template>
  <div class="card-list-container mt-6">
    <div class="card bg-base-100 shadow-lg">
      <!-- Título de la sección -->
      <div class="card-header">
        <div class="card-title flex items-center">
          <i class="fas fa-credit-card text-white mr-2"></i>
          <span>Mis Tarjetas</span>
        </div>
      </div>

      <!-- Cargando tarjetas -->
      <div v-if="loading" class="card-body">
        <div class="space-y-4">
          <div class="flex space-x-4">
            <div class="skeleton-text w-3/4 h-6 bg-gray-300"></div>
            <div class="skeleton-text w-1/2 h-6 bg-gray-300"></div>
          </div>
          <div class="flex space-x-4">
            <div class="skeleton-text w-3/4 h-6 bg-gray-300"></div>
            <div class="skeleton-text w-1/2 h-6 bg-gray-300"></div>
          </div>
        </div>
      </div>

      <!-- Contenido de tarjetas -->
      <div v-else class="card-body">
        <!-- Mensaje si no hay tarjetas -->
        <div v-if="!cards.length" class="text-center text-gray-500">
          <i class="fas fa-info-circle"></i>
          <p>No ha registrado ninguna tarjeta</p>
        </div>

        <!-- Lista de tarjetas registradas -->
        <div v-else>
          <ul class="space-y-4">
            <li v-for="(card, index) in cards" :key="index">
              <div
                @click="addUpdateCard(card)"
                class="card-item p-4 bg-white shadow-md cursor-pointer hover:bg-gray-200"
              >
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-700">
                    {{ card.number }} - Exp {{ card.expDate }}
                    <p class="text-xs text-gray-500">{{ card.name }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Botón para agregar nueva tarjeta -->
        <div class="mt-4 text-center">
          <button @click="addUpdateCard()" class="btn btn-sm btn-success">
            <i class="fas fa-plus-circle mr-2"></i>
            Agregar Nueva Tarjeta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { useCurrentUser } from '@/stores/currentUser'
import { Firebase } from '@/utilities/firebase.service'

const userStore = useCurrentUser()
const firebaseSvc = new Firebase()

// Estado de carga y tarjetas (simulado)
const loading = ref(false)
const cards = ref<Card[]>([])

// Emitir evento para abrir el modal
const emit = defineEmits(['open-modal'])
const addUpdateCard = (card: Card | null = null) => {
  emit('open-modal', card as Card)
}

// OBTENER EL LISTADO DE TARJETAS DEL USUARIO
const getCards = () => {
  loading.value = true
  let path = `users/${userStore.currentUser?.uid}/cards`
  let query: never[] = []

  firebaseSvc
    .getCollectionData(path, query)
    .then((querySnapshot) => {
      cards.value = []
      querySnapshot.forEach((card) => {
        cards.value.push(card.data() as Card)
      })
    })
    .finally(() => (loading.value = false))
}

// Exponer el método `getCards`
defineExpose({
  getCards
})

onMounted(() => {
  getCards()
})
</script>

<style scoped>
.card-list-container {
  max-width: 700px; /* Ajustado para que tenga el mismo tamaño */
  margin: 0 auto; /* Centra el contenedor */
}

.card {
  border-radius: 0.5rem;
}

.card-header {
  background-color: #10143c;
  padding: 1rem;
}

.card-title {
  color: white;
  font-weight: bold;
}

.card-body {
  padding: 1.5rem;
}

.skeleton-text {
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

@keyframes skeleton-loading {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}

.card-item {
  border-radius: 0.375rem;
  background-color: #f9f9f9;
}

.card-item:hover {
  background-color: #f0f0f0;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.btn-success {
  background-color: #28a745;
  color: white;
}
</style>
