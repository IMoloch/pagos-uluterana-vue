<template>
  <div class="profile-view-container p-4">
    <!-- Formulario de perfil -->
    <ProfileForm />

    <!-- Agregar el componente CardList debajo del formulario -->
    <CardList ref="cardListRef" @open-modal="openModal" />

    <!-- Modal para agregar/actualizar tarjeta -->
    <AddUpdateCardModal
      :isOpen="isModalOpen"
      :card="selectedCard"
      @save="handleSaveCard"
      @delete="handleDeleteCard"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar el componente ProfileForm, CardList y AddUpdateModal
import ProfileForm from '@/components/ProfileForm.vue'
import CardList from '@/components/CardList.vue'
import AddUpdateCardModal from '@/components/AddUpdateCardModal.vue'
import { Firebase } from '@/utilities/firebase.service'
import { useCurrentUser } from '@/stores/currentUser'

const firebase = new Firebase()
const currentUser = useCurrentUser()
// Estado para controlar la visibilidad del modal y la tarjeta seleccionada
const isModalOpen = ref(false)
const selectedCard = ref<Card>()
const cardListRef = ref() // Referencia al componente CardList

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

const handleSaveCard = async (card: Card) => {
  const path = `users/${currentUser.currentUser?.uid}/cards/${card.id || ''}`
  if (card.id) {
    await firebase.updateDocument(path, card)
  } else {
    const newCardRef = await firebase.addDocument(
      `users/${currentUser.currentUser?.uid}/cards`,
      card
    )
    card.id = newCardRef.id // Asignar el ID generado a la nueva tarjeta
  }
  closeModal()
  cardListRef.value.getCards() // Refrescar la lista de tarjetas
}

// Manejar la eliminación de una tarjeta
const handleDeleteCard = async (card: Card) => {
  const path = `users/${currentUser.currentUser?.uid}/cards/${card.id}`
  await firebase.deleteDocument(path)
  closeModal()
  cardListRef.value.getCards() // Refrescar la lista de tarjetas
}
</script>

<style scoped>
.profile-view-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
