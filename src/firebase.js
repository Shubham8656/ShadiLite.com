import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCfal0D_aOdQVCZTUJWVrr9qKUXYGl5ADY",
  authDomain: "shadidotcom.firebaseapp.com",
  projectId: "shadidotcom",
  storageBucket: "shadidotcom.firebasestorage.app",
  messagingSenderId: "508277002382",
  appId: "1:508277002382:web:59d41f74cc6931e99039df"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);