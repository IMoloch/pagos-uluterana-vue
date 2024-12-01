<template>
  <main>
    <SpinnerOverlay :isLoading="loading" />
    <div class="flex justify-center items-center m-5 p-2">
      <div class="space-y-5 max-w-lg w-full">
        <div class="max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <!-- Encabezado -->
          <div class="bg-blue-900 px-6 py-4 mt-10 rounded-lg flex items-center justify-between">
            <BackButton />
            <h2 class="text-white text-lg font-semibold flex-grow text-center">Registro</h2>
          </div>

          <!-- Formulario -->
          <div class="p-6 space-y-4 text-gray-700">
            <form @submit.prevent="createStudent" class="space-y-6">
              <!-- Carrera -->
              <div>
                <label for="carrera" class="block text-lg font-semibold">Carrera</label>
                <select
                  id="carrera"
                  v-model="form.carrera"
                  class="select select-bordered w-full"
                  :class="{ 'border-red-500': formSubmitted && errors.carrera }"
                >
                  <option disabled value="">Selecciona la Carrera</option>
                  <option v-for="carrera in carreras" :key="carrera" :value="carrera">
                    {{ carrera }}
                  </option>
                </select>
                <p v-if="formSubmitted && errors.carrera" class="text-red-500 text-sm mt-1">
                  {{ errors.carrera }}
                </p>
              </div>

              <!-- Carnet -->
              <div>
                <label for="carnet" class="block text-lg font-semibold">Carnet</label>
                <input
                  id="carnet"
                  type="text"
                  v-model="form.carnet"
                  class="input input-bordered w-full"
                  :class="{ 'border-red-500': formSubmitted && errors.carnet }"
                  placeholder="Ejemplo: 1234567890"
                />
                <p v-if="formSubmitted && errors.carnet" class="text-red-500 text-sm mt-1">
                  {{ errors.carnet }}
                </p>
              </div>

              <!-- Nombre -->
              <div>
                <label for="name" class="block text-lg font-semibold">Nombre</label>
                <input
                  id="name"
                  type="text"
                  v-model="form.name"
                  class="input input-bordered w-full"
                  :class="{ 'border-red-500': formSubmitted && errors.name }"
                  placeholder="Nombre completo"
                />
                <p v-if="formSubmitted && errors.name" class="text-red-500 text-sm mt-1">
                  {{ errors.name }}
                </p>
              </div>

              <!-- Correo -->
              <div>
                <label for="email" class="block text-lg font-semibold">Correo</label>
                <input
                  id="email"
                  type="email"
                  v-model="form.email"
                  class="input input-bordered w-full"
                  :class="{ 'border-red-500': formSubmitted && errors.email }"
                  placeholder="Correo electrónico"
                />
                <p v-if="formSubmitted && errors.email" class="text-red-500 text-sm mt-1">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Contraseña -->
              <div>
                <label for="password" class="block text-lg font-semibold">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  v-model="form.password"
                  class="input input-bordered w-full"
                  :class="{ 'border-red-500': formSubmitted && errors.password }"
                  placeholder="Contraseña"
                />
                <p v-if="formSubmitted && errors.password" class="text-red-500 text-sm mt-1">
                  {{ errors.password }}
                </p>
              </div>

              <!-- Botón de registro -->
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="bg-blue-900 text-white btn w-full disabled:opacity-50"
              >
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import SpinnerOverlay from '@/components/spinnerOverlay.vue'
import { useFirebaseService } from '@/utilities/firebase.service'
import { useCurrentUser } from '@/stores/currentUser'
import router from '@/router'
import BackButton from '@/components/BackButton.vue'

const firebase = useFirebaseService()
const currentUser = useCurrentUser()
const form = reactive({
  uid: '',
  carrera: '',
  carnet: '',
  name: '',
  email: '',
  password: ''
})

const carreras = [
  'Ingeniería Agroecológica',
  'Licenciatura en Administración de Empresas',
  'Licenciatura en Ciencias de la Computación',
  'Licenciatura en Ciencias Jurídicas',
  'Licenciatura en Contaduría Pública',
  'Técnico en Desarrollo de Aplicaciones Informáticas',
  'Técnico en Ingeniería Agroecológica',
  'Licenciatura en Idioma Inglés',
  'Licenciatura en Psicología',
  'Licenciatura en Trabajo Social',
  'Licenciatura en Teología',
  'Maestría en Gerencia Social'
] // Carreras de ejemplo

