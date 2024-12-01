<template>
  <div>
    <button @click="generarRecibo">Generar Recibo</button>
  </div>
</template>

<script>
import { generarPdf } from '@/services/pdf.service'

export default {
  name: 'PdfPayment',
  setup() {
    const generarRecibo = async () => {
      const htmlContent = `
  <div style="width: 240px; background: #ffffff; text-align: center; margin-top: 10px">
    <img src="assets/img/logoUls.png" alt="Logo ULS" width="100px" height="40px">
    <h1 style="color: #000000; font-size: 10px; margin: 5px;">Recibo de Pago</h1>
    <h6 style="color: #000000; font-size: 10px; margin: 5px;">Pago de Cuota</h6>
    <p style="color: #000000; font-size: 10px; margin: 5px;">Universidad Luterana Salvadoreña</p>
    <p style="color: #000000; font-size: 10px; margin: 5px;">Dirección: Barrio San Jacinto</p>
    <h6 style="color: #000000; font-size: 10px; margin: 5px;">NIT: 0097-889898-106-9</h6>
    <h6 style="color: #000000; font-size: 10px; margin-top: 5px;">NCR: 998767-0</h6>
    <p style="color: #000000; margin: 3px;">----------------------------------------</p>
    <p style="color: #000000; font-size: 10px;">Estudiante: ${studentInfo.name}</p>
    <p style="color: #000000; font-size: 10px;">Carnet: ${studentInfo.carnet}</p>
    <p style="color: #000000; font-size: 10px;">Mes a pagar: ${mesPagar}</p>
    <p style="color: #000000; font-size: 10px;">Cantidad a pagar: $45 (No aplica Mora)</p>
    <p style="color: #000000; font-size: 10px;">Última fecha de pago: ${ultimaFechaDePago}</p>
    <p style="color: #000000; font-size: 10px;">Fecha actual: ${fechaActual.toLocaleDateString()}</p>
  </div>
      `

      const headers = [['Campo', 'Información']]
      const data = [
        ['Estudiante', 'Willian Romero'],
        ['Carnet', 'RA01137239'],
        ['Mes a pagar', 'Diciembre'],
        ['Cantidad a pagar', '$45 (No aplica Mora)'],
        ['Última fecha de pago', '30/11/2024'],
        ['Fecha actual', new Date().toLocaleDateString()]
      ]

      const foot = [['', 'Total a pagar', '$45']]

      try {
        const pdfBlob = await generarPdf(htmlContent, 'recibo.pdf', headers, data, foot, 240, 450)
        const url = URL.createObjectURL(pdfBlob)
        window.open(url, '_blank')
      } catch (error) {
        console.error('Error al generar el PDF:', error)
      }
    }

    return { generarRecibo }
  }
}
</script>
