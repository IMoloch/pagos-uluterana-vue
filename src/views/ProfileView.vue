<template>
  <div class="profile-view-container p-4">
    <!-- Formulario de perfil -->
    <ProfileForm />

    <!-- Agregar el componente CardList debajo del formulario -->
    <CardList @open-modal="openModal" />

    <!-- Modal para agregar/actualizar tarjeta -->
    <AddUpdateCardModal
      :isOpen="isModalOpen"
      :card="selectedCard"
      @close="closeModal"
      @update:card="handleUpdateCard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar el componente ProfileForm, CardList y AddUpdateModal
import ProfileForm from '@/components/ProfileForm.vue'
import CardList from '@/components/CardList.vue'
import AddUpdateCardModal from '@/components/AddUpdateCardModal.vue'

// Estado para controlar la visibilidad del modal y la tarjeta seleccionada
const isModalOpen = ref(false)
const selectedCard = ref<Card>()

// Función para abrir el modal con la tarjeta seleccionada o agregar una nueva
const openModal = (card?: Card) => {
  if (card) selectedCard.value = card
  isModalOpen.value = true
}

// Función para cerrar el modal
const closeModal = () => {
  isModalOpen.value = false
  selectedCard.value = {
    id: '',
    number: '',
    name: '',
    expDate: '',
    cvv: ''
  }
}

const handleUpdateCard = (newValue: Card) => {
  selectedCard.value = newValue
}
</script>

<style scoped>
.profile-view-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
