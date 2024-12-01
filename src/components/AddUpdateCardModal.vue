<template>
  <div
    v-if="isOpen"
    class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    @click.self="closeModal"
  >
    <div class="modal-container bg-white p-5 rounded-lg relative shadow-lg max-w-md w-full">
      <!-- Franja azul superior -->
      <div
        class="modal-header p-4 text-center flex items-center justify-center relative"
        style="background-color: #10143c; border-radius: 8px 8px 0 0"
      >
        <h2 class="text-white font-bold text-lg">
          {{ isEditMode ? 'Actualizar Tarjeta' : 'Agregar Tarjeta' }}
        </h2>
        <!-- Botón de cierre centrado en la franja -->
        <button
          class="close-button absolute right-4 text-white hover:text-gray-300"
          @click="closeModal"
        >
          ✖
        </button>
      </div>

      <!-- Formulario de tarjeta -->
      <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
        <div class="form-group">
          <label class="block font-semibold mb-1">Número de tarjeta {{}}</label>
          <input
            type="text"
            v-model="cardNumber"
            @input="formatCardNumber"
            required
            class="input input-bordered w-full"
            maxlength="19"
            placeholder="1234 5678 1234 5678"
          />
          <small v-if="errors.cardNumber" class="text-red-500">{{ errors.cardNumber }}</small>
        </div>

        <div class="form-group">
          <label class="block font-semibold mb-1">Nombre de propietario</label>
          <input
            type="text"
            v-model="cardOwner"
            @input="validateCardOwner"
            required
            class="input input-bordered w-full"
          />
          <small v-if="errors.cardOwner" class="text-red-500">{{ errors.cardOwner }}</small>
        </div>

        <div class="form-group">
          <label class="block font-semibold mb-1">Fecha de expiración</label>
          <input
            type="text"
            v-model="expirationDate"
            @input="validateExpirationDate"
            placeholder="MM/AA"
            required
            class="input input-bordered w-full"
          />
          <small v-if="errors.expirationDate" class="text-red-500">{{
            errors.expirationDate
          }}</small>
        </div>

        <!-- Campo de CVV (solo para agregar) -->
        <div class="form-group" v-if="!isEditMode">
          <label class="block font-semibold mb-1">Código de seguridad (CVV)</label>
          <input
            type="text"
            v-model="cvv"
            @input="validateCVV"
            maxlength="3"
            placeholder="123"
            required
            class="input input-bordered w-full"
          />
          <small v-if="errors.cvv" class="text-red-500">{{ errors.cvv }}</small>
        </div>

        <button
          type="submit"
          :class="isEditMode ? 'btn btn-primary w-full' : 'btn btn-success w-full'"
        >
          {{ isEditMode ? 'ACTUALIZAR TARJETA' : 'AGREGAR TARJETA' }}
        </button>
      </form>

      <!-- Botón para eliminar tarjeta en modo edición -->
      <button v-if="isEditMode" @click="handleDelete" class="btn btn-error w-full mt-4">
        ELIMINAR TARJETA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  isOpen: Boolean
  card: Card | undefined // Tarjeta seleccionada (si existe)
  mode: Boolean
}>()

const emit = defineEmits(['close', 'save', 'delete'])

const cardNumber = ref('')
const cardOwner = ref('')
const expirationDate = ref('')
const cvv = ref('')
const id = ref('')

const errors = ref({ cardNumber: '', cardOwner: '', expirationDate: '', cvv: '' })
const isEditMode = computed(() => props.mode === true)
watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
      cardNumber.value = newCard.number
      cardOwner.value = newCard.name
      expirationDate.value = newCard.expDate
      cvv.value = newCard.cvv || ''
      id.value = newCard.id || ''
    } else {
      // Limpiar el objeto cuando no hay tarjeta
      cardNumber.value = ''
      cardOwner.value = ''
      expirationDate.value = ''
      cvv.value = ''
      id.value = ''
    }
  },
  { immediate: true } // Ejecutar inmediatamente cuando el componente se monta
)

const formatCardNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Remueve todos los espacios y luego agrega un espacio cada cuatro dígitos
  cardNumber.value = target.value
    .replace(/\s+/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim()
  validateCardNumber()
}

const validateCardNumber = () => {
  errors.value.cardNumber = /^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber.value)
    ? ''
    : 'El número de tarjeta debe tener 16 dígitos en formato 1234 5678 1234 5678.'
}

const validateCardOwner = () => {
  errors.value.cardOwner = /^[A-Za-z\s]+$/.test(cardOwner.value)
    ? ''
    : 'El nombre solo debe contener letras y espacios.'
}

const validateExpirationDate = () => {
  errors.value.expirationDate = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate.value)
    ? ''
    : 'La fecha de expiración debe estar en formato MM/AA.'
}

const validateCVV = () => {
  errors.value.cvv = /^\d{3}$/.test(cvv.value) ? '' : 'El CVV debe tener 3 dígitos.'
}

const handleSubmit = () => {
  validateCardNumber()
  validateCardOwner()
  validateExpirationDate()
  if (!isEditMode.value) validateCVV()

  if (!Object.values(errors.value).some((error) => error !== '')) {
    const cardData = {
      number: cardNumber.value.replace(/\s+/g, ''), // Guarda el número sin espacios
      name: cardOwner.value,
      expDate: expirationDate.value,
      cvv: cvv.value,
      id: id.value
    }
    emit('save', cardData)
    emit('close')
  }
}

// Función para cerrar el modal
const closeModal = () => {
  emit('close')
}

// Manejar el evento de tecla ESC
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Agregar y remover el evento de teclado
onMounted(() => {
  window.addEventListener('keydown', handleEscKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscKey)
})

const handleDelete = () => {
  emit('delete', props.card)
  emit('close')
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  border-radius: 8px;
}

.modal-header {
  position: relative;
}

.close-button {
  font-size: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.btn-primary {
  background-color: #10143c;
  color: white;
}

.btn-error {
  background-color: #e3342f;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}
</style>
