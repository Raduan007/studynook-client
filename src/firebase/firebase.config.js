// src/firebase/firebase.config.js
// Fill in your Firebase project credentials in .env (copy from .env.example).
import { initializeApp, getApps, getApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Export null if Firebase credentials are not configured
const isConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY

const app = isConfigured
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
  : null

export { isConfigured }
export default app
