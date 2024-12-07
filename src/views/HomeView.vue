<template>
  <main class="flex flex-col justify-start items-center min-h-screen bg-white">
    <!-- Indicador de progreso general -->
    <div class="w-full max-w-4xl my-6 px-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-700 font-semibold">Progreso de pagos:</span>
        <span>{{ completedCount }} / {{ months.length }} completados</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div
          class="bg-blue-500 h-4 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Grid de botones -->
    <div class="grid grid-cols-1 gap-6 w-full max-w-4xl px-4">
      <button
        v-for="(month, index) in months"
        :key="index"
        class="btn btn-lg w-full text-left shadow-lg flex flex-col items-start justify-center p-4"
        :class="{ 'btn-disabled': month.paid, 'btn-primary': month.paid }"
        :disabled="month.paid"
        @click="saveMonth(month)"
      >
        <div class="flex items-center justify-between w-full">
          <h2 class="text-lg font-semibold text-gray-700">
            {{ month.id?.toLocaleUpperCase() }} - ${{ month.totalFee }}
          </h2>
          <p class="text-gray-600 mt-2">Vence: {{ month.dueDate }}</p>
        </div>
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import { useCurrentUser } from '@/stores/currentUser'
import { useMonthStore } from '@/stores/month'
import { Firebase } from '@/utilities/firebase.service'
import { orderBy, where } from 'firebase/firestore'
import { onMounted, ref, computed } from 'vue'
import DetailPay from './DetailPay.vue'

const currentUser = useCurrentUser()
const monthStore = useMonthStore()
const firebaseSvc = new Firebase()
const userInfo = ref<User>()
const months = ref<Month[]>([])
const loading = ref(false)
const currentDate = new Date()
const semester = {
  year: currentDate.getFullYear(),
  cycle: currentDate.getMonth() < 7 ? 1 : 2
}

// OBTENER MESES DEL USUARIO
function getMonths() {
  loading.value = true
  let path = `users/${userInfo.value?.uid}/semesters/${2}-${semester.year}/payments`
  let query = [orderBy('dueDate', 'asc')]

  firebaseSvc
    .getCollectionData(path, ...query)
    .then((documents) => {
      months.value = documents.map((month) => month as Month)
      console.log(months.value)
      getFee()
    })
    .finally(() => (loading.value = false))
}

function saveMonth(month: Month) {
  monthStore.saveMonth(month as Month)
  console.log('Mes guardado:', monthStore.getMonth())
  router.push({ name: 'DetailPay' })
}

onMounted(() => {
  userInfo.value = currentUser.getCurrentUser()
  getMonths()
})

// OBTENER EL TOTAL FEE Y AGREGARLO AL ARRAY MONTHS
function getFee() {
  months.value.forEach((month) => {
    let totalFee = month.charges.reduce((accumulator, currentNumber) => {
      return accumulator + currentNumber.fee
    }, 0)
    month.totalFee = totalFee
  })
}

// Contar cuántos meses están completados
const completedCount = computed(() => months.value.filter((month) => month.paid).length)

// Calcular el porcentaje de progreso
const progress = computed(() =>
  months.value.length > 0 ? Math.round((completedCount.value / months.value.length) * 100) : 0
)
</script>

<style scoped>
/* Personalización adicional */
.main {
  background-color: #f8fafc;
}
.card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}
</style>
