<script setup lang="ts">
import { ref, computed } from 'vue'
import { Firebase } from '@/utilities/firebase.service'
import { RouterLink, useRouter } from 'vue-router'

const firebase = new Firebase()
const router = useRouter()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Expresión regular para validar el formato del correo

const isEmailValid = computed(() => {
  emailError.value = email.value.match(emailFormat) ? '' : 'Formato de correo inválido'
  return !emailError.value
})

const isPasswordValid = computed(() => {
  passwordError.value = password.value ? '' : 'La contraseña no puede estar vacía'
  return !passwordError.value
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value
})

const handleSubmit = async () => {
  if (isFormValid.value) {
    try {
      await firebase.signIn({ email: email.value, password: password.value } as User)
      router.push({ name: 'home' }) // Redirigir a la página principal
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      alert('Error al iniciar sesión. Verifica tus credenciales.')
    }
  }
}
</script>

<template>
  <main>
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Correo electrónico:</label>
        <input type="email" v-model="email" id="email" />
        <span class="error">{{ emailError }}</span>
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" />
        <span class="error">{{ passwordError }}</span>
      </div>
      <button type="submit" :disabled="!isFormValid">Ingresar</button>
      <p>No tienes una cuenta, <RouterLink to="">regístrate</RouterLink></p>
    </form>
  </main>
</template>

<style scoped>
main {
  max-width: 400px;
  margin: 0 auto;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
