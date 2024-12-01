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
      @save="handleUpdateCard"
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
import { Firebase } from '@/utilities/firebase.service';
import { useCurrentUser } from '@/stores/currentUser';

const firebase = new Firebase()
const currentUser = useCurrentUser()
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
  console.log(selectedCard.value);
  
  const path = `users/${currentUser.currentUser?.uid}/cards/${newValue.id}`
  firebase.updateDocument(path, selectedCard.value as Card).then((res) => {
    console.log("tarjeta actualizada")
    
  })
}

const handleDeleteCard = (selectedCard: Card) => {
  console.log(selectedCard);
  const path = `users/${currentUser.currentUser?.uid}/cards/${selectedCard.id}`
  firebase.deleteDocument(path).then((res) => {
    console.log("tarjeta eliminada")
    
  })
}
</script>

<style scoped>
.profile-view-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
