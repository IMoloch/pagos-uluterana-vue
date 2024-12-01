<template>
  <div class="container flex justify-center items-center min-w-full m-5 p-2">
    <div class="flex flex-col space-y-5 mr-40">
      <div class="max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-blue-900 px-6 py-4">
          <h2 class="text-white text-lg font-semibold">Concepto de pago</h2>
        </div>
        <div class="p-6 space-y-2 text-gray-700">
          <p>Fecha actual: {{ fechaActual.toLocaleDateString() }}</p>
          <p>Última fecha de pago: {{ selectedMonth.dueDate }}</p>
          <p>Mes a pagar: {{ selectedMonth.id?.toLocaleUpperCase() }}</p>
          <p>Cantidad a pagar: ${{ selectedMonth.totalFee }}</p>
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
          <p>{{ studentInfo.email }}</p>
        </div>
      </div>
    </div>

    <div class="ml-10">
      <img src="\src\assets\logo-uls.png" alt="Logo ULS" class="w-96 h-auto" />
    </div>
  </div>
  <div class="detail-pay-container">
    <PayPalButton
      :amount="selectedMonth.totalFee"
      currency="USD"
      @payment-success="handlePaymentSuccess"
      @payment-failure="handlePaymentFailure"
    />
  </div>
  <div class="mt-20 flex justify-center items-end w-full">
    <button @click="handlePaymentSuccess" class="btn btn-primary w-60">Pagar Ciclo</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onUnmounted } from 'vue'
import { useMonthStore } from '@/stores/month'
import { useCurrentUser } from '@/stores/currentUser'
import { Firebase } from '@/utilities/firebase.service'
import { usePdf } from '@/utilities/pdf.service' // Importa el servicio para generar PDF
import { useEmailService } from '@/utilities/email.service'
import PayPalButton from '@/components/PayPalButton.vue'
import router from '@/router'

const selectedMonth = useMonthStore().getMonth()
const firebase = new Firebase()
const useEmail = useEmailService()
const currentUser = useCurrentUser()

// Usa el servicio para generar PDF
const { generarPdf } = usePdf()

// Datos del componente
const fechaActual = ref(new Date())
const studentInfo = currentUser.getCurrentUser()

// Generar el PDF al hacer clic en el botón
const handleGeneratePDF = async () => {
  const downloadURL = await generarPdf(
    selectedMonth as Month,
    fechaActual.value, // Fecha actual
    studentInfo // Información del estudiante
  )

  if (downloadURL) {
    console.log('PDF disponible en:', downloadURL)
    // useEmail.sendEmail(
    //   currentUser.getCurrentUser().email,
    //   `Tu Factura de pago esta disponible en: ${downloadURL}`
    // )
    await updatePaidInfo(downloadURL)
  }
}

// ACTUALIZA LOS DATOS DE MONTH
const updatePaidInfo = async (ticketUrl: string) => {
  const currentDate = new Date()

  // Construcción de los datos para Firestore
  const updatedData: Partial<Month> = {
    paid: true,
    paidDate: `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`,
    ticketUrl: ticketUrl // URL del PDF
  }

  // Path al documento del mes en Firestore
  const path = `users/${studentInfo.uid}/semesters/${2}-${2024}/payments/${selectedMonth.id}`

  try {
    await firebase.updateDocument(path, updatedData)
    console.log('Datos del mes actualizados correctamente')
  } catch (error) {
    console.error('Error al actualizar los datos del mes:', error)
  }
}

// Manejar éxito del pago
const handlePaymentSuccess = (order: Record<string, any>) => {
  handleGeneratePDF().then(() => {
    router.replace({ name: 'home' })
  })
}

// Manejar errores del pago
const handlePaymentFailure = (error: Error) => {
  console.error('Error en el pago:', error)
  alert('Hubo un problema al procesar el pago.')
}

onBeforeMount(() => {
  const selectedMonth = useMonthStore().getMonth()
  if (!selectedMonth) router.back()
})

onUnmounted(() => {
  useMonthStore().clearMonth()
})
</script>

<style scoped>
.detail-pay-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
</style>
