<template>
  <div class="container mx-auto p-6">
    <!-- Contenedor de las columnas (Filtros y Logo) -->
    <div class="grid grid-cols-2 gap-8 items-center">
      <!-- Columna de los Filtros -->
      <div class="flex flex-col items-center">
        <!-- Filtro del Ciclo -->
        <div class="mb-4 w-80 shadow-lg">
          <label for="ciclo" class="block text-sm font-medium text-gray-700"
            >Selecciona el Ciclo</label
          >
          <select id="ciclo" v-model="selectedCiclo" class="select select-bordered w-full">
            <option disabled value="">Elige un Ciclo</option>
            <option v-for="ciclo in ciclos" :key="ciclo" :value="ciclo">{{ ciclo }}</option>
          </select>
        </div>

        <!-- Filtro del Mes -->
        <div class="mb-4 w-80 shadow-lg">
          <label for="mes" class="block text-sm font-medium text-gray-700">Selecciona el Mes</label>
          <select id="mes" v-model="selectedMes" class="select select-bordered w-full">
            <option disabled value="">Elige un Mes</option>
            <option v-for="mes in meses" :key="mes">{{ mes }}</option>
          </select>
        </div>

        <!-- Filtro del Método de Pago -->
        <div class="mb-4 w-80 shadow-lg">
          <label for="metodo" class="block text-sm font-medium text-gray-700"
            >Selecciona el Método de Pago</label
          >
          <select id="metodo" v-model="selectedMetodo" class="select select-bordered w-full">
            <option disabled value="">Elige un Método de Pago</option>
            <option v-for="metodo in metodosPago" :key="metodo" :value="metodo">
              {{ metodo }}
            </option>
          </select>
        </div>
      </div>

      <!-- Columna de la Imagen -->
      <div class="flex justify-center">
        <img src="\src\assets\logo-uls.png" alt="Logo ULS" class="w-1/2 h-auto" />
      </div>
    </div>
    <div class="mt-60 flex justify-center items-end w-full">
      <button @click="realizarPago" class="btn btn-primary w-60">Realizar Pago</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

type CicloKey = 'Ciclo 1' | 'Ciclo 2' | 'Matricula'
// Router
const router = useRouter()

// Estados
const selectedCiclo = ref<CicloKey | ''>('')
const selectedMes = ref<string>('')
const selectedMetodo = ref<string>('')
const ultimaFechaDePago = ref<string>('')

// Opciones disponibles
const ciclos = ref(['Ciclo 1', 'Ciclo 2', 'Matricula'])
const meses1 = ref(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'])
const meses2 = ref(['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])
const matricula = ref(['Seguro', 'Papeleria'])

const opciones: Record<CicloKey, typeof meses1> = {
  'Ciclo 1': meses1,
  'Ciclo 2': meses2,
  Matricula: matricula
}

const meses = computed(() => {
  if (!selectedCiclo.value) return []
  return opciones[selectedCiclo.value]?.value || []
})

// Métodos de pago
const metodosPago = ref(['Tarjeta de crédito', 'PayPal', 'Transferencia'])

// Watch para actualizar `ultimaFechaDePago` al cambiar `selectedMes`
watch(selectedMes, (nuevoMes) => {
  if (selectedCiclo.value === 'Matricula') {
    ultimaFechaDePago.value = new Date().toLocaleDateString() // Asigna la fecha actual para matrícula
    return
  }

  // Actualiza `ultimaFechaDePago` basado en el mes seleccionado
  const index = meses.value.indexOf(nuevoMes)
  if (index >= 0) {
    let mesAjustado = index + 1
    if (selectedCiclo.value === 'Ciclo 2') {
      mesAjustado += 6
    }
    ultimaFechaDePago.value = `25/${mesAjustado.toString().padStart(2, '0')}/2024`
  }
})

// Función para realizar el pago
const realizarPago = () => {
  console.log(
    `Ciclo: ${selectedCiclo.value}, Mes: ${selectedMes.value}, Método de pago: ${selectedMetodo.value}`
  )

  router.push({
    path: '/DetailPay',
    query: {
      ultimaFechaDePago: ultimaFechaDePago.value,
      selectedCiclo: selectedCiclo.value,
      selectedMes: selectedMes.value.toLowerCase() // Pasar el mes seleccionado
    }
  })
}
</script>
