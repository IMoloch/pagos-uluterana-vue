<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="card w-96 bg-white shadow-lg">
      <div class="card-header bg-[#10143c] text-white text-center py-4">
        <!-- Cambio aquí -->
        <h2 class="text-lg font-semibold">Detalle de transacción</h2>
      </div>
      <div class="card-body p-6">
        <div class="mb-4">
          <p class="text-gray-700 font-semibold">Febrero</p>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-700">Cuota Ordinaria</span>
          <span class="text-gray-700">$45</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Mora</span>
          <span class="text-gray-700">$5</span>
        </div>
        <div class="flex justify-end items-center">
          <span class="text-gray-700 font-semibold">Total: $50</span>
        </div>
        <div class="mt-6">
          <!-- Botón de PayPal  -->
          <button class="paypal-btn w-full mb-2">
            <span class="text-blue-600">Pay</span><span class="text-cyan-400">Pal</span>
          </button>
          <!-- Botón de Tarjeta de débito o crédito -->
          <button class="tarjeta-btn w-full flex items-center justify-center">
            <i class="fas fa-credit-card mr-2"></i>Tarjeta de débito o crédito
          </button>
        </div>
      </div>
      <div class="card-footer text-center py-4 text-gray-400 text-sm">Desarrollado por PayPal</div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
/* Color personalizado para el texto de "Detalle de transacción" */
.detalle-texto {
  color: #10143c;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Estilo del botón de PayPal */
.paypal-btn {
  background-color: #ffc107; /* Amarillo */
  color: black;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

/* Estilo del botón de "Tarjeta de débito o crédito" */
.tarjeta-btn {
  background-color: #10143c; /* Azul personalizado */
  color: white;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 0.35rem;
}

/* Ajuste del ícono de tarjeta de crédito en blanco */
.tarjeta-btn i {
  color: white;
}
</style>
