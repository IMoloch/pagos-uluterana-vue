<template>
  <div class="container flex mx-auto p-4">
    <!-- Columna izquierda: Formulario y listado de meses -->
    <div class="flex-grow basis-2/3 pr-4">
      <!-- Formulario para seleccionar ciclo -->
      <form @submit.prevent="getMonths" class="mb-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Selecciona Ciclo</span>
          </label>
          <select v-model="selectedSemester" class="select select-bordered" @change="getMonths">
            <option :value="null" v-if="!semesters.length && !loadingSemesters">
              No posee ciclos registrados
            </option>
            <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
              {{ semester.id }}
            </option>
          </select>
        </div>
      </form>

      <!-- Card que lista los meses -->
      <div v-if="selectedSemester" class="card bg-white shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg font-bold mb-4">Meses</h2>

          <!-- Placeholder mientras se cargan los meses -->
          <div v-if="loadingMonths" class="space-y-4">
            <div v-for="index in 5" :key="index" class="flex justify-between">
              <div class="flex-grow space-y-2">
                <div class="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div class="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div class="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          <!-- Listado de meses -->
          <div v-else class="accordion accordion-bordered">
            <div v-for="month in months" :key="month.id" class="accordion-item">
              <input type="checkbox" class="peer hidden" :id="'accordion-' + month.id" />
              <label
                :for="'accordion-' + month.id"
                class="accordion-title flex justify-between items-center p-4 bg-gray-100 cursor-pointer border rounded-lg mb-2"
              >
                <span>
                  {{ month.id.toUpperCase() }} -
                  {{ month.paid ? 'Pagado' : 'Pendiente' }}
                </span>
                <span class="text-right font-bold"> ${{ month.totalFee }} </span>
              </label>
              <div class="accordion-body hidden peer-checked:block bg-white rounded-lg shadow p-4">
                <!-- Si ya se ha pagado -->
                <div v-if="month.paid">
                  <p>Pagado en: {{ month.paidDate }}</p>
                  <p v-if="month.card">
                    Con tarjeta: {{ maskCardNumber(month.cardNumber) }} - Exp
                    {{ month.cardExpDate }}
                  </p>
                  <p
                    v-if="month.ticketUrl"
                    class="text-blue-500 cursor-pointer"
                    @click="openPDF(month.ticketUrl)"
                  >
                    Pulsa para ver comprobante de pago
                  </p>
                  <p v-else>Pago no realizado con tarjeta</p>
                </div>
                <!-- Si no se ha pagado -->
                <div v-else>
                  <p>Aun no se ha realizado el pago de este mes</p>
                  <p>Realizalo antes de: {{ month.dueDate }}</p>
                  <p class="text-blue-500 cursor-pointer" @click="goToPayment(month)">
                    Pulsa para realizar el pago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Columna derecha: Imagen -->
    <div class="flex-grow-0 basis-1/3 flex justify-center items-center w-96">
      <img src="/src/assets/logo-uls.png" alt="Logo ULS" class="h-auto rounded-lg shadow-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFirebaseService } from '@/utilities/firebase.service'
import { useCurrentUser } from '@/stores/currentUser'
import { useMonthStore } from '@/stores/month'
import router from '@/router'
import { orderBy } from 'firebase/firestore'

// Instancia de Firebase
const firebaseSvc = useFirebaseService()
const selectetMonth = useMonthStore()

// Datos reactivos
const semesters = ref<{ id: string }[]>([])
const months = ref<Month[]>([])
const selectedSemester = ref<string | null>(null)
const loadingSemesters = ref(false)
const loadingMonths = ref(false)
const userInfo = ref<User>()

// Obtener ciclos disponibles desde Firestore
const getSemesters = async () => {
  loadingSemesters.value = true
  let path = `users/${userInfo.value?.uid}/semesters`
  try {
    // Llama a la colección "semesters" desde Firestore
    const data = await firebaseSvc.getCollectionData(path)
    semesters.value = data.map((doc: any) => ({
      id: doc.id
    }))
    console.log(semesters.value)
  } catch (error) {
    console.error('Error al obtener ciclos:', error)
  } finally {
    loadingSemesters.value = false
  }
}

// Obtener meses de un ciclo específico desde Firestore
const getMonths = async () => {
  if (!selectedSemester.value) return
  let query = [orderBy('dueDate', 'asc')]
  loadingMonths.value = true
  try {
    let path = `users/${userInfo.value?.uid}/semesters/${selectedSemester.value}/payments`
    const data = await firebaseSvc.getCollectionData(path, ...query)
    months.value = data.map((month) => month as Month)
    getFee()
  } catch (error) {
    console.error('Error al obtener meses:', error)
  } finally {
    loadingMonths.value = false
  }
}

// OBTENER EL TOTAL FEE Y AGREGARLO AL ARRAY MONTHS
function getFee() {
  months.value.forEach((month) => {
    let totalFee = month.charges.reduce((accumulator, currentNumber) => {
      return accumulator + currentNumber.fee
    }, 0)
    month.totalFee = totalFee
  })
}

// Abrir un comprobante en formato PDF
const openPDF = (url: string) => {
  window.open(url, '_blank')
}

// Navegar a la página de pago
const goToPayment = (month: Month) => {
  selectetMonth.saveMonth(month)
  router.push({ name: 'DetailPay' })
}

const maskCardNumber = (cardNumber?: string): string => {
  // Validar el formato del número de tarjeta
  if (cardNumber?.length !== 19 || !/^(\d{4} \d{4} \d{4} \d{4})$/.test(cardNumber)) {
    return cardNumber // Devolver el número sin cambios si no tiene el formato esperado
  }
  // Reemplazar los primeros 12 dígitos con asteriscos
  return '**** **** **** ' + cardNumber.slice(-4)
}

// Montar los datos iniciales al cargar el componente
onMounted(() => {
  userInfo.value = useCurrentUser().getCurrentUser()
  getSemesters()
})
</script>
