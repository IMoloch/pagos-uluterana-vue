<template>
  <main>
    <div class="card bg-base-100 w-fit shadow-xl" v-for="(month, index) of months" :key="index">
      <div @click="saveMonth(month as Month)">
        {{ month }}
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCurrentUser } from '@/stores/currentUser'
import { useMonthStore } from '@/stores/month'
import { Firebase } from '@/utilities/firebase.service'
import { orderBy, where } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

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
</script>
