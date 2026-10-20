import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDwkheIodqAQORnDd9NrDj5OJq0jWWncKY",
  authDomain: "terminal-lab-d7ed1.firebaseapp.com",
  projectId: "terminal-lab-d7ed1",
  storageBucket: "terminal-lab-d7ed1.firebasestorage.app",
  messagingSenderId: "1039170619541",
  appId: "1:1039170619541:web:7591163d98237a8437339c"
};

const hasRequiredConfig = Object.values(firebaseConfig).every((value) => value)

let app = null
let auth = null
let db = null
let initError = null

if (hasRequiredConfig) {
  try {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    initError = error instanceof Error ? error.message : 'Unknown Firebase initialization error'
    console.error('Firebase initialization failed:', initError)
  }
}

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export { app, auth, db, hasRequiredConfig, initError, googleProvider }
