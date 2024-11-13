<template>

<div class="container mx-auto p-6">
    <!-- Contenedor de las columnas (Filtros y Logo) -->
    <div class="grid grid-cols-2 gap-8 items-center">
      <!-- Columna de los Filtros -->
      <div class="flex flex-col items-center">
        <!-- Filtro del Ciclo -->
        <div class="mb-4 w-80">
          <label for="ciclo" class="block text-sm font-medium text-gray-700">Selecciona el Ciclo</label>
          <select id="ciclo" v-model="selectedCiclo" class="select select-bordered w-full">
            <option disabled value="">Elige un Ciclo</option>
            <option v-for="ciclo in ciclos" :key="ciclo" :value="ciclo">{{ ciclo }}</option>
          </select>
        </div>

        <!-- Filtro del Mes -->
        <div class="mb-4 w-80">
          <label for="mes" class="block text-sm font-medium text-gray-700">Selecciona el Mes</label>
          <select id="mes" v-model="selectedMes" class="select select-bordered w-full">
            <option disabled value="">Elige un Mes</option>
            <option v-for="mes in meses" :key="mes" >{{ mes }}</option>
          </select>
        </div>

        <!-- Filtro del Método de Pago -->
        <div class="mb-4 w-80">
          <label for="metodo" class="block text-sm font-medium text-gray-700">Selecciona el Método de Pago</label>
          <select id="metodo" v-model="selectedMetodo" class="select select-bordered w-full">
            <option disabled value="">Elige un Método de Pago</option>
            <option v-for="metodo in metodosPago" :key="metodo" :value="metodo">{{ metodo }}</option>
          </select>
        </div>
      </div>

      <!-- Columna de la Imagen -->
      <div class="flex justify-center">
        <!-- <img src="\src\assets\logo-uls.png" alt="Logo ULS" class="w-1/2 h-auto"> -->
      </div>
    </div>

    <!-- Botón de Realizar Pago (fila completa) -->
    <div class="mt-60 flex justify-center items-end w-full">
      <button @click="realizarPago" class="btn btn-primary  w-60">
        Realizar Pago
      </button>
    </div>
  </div>

</template>


<script>

import { ref, computed } from 'vue'

export default {
    setup() {
        // Datos reactivos para los filtros
        const selectedCiclo = ref('')  // Filtro del ciclo
        const selectedMes = ref('')    // Filtro del mes
        const selectedMetodo = ref('') // Filtro del método de pago

        // Listas de opciones
        const ciclos = ref(['Ciclo 1', 'Ciclo 2'])
        const meses1 = ref(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'])
        const meses2 = ref(['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])
        const meses = computed(() => {
          return selectedCiclo.value === 'Ciclo 1' ? meses1.value : meses2.value;
        });
        const metodosPago = ref(['Tarjeta de crédito', 'PayPal', 'Transferencia'])

        // Método para manejar el pago
        const realizarPago = () => {
            console.log(`Ciclo: ${selectedCiclo.value}, Mes: ${selectedMes.value}, Método de pago: ${selectedMetodo.value}`)
            alert('Pago realizado con éxito')
        }

        return {
            selectedCiclo,
            selectedMes,
            selectedMetodo,
            ciclos,
            meses,
            metodosPago,
            realizarPago,
        }
    }
}

</script>