import { initializeApp } from 'firebase/app'

// Firebase web config is public by design (it identifies the project, it doesn't grant access).
// Add more SDKs (Firestore, Analytics, ...) here: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: 'AIzaSyA5XE3nPHYs8oqtopaLmOYOwesi_tAqADY',
  authDomain: 'goatislop.firebaseapp.com',
  projectId: 'goatislop',
  storageBucket: 'goatislop.firebasestorage.app',
  messagingSenderId: '561934101339',
  appId: '1:561934101339:web:3148c8b47721458133887e',
}

export const firebaseApp = initializeApp(firebaseConfig)
