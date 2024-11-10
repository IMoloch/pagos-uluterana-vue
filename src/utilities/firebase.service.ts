import router from '@/router'
import { initializeApp } from 'firebase/app'
import { getDatabase } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, query, setDoc, updateDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export class Firebase {
  auth = getAuth(app)

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
    const ref = collection(getFirestore(), path);
    return (query(ref, ...collectionQuery), { idField: 'id' });
  }

  // =================== SET UN DOCUMENTO ====================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // =================== ACTUALIZAR UN DOCUMENTO ====================
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // =================== ELIMINAR UN DOCUMENTO ====================
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // =================== AGREGAR UN DOCUMENTO ====================
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }

  // =================== OBTENER UN DOCUMENTO ====================
  async getDocument(path: string) {
    return (await getDoc(doc(db, path))).data();
  }

  // ====================================== ALMACENAMIENTO =======================================
  // =================== SUBIR PDF A FIREBASE STORAGE ====================
  // async uploadPdfToStorage(pdfBlob: Blob, filename: string): Promise<string> {
    // const user: User = this.utilsSvc.getFromLocalStorage('user')
    // const storageRef = this.storage.ref(`${user.uid}/${filename}.pdf`);
    // await storageRef.put(pdfBlob);
    // return storageRef.getDownloadURL().toPromise();
  // }

  // =================== GUARDAR URL DEL PDF EN FIRESTORE ====================
  async savePdfUrlToFirestore(downloadURL: string, path: string) {
    await this.setDocument(path, { url: downloadURL });
  }
}
