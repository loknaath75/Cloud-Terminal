import { useEffect, useState } from 'react'
import './App.css'
import { auth, db, hasRequiredConfig, initError, googleProvider } from './firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'

// Saves a user profile doc and an audit-log entry to Firestore
async function saveLoginRecord(firebaseUser, provider) {
  if (!db) return
  try {
    // Upsert a user profile document (keyed by uid)
    await setDoc(
      doc(db, 'users', firebaseUser.uid),
      {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName ?? null,
        provider,
        lastLoginAt: serverTimestamp(),
      },
      { merge: true },
    )

    // Append an immutable entry to a loginHistory sub-collection
    await addDoc(collection(db, 'users', firebaseUser.uid, 'loginHistory'), {
      email: firebaseUser.email,
      provider,
      loginAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Firestore write failed:', err)
  }
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!auth) {
      setStatus('Firebase Auth is not ready yet.')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await saveLoginRecord(cred.user, 'email/password')
        setStatus('Account created successfully. Login details saved to Firestore ✓')
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        await saveLoginRecord(cred.user, 'email/password')
        setStatus('Signed in successfully. Login details saved to Firestore ✓')
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!auth) return

    setLoading(true)

    try {
      await signOut(auth)
      setStatus('Signed out successfully.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sign-out failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setStatus('Firebase Auth is not ready yet.')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await saveLoginRecord(cred.user, 'google')
      setStatus('Signed in with Google successfully. Login details saved to Firestore ✓')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Firebase Auth</p>
        <h1>{user ? 'You are signed in' : 'Sign in to Firebase'}</h1>
        <p className="hosted-note">This page is being served from Firebase Hosting.</p>

        <p>
          {hasRequiredConfig
            ? initError
              ? `Firebase init failed: ${initError}`
              : 'Firebase is configured and ready for authentication.'
            : 'Firebase config appears incomplete.'}
        </p>

        {status ? <p className="status">{status}</p> : null}

        {!user ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <div className="actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Create account' : 'Sign in instead'}
              </button>
            </div>

            <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
              Continue with Google
            </button>
          </form>
        ) : (
          <div className="account-box">
            <p>Signed in as <strong>{user.email}</strong></p>
            <button type="button" onClick={handleLogout} disabled={loading}>
              {loading ? 'Working...' : 'Sign out'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
