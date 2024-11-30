<template>
    <div class="max-w-lg mx-auto p-6">
      <!-- Tarjeta de datos -->
      <div class="card card-bordered shadow-lg bg-base-100">
        <div class="card-header">
          <div class="card-title flex items-center">
            <!-- Ícono de persona antes de Datos -->
            <i class="fas fa-user text-white mr-2"></i>
            <span>Datos</span>
          </div>
        </div>
  
        <div class="card-body">
          <!-- Formulario -->
          <form class="space-y-4">
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
              />
              <div class="text-red-500 mt-1 text-sm" v-if="emailTouched && !emailValid">
                Introduce un correo válido
              </div>
            </div>
  
            <!-- Mensaje informativo -->
            <div>
              <p class="text-sm text-gray-500">
                Puedes cambiar tu correo personal, el correo vinculado es donde se enviarán los comprobantes de pago.
              </p>
            </div>
  
            <!-- Botón para enviar -->
            <div class="form-control">
              <button type="submit" class="btn btn-primary w-full">
                <!-- Ícono de correo antes del texto -->
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

const userStore = useCurrentUser()
const firebaseSvc = new Firebase()

// Estado de carga y tarjetas (simulado)
const loading = ref(false)
  
  // Variables para validaciones (solo visuales por ahora)
  const emailTouched = ref(false)
  const emailValid = ref(true)

  const name = ref('')
  const carnet = ref('')
  const carrera = ref('')
  const email = ref('')

  // OBTENER LA INFORMACION DEL USUARIO
const getUserInfo = () => {
  loading.value = true
  let path = `users/${userStore.currentUser?.uid}`
  let query: never[] = []

  firebaseSvc
    .getDocument(path)
    .then((userInfo) => {
      console.log(userInfo);
      name.value = userInfo?.name
      carnet.value = userInfo?.carnet
      carrera.value = userInfo?.carrera
      email.value = userInfo?.email
    })
    .finally(() => (loading.value = false))
}

onMounted(() => {
  getUserInfo()
})
  </script>
  
  <style scoped>
  .card {
    max-width: 700px; /* Ajustado para que tenga el mismo tamaño */
    margin: 0 auto; /* Centra la tarjeta */
    border-radius: 0.5rem;
  }
  
  .card-header {
    background-color: #10143c; /* Color de la barra */
    border-bottom: 1px solid #ddd;
    padding: 1rem;
  }
  
  .card-title {
    color: white; /* Color del texto en la barra */
    font-weight: bold;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .form-control {
    margin-bottom: 1.5rem;
  }
  
  .label {
    font-size: 1rem;
    font-weight: 500;
  }
  
  .input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
  }
  
  .input-bordered {
    border-color: #ddd;
  }
  
  .input:focus {
    border-color: #4CAF50;
    outline: none;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-gray-500 {
    color: #6b7280;
  }
  
  .text-red-500 {
    color: #f87171;
  }
  
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    border-radius: 0.375rem;
    background-color: #10143c; /* Color del botón */
    color: white;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #10143c; /* Color del botón */
  }
  
  .btn i {
    font-size: 1.25rem;
  }
  </style>
  