/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_FIREBASE_CONFIG: string //Clave de API de Firebase
  VITE_EMAIL_BASEURL: string // URL del backend de email
  VITE_PAYPAL_CLIENT_ID: string // Client ID de Paypal
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
