<template>
 <div class="container flex justify-center items-center m-5 p-2">
    <div class="flex flex-col space-y-5 mr-40">
        <div class="max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="bg-blue-900 px-6 py-4">
                <h2 class="text-white text-lg font-semibold">Concepto de pago</h2>
            </div>
            <div class="p-6 space-y-2 text-gray-700">
                <p>Fecha actual: {{ new Date().toLocaleDateString() }}</p>
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
                <p>Estudiante: Willian Romero</p>
                <p>Carnet: ra01137239</p>
                <p>Se enviara un email a su correo asociado:</p>
            </div>
        </div>
    </div>
        <div class="ml-10">
        <img src="\src\assets\logo-uls.png" alt="Logo ULS" class="w-96 h-auto">
      </div>

</div>

<div class="mt-20 flex justify-center items-end w-full">
      <button @click="realizarPago" class="btn btn-primary w-60">
        Pagar Ciclo
      </button>
    </div>
</template>

 <script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  props: {
    ultimaFechaDePago: {
      type: String,
      required: true
    }
  },
  setup() {
    const route = useRoute();
    const ultimaFechaDePago = route.query.ultimaFechaDePago || 'Sin fecha definida';
    const cicloSeleccionado = route.query.selectedCiclo || 'Sin ciclo definido';
    const mesSeleccionado = route.query.selectedMes || 'Sin mes definido';
  const realizarPago = () => {
    alert('Pago realizado con éxito')
  };
//   const mesPagar = computed(() => {
     
//         const mesNumero = props.ultimaFechaDePago.split('/')[1];  // Extrae el mes (número)
//       const meses = [
//         'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
//         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
//       ];
//       return meses[mesNumero - 1];
//     });
//   return {
//     realizarPago,
//     mesPagar
//   };
// }
// }

const mesPagar = computed(() => {
      if (cicloSeleccionado === 'Matricula') {
        return mesSeleccionado; // Retorna "Papelería" o "Seguro" directamente
      }

    // Si no es "Matrícula", calcular el mes basado en la fecha
    const mesNumero = ultimaFechaDePago.split('/')[1]; // Extrae el mes (número)
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return meses[mesNumero - 1] || 'Mes no válido';
});

function convertirFecha(fechaString) {
  const [dia, mes, anio] = fechaString.split('/');
  return new Date(`${anio}-${mes}-${dia}`); // yyyy-MM-dd
}

const fechaActual = new Date();
const FechaPago = convertirFecha(ultimaFechaDePago)
const diferencia = fechaActual - FechaPago
const diferenciaDias = diferencia / (1000 * 3600 * 24)
console.log( ultimaFechaDePago)
console.log( fechaActual)
console.log(diferenciaDias)

return {
  realizarPago,
  mesPagar,
  fechaActual,

}
  }}



</script>