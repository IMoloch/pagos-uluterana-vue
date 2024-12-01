import axios from 'axios'
import { ref } from 'vue'

// URL base de la API (desde variables de entorno)
const BASE_URL = import.meta.env.VITE_EMAIL_BASEURL || ''

export const useEmailService = () => {
  const loading = ref(false) // Estado de carga
  const error = ref<string | null>(null) // Error en la solicitud
  const success = ref<string | null>(null) // Mensaje de éxito

  /**
   * Envía un email usando la API
   * @param email Dirección de correo electrónico del receptor
   * @param message Contenido del mensaje
   */
  const sendEmail = async (email: string, message: string): Promise<void> => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const response = await axios.post(`${BASE_URL}/api/email`, {
        email,
        message
      })

      // Manejar respuesta exitosa
      success.value = response.data.msg || 'Mensaje enviado con éxito.'
    } catch (err: any) {
      // Manejar errores
      error.value = err.response?.data?.msg || 'Error al enviar el correo. Intente nuevamente.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    sendEmail
  }
}
