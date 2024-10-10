/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_FIREBASE_CONFIG: string //Clave de API de Firebase
  VITE_EMAIL_BASEURL: string // URL del backend de email
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