const errors = reactive({
  carrera: '',
  carnet: '',
  name: '',
  email: '',
  password: ''
})

const formSubmitted = ref(false)
const loading = ref(false) // Controla la visibilidad del spinner

const validateForm = () => {
  errors.carrera = form.carrera ? '' : 'Este campo es requerido'
  errors.carnet = form.carnet
    ? form.carnet.length === 10
      ? ''
      : 'El Carnet debe ser de 10 caracteres de largo'
    : 'Este campo es requerido'
  errors.name = form.name
    ? form.name.length >= 4
      ? ''
      : 'El nombre debe contener al menos 4 caracteres'
    : 'Este campo es requerido'
  errors.email = form.email
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? ''
      : 'Ingrese un correo válido'
    : 'El correo es requerido'
  errors.password = form.password ? '' : 'Ingrese la contraseña'
}

const isFormValid = computed(() => {
  validateForm()
  return !errors.carrera && !errors.carnet && !errors.name && !errors.email && !errors.password
})

const createStudent = async () => {
  formSubmitted.value = true
  validateForm()
  if (!isFormValid.value) return

  loading.value = true // Mostrar el spinner
  form.carnet = form.carnet.toUpperCase()

  let user = {
    email: `${form.carnet.toLowerCase()}@uls.edu.sv`,
    password: form.password
  }
  firebase
    .signUp(user as User)
    .then(async (res) => {
      let uid = res.user.uid
      form.uid = uid
      setUserInfo(uid)
    })
    .finally(() => {
      loading.value = false
    })
}

// CREA EL DOCUMENTO EN LA COLECCION USERS
const setUserInfo = async (uid: string) => {
  loading.value = true
  let path = `users/${uid}`
  form.password = ''

  firebase
    .setDocument(path, form)
    .then(async (res) => {
      currentUser.saveCurrentUser(form as User)
      await addSemester()
      router.push({ name: 'home' }) // Redirigir a la página principal
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

const semester = ref({
  cycle: 2,
  year: 2024
})
const currentDate = new Date()

const addSemester = async () => {
  const path = `users/${form.uid}/semesters/${semester.value.cycle}-${semester.value.year}`

  loading.value = true
  try {
    await firebase.setDocument(path, semester.value)
    await addMonths()
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const addMonths = async () => {
  const cycleMonths =
    semester.value.cycle === 1
      ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio']
      : ['julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  const inscripcionPath = `users/${form.uid}/semesters/${semester.value.cycle}-${semester.value.year}/payments/inscripcion`
  const initialMonth: Month = {
    dueDate: `${semester.value.year}/${semester.value.cycle === 1 ? '01' : '07'}/30`,
    paid: false,
    charges: [
      { description: 'Matricula Ordinaria', fee: 30 },
      { description: 'Derecho de Prácticas', fee: 15 },
      { description: 'Gastos Administrativos', fee: 16 },
      { description: 'Seguro Accidentes', fee: 6.5 }
    ]
  }

  await firebase.setDocument(inscripcionPath, initialMonth)

  cycleMonths.forEach(async (monthId, i) => {
    let path = `users/${form.uid}/semesters/${semester.value.cycle}-${semester.value.year}/payments/${monthId}`
    let dueDate: string

    if (semester.value.cycle === 2 && monthId === 'diciembre') {
      dueDate = `${semester.value.year + 1}/01/05`
    } else {
      const monthOffset = semester.value.cycle === 1 ? i + 2 : i + 8
      dueDate = `${semester.value.year}/${monthOffset.toString().padStart(2, '0')}/05`
    }

    const month: Month = {
      dueDate,
      paid: false,
      charges: [{ description: 'Cuota Ordinaria', fee: 45 }]
    }

    const parsedDueDate = new Date(month.dueDate)
    if (currentDate > parsedDueDate) {
      month.charges.push({ description: 'Mora', fee: 5 })
    }

    await firebase.setDocument(path, month)
  })
}
</script>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
}
</style>
