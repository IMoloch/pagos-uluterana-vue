<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Firebase } from '@/utilities/firebase.service'
import { RouterLink, useRouter } from 'vue-router'
import { useCurrentUser } from '@/stores/currentUser'
import SpinnerOverlay from '@/components/SpinnerOverlay.vue'

const firebase = new Firebase()
const router = useRouter()
const currentUser = useCurrentUser()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const emailTouched = ref(false) // Estado para rastrear si el email fue tocado
const passwordTouched = ref(false) // Estado para rastrear si la contraseña fue tocada
const loading = ref(false) // Controla la visibilidad del spinner

const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Expresión regular para validar el formato del correo

const isEmailValid = computed(() => {
  if (emailTouched.value) {
    emailError.value = email.value.match(emailFormat) ? '' : 'Formato de correo inválido'
  }
  return !emailError.value
})

const isPasswordValid = computed(() => {
  if (passwordTouched.value) {
    passwordError.value = password.value ? '' : 'La contraseña no puede estar vacía'
  }
  return !passwordError.value
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value
})

const handleSubmit = async () => {
  if (isFormValid.value) {
    try {
      loading.value = true
      const userInfo = await firebase.signIn({
        email: email.value,
        password: password.value
      } as User)
      const path = `/users/${userInfo.user.uid}`
      firebase
        .getDocument(path)
        .then((userInfo) => {
          currentUser.saveCurrentUser(userInfo as User)
        })
        .finally(() => (loading.value = false))

      router.push({ name: 'home' }) // Redirigir a la página principal
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      alert('Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <!-- Spinner Overlay -->
  <spinnerOverlay :isLoading="loading" />
  <main>
    <div class="flex justify-center items-center m-5 p-2">
      <div class="space-y-5">
        <div class="max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-blue-900 px-6 py-4 mt-10 rounded-lg">
            <h2 class="text-white text-lg font-semibold">Iniciar Sesión</h2>
          </div>
          <div class="p-6 space-y-2 text-gray-700">
            <form @submit.prevent="handleSubmit">
              <div>
                <label for="email" class="text-lg font-semibold">Correo electrónico:</label>
                <input
                  type="email"
                  v-model="email"
                  id="email"
                  class="w-full p-2 border border-gray-300 rounded-md mb-10"
                  @blur="emailTouched = true"
                />
                <span v-if="emailTouched && emailError" class="error">{{ emailError }}</span>
              </div>
              <div>
                <label for="password" class="text-lg font-semibold">Contraseña:</label>
                <input
                  type="password"
                  v-model="password"
                  id="password"
                  class="w-full p-2 border border-gray-300 rounded-md mb-10"
                  @blur="passwordTouched = true"
                />
                <span v-if="passwordTouched && passwordError" class="error">{{
                  passwordError
                }}</span>
              </div>
              <button
                type="submit"
                :disabled="!isFormValid"
                class="bg-blue-900 text-white btn mb-10"
              >
                Ingresar
              </button>
              <p>
                ¿No tienes una cuenta?
                <RouterLink :to="{ name: 'signup' }"
                  ><a class="text-blue-700">Regístrate</a></RouterLink
                >
              </p>
            </form>
          </div>
        </div>
      </div>

      <!-- <div class="ml-10">
      <img src="\src\assets\logo-uls.png" alt="Logo ULS" class="w-96 h-auto">
    </div> -->
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 800px;
  max-width: 1024px;
  margin: 0 auto;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
