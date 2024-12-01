<template>
  <div class="container flex justify-center items-center m-5 p-2">
    <div class="flex flex-col space-y-5 mr-40">
      <div class="max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-blue-900 px-6 py-4">
          <h2 class="text-white text-lg font-semibold">Concepto de pago</h2>
        </div>
        <div class="p-6 space-y-2 text-gray-700">
          <p>Fecha actual: {{ fechaActual.toLocaleDateString() }}</p>
          <p>Última fecha de pago: {{ ultimaFechaDePago }}</p>
          <p>Mes a pagar: {{ mesPagar }}</p>
          <p>Cantidad a pagar: $45 (No aplica Mora)</p>
        </div>
      </div>

      <div class="max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-blue-900 px-6 py-4">
          <h2 class="text-white text-lg font-semibold">Información del Estudiante</h2>
        </div>
        <div class="p-6 space-y-2 text-gray-700">
          <p>Estudiante: {{ studentInfo.name }}</p>
          <p>Carnet: {{ studentInfo.carnet }}</p>
          <p>Se enviará un email a su correo asociado.</p>
        </div>
      </div>
    </div>

    <div class="ml-10">
      <img src="\src\assets\logo-uls.png" alt="Logo ULS" class="w-96 h-auto" />
    </div>
  </div>

  <div class="mt-20 flex justify-center items-end w-full">
    <button @click="handleGeneratePDF" class="btn btn-primary w-60">Pagar Ciclo</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMonthStore } from '@/stores/month'
import { useCurrentUser } from '@/stores/currentUser'
import { Firebase } from '@/utilities/firebase.service'
import { usePdf } from '../utilities/pdf.service' // Importa el servicio para generar PDF

const selectedMonth = useMonthStore()
const firebase = new Firebase()
// Props del componente
const props = defineProps<{
  ultimaFechaDePago: string
}>()

// Usa el servicio para generar PDF
const { generarPdf } = usePdf()

// Datos del componente
const fechaActual = ref(new Date())
const studentInfo = useCurrentUser().getCurrentUser()

// Cálculo del mes a pagar
const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]
const mesPagar = computed(() => {
  const mesNumero = props.ultimaFechaDePago.split('/')[1] // Extrae el mes (número)
  return meses[+mesNumero - 1] || 'Mes no válido'
})

// Generar el PDF al hacer clic en el botón
const handleGeneratePDF = async () => {
  const downloadURL = await generarPdf(
    props.ultimaFechaDePago, // Última fecha de pago
    mesPagar.value, // Mes a pagar
    fechaActual.value, // Fecha actual
    studentInfo // Información del estudiante
  )

  if (downloadURL) {
    console.log('PDF disponible en:', downloadURL)
    await updatePaidInfo(downloadURL)
  }
}

// GENERA EL PATH PARA LA ACUTALIZACIÓN DE DATOS EN FIRESTORE
const getPath = () => {
  const path: string = `users/${studentInfo.uid}/semesters/${semester.cycle}-${semester.year}/payments/${selectedMonth.getMonth().id}`
  return path
}
</script>
