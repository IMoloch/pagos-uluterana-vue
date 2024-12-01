<template>
  <main class="flex flex-col justify-center items-center min-h-screen bg-gray-100">


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

    <div class="grid grid-cols-1 gap-6 w-full max-w-4xl px-4">
    <div class="card bg-base-100  shadow-xl w-full" v-for="(month, index) of months" :key="index">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <h2 class="card-title text-lg font-semibold text-gray-700">
            {{ month.id }}
          </h2>
          <!-- Checkbox para marcar completado -->
          <input
              type="checkbox"
              class="checkbox checkbox-primary"
              v-model="month.completed"
              @change="updateProgress"
            />
          </div>
          <p class="text-gray-600">{{ month.charges[0] }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">Detalle completo</button>
          </div>
        </div>
      <!-- <div @click="saveMonth(month as Month)">
        {{ month }}
      </div> -->
    </div>
  </div>
  </main>
</template>

<script setup lang="ts">
import { useCurrentUser } from '@/stores/currentUser'
import { useMonthStore } from '@/stores/month'
import { Firebase } from '@/utilities/firebase.service'
import { orderBy, where } from 'firebase/firestore'
import { onMounted, ref, computed} from 'vue'

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
    .getCollectionData(path, query)
    .then((querySnapshot) => {
      querySnapshot.forEach((month) => {
        months.value.push(month.data() as Month)
      })
      console.log(months.value) 
      getFee()
    })
    .finally(() => (loading.value = false))
}

function saveMonth(month: Month) {
  monthStore.saveMonth(month as Month)
  console.log(monthStore.getMonth())
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
const completedCount = computed(() =>
  months.value.filter((month) => month.completed).length
)

// Calcular el porcentaje de progreso
const progress = computed(() =>
  months.value.length > 0
    ? Math.round((completedCount.value / months.value.length) * 100)
    : 0
)

// Actualizar progreso (opcional, si necesitas alguna acción extra)
function updateProgress() {
  console.log('Progreso actualizado:', progress.value + '%')
}


</script>


<style scoped>
/* Personalización adicional */
.main {
  background-color: #f8fafc;
}
.checkbox {
  transform: scale(1.2);
}
.card {
  transition: box-shadow 0.3s ease;
}
.card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}
</style>