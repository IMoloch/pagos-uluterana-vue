<template>
  <div>
    <div id="paypal-button-container"></div>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Definición de props
const props = defineProps<{
  amount: number // Monto a pagar
  currency?: string // Moneda, por defecto será USD
}>()

const emit = defineEmits<{
  (e: 'payment-success', order: Record<string, any>): void
  (e: 'payment-failure', error: Error): void
}>()

const errorMessage = ref<string>('')

// Cargar el SDK de PayPal dinámicamente
const loadPayPalScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paypal-sdk')) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=${props.currency || 'USD'}`
    script.id = 'paypal-sdk'
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })
}

// Renderizar el botón de PayPal
const renderPayPalButton = () => {
  if (!window.paypal) {
    errorMessage.value = 'PayPal SDK no está disponible.'
    return
  }

  window.paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: props.amount.toFixed(2)
              }
            }
          ]
        })
      },
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture()
          emit('payment-success', order) // Emitir evento de éxito
        } catch (error) {
          errorMessage.value = 'Error al procesar el pago.'
          emit('payment-failure', error as Error) // Emitir evento de error
        }
      },
      onError: (error) => {
        errorMessage.value = 'Error en el botón de PayPal.'
        emit('payment-failure', error as Error) // Emitir evento de error
      }
    })
    .render('#paypal-button-container') // Renderizar en el contenedor
}

// Cargar el SDK y renderizar el botón al montar el componente
onMounted(async () => {
  try {
    await loadPayPalScript()
    renderPayPalButton()
  } catch (error) {
    errorMessage.value = 'Error al cargar la SDK de PayPal.'
  }
})
</script>

<style scoped>
.text-red-500 {
  color: #f87171;
}
</style>
