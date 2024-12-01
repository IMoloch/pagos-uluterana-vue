<template>
  <div class="max-w-lg mx-auto p-6">
    <!-- Tarjeta de datos -->
    <div class="card card-bordered shadow-lg bg-base-100">
      <div class="card-header">
        <div class="card-title flex items-center">
          <i class="fas fa-user text-white mr-2"></i>
          <span>Datos</span>
        </div>
      </div>
      <Toast
        v-if="toastVisible"
        :message="toastMessage"
        :color="toastColor"
        :duration="toastDuration"
      />
      <div class="card-body">
        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent="updateEmail">
          <!-- Nombre -->
          <div class="form-control">
            <label for="name" class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="input input-bordered w-full"
              placeholder="Introduce tu nombre"
              disabled
            />
          </div>

          <!-- Carnet -->
          <div class="form-control">
            <label for="carnet" class="label">
              <span class="label-text">Carnet</span>
            </label>
            <input
              id="carnet"
              type="text"
              v-model="carnet"
              class="input input-bordered w-full"
              placeholder="Introduce tu carnet"
              disabled
            />
          </div>

          <!-- Carrera -->
          <div class="form-control">
            <label for="carrera" class="label">
              <span class="label-text">Carrera</span>
            </label>
            <input
              id="carrera"
              type="text"
              v-model="carrera"
              class="input input-bordered w-full"
              placeholder="Introduce tu carrera"
              disabled
            />
          </div>

          <!-- Email -->
          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              id="email"
              type="text"
              v-model="email"
              class="input input-bordered w-full"
              placeholder="Introduce tu correo electrónico"
              @input="validateEmail"
            />
            <div class="text-red-500 mt-1 text-sm" v-if="emailTouched && !emailValid">
              Introduce un correo válido
            </div>
          </div>

          <!-- Mensaje informativo -->
          <div>
            <p class="text-sm text-gray-500">
              Puedes cambiar tu correo personal, el correo vinculado es donde se enviarán los
              comprobantes de pago.
            </p>
          </div>

          <!-- Botón para enviar -->
          <div class="form-control">
            <button type="submit" class="btn btn-primary w-full" :disabled="!emailValid">
              <i class="fas fa-envelope mr-2"></i>
              Cambiar Correo Personal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCurrentUser } from '@/stores/currentUser'
import { Firebase } from '@/utilities/firebase.service'
import Toast from '@/components/CustomToast.vue'

const toastVisible = ref(false)
const toastMessage = ref('')
const toastColor = ref('')
const toastDuration = ref(3000)

const userStore = useCurrentUser()
const firebaseSvc = new Firebase()

// Variables reactivas
const name = ref('')
const carnet = ref('')
const carrera = ref('')
const email = ref('')
const emailTouched = ref(false)
const emailValid = ref(true)
const successMessage = ref('')
const errorMessage = ref('')

// Obtener la información del usuario
const getUserInfo = async () => {
  try {
    const path = `users/${userStore.currentUser?.uid}`
    const userInfo = await firebaseSvc.getDocument(path)

    if (userInfo) {
      name.value = userInfo.name
      carnet.value = userInfo.carnet
      carrera.value = userInfo.carrera
      email.value = userInfo.email
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error)
  }
}

// Validar formato del correo electrónico
const validateEmail = () => {
  emailTouched.value = true
  emailValid.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
}

// Actualizar el correo personal en Firebase
const updateEmail = async () => {
  if (!emailValid.value) {
    errorMessage.value = 'El correo no es válido.'
    return
  }

  try {
    const path = `users/${userStore.currentUser?.uid}`
    await firebaseSvc.updateDocument(path, { email: email.value })
    showToast('Correo actualizado correctamente.', 'green', 3000)
    successMessage.value = 'Correo actualizado correctamente.'
  } catch (error) {
    console.error('Error al actualizar el correo:', error)
    errorMessage.value = 'Hubo un problema al actualizar el correo.'
  }
}

const showToast = (message: string, color: any, duration: number) => {
  toastMessage.value = message
  toastColor.value = color
  toastDuration.value = duration
  toastVisible.value = true

  // Reiniciar el estado después de mostrar el toast
  setTimeout(() => {
    toastVisible.value = false
  }, duration + 300) // Duración + animación
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
/* Estilos personalizados para feedback visual */
.text-sm {
  font-size: 0.875rem;
}
.text-red-500 {
  color: #f87171;
}
.text-green-500 {
  color: #10b981;
}
</style>
