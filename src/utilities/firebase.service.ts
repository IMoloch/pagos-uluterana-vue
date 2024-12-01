import router from '@/router'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'
import { ref } from 'vue'

// Your web app's Firebase configuration
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore()
const storage = getStorage(app);

export class Firebase {
  auth = getAuth(app)
  db = db;
  storage = storage;

  async getAuth() {
    return new Promise<boolean>((resolve, reject) => {
      onAuthStateChanged(
        this.auth,
        (currentUser) => {
          currentUser ? resolve(true) : resolve(false)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  async signIn(user: User) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, user.email, user.password)
      return result
    } catch (error) {
      throw new Error()
    }
  }

  async signUp(user: User) {
    try {
      const res = await createUserWithEmailAndPassword(this.auth, user.email, user.password)
      return res
    } catch (error) {
      throw new Error()
    }
  }

  signOut() {
    try {
      this.auth.signOut()
    } catch (error) {
      throw new Error()
    }
    router.push({ name: 'login' })
  }

  // ====================================== BASE DE DATOS =======================================

  // =================== OBTENER COLECCION ====================
  getCollectionData(path: string, collectionQuery?: any) {
    const q = query(collection(db, path), collectionQuery)
    return getDocs(q)
  }

  // =================== SET UN DOCUMENTO ====================
  setDocument(path: string, data: any) {
    return setDoc(doc(db, path), data)
  }

  // =================== ACTUALIZAR UN DOCUMENTO ====================
  updateDocument(path: string, data: any) {
    return updateDoc(doc(db, path), data)
  }

  // =================== ELIMINAR UN DOCUMENTO ====================
  deleteDocument(path: string) {
    return deleteDoc(doc(db, path))
  }

  // =================== AGREGAR UN DOCUMENTO ====================
  addDocument(path: string, data: any) {
    return addDoc(collection(db, path), data)
  }

  // =================== OBTENER UN DOCUMENTO ====================
  async getDocument(path: string) {
    return (await getDoc(doc(db, path))).data()
  }

  // ====================================== ALMACENAMIENTO =======================================
  // =================== SUBIR PDF A FIREBASE STORAGE ====================
  async uploadPdfToStorage(pdfBlob: Blob, filename: string): Promise<string> {
    try {
      const pdfRef = storageRef(this.storage, `pdfs/${filename}.pdf`);
      await uploadBytes(pdfRef, pdfBlob);
      const downloadURL = await getDownloadURL(pdfRef);
      return downloadURL;
    } catch (error) {
      throw new Error('Error al subir el PDF a Firebase Storage: ' + error);
    }
  }


  
  // =================== GUARDAR URL DEL PDF EN FIRESTORE ====================
  async savePdfUrlToFirestore(downloadURL: string, path: string) {
    await this.setDocument(path, { url: downloadURL })
  }
}


// Crear instancia de Firebase
const firebaseInstance = new Firebase();

// Exportar función para usar Firebase
export function useFirebaseService() {
  return firebaseInstance;
}