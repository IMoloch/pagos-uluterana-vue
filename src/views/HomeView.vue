<template>
  <main>
  </main>
</template>

<script setup lang="ts">
import { Firebase } from '@/utilities/firebase.service';
import { ref } from 'vue';

const firebaseSvc = new Firebase
const user = ref<User>()
const loading = ref(false)
const currentDate = new Date()

// OBTENER MESES DEL USUARIO
// function getMonths() {
//   loading.value = true
//   let path = `users/${user.value.uid}/semesters/${semester.value.cycle}-${this.semester.year}/payments`
//   let query = [
//     orderBy('dueDate', 'asc'),
//     where('paid', "==", false)
//   ]

//   let sub = firebaseSvc.getCollectionData(path, query).subscribe({
//     next: (res: any) => {

//     }
//   })
// }

// OBTENER EL TOTAL FEE Y AGREGARLO AL ARRAY MONTHS
// function getFee(){
//   this.months.forEach((month) => {
//     let totalFee = month.charges.reduce((accumulator, currentNumber) => {
//       return accumulator + currentNumber.fee
//     }, 0)
//     month.totalFee = totalFee
//   })
// }
</script>