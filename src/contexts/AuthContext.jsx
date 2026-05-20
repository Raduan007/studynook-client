import { createContext, useContext, useEffect, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth'
import app, { isConfigured } from '../firebase/firebase.config'
import axios from '../api/axios'

const AuthContext = createContext(null)

// ── helpers ──────────────────────────────────────────────────────────────────
const getFirebaseAuth = () => {
  if (!isConfigured || !app) return null
  try {
    return getAuth(app)
  } catch {
    return null
  }
}

const googleProvider = new GoogleAuthProvider()

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Auth state persistence — Firebase handles this automatically (localStorage)
  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          try {
            await axios.post('/auth/login', { 
              email: currentUser.email,
              uid: currentUser.uid 
            })
          } catch (err) {
            console.error('Failed to set JWT cookie:', err)
          }
        } else {
          try {
            await axios.post('/auth/logout')
          } catch (err) {
            console.error('Failed to clear JWT cookie:', err)
          }
        }
        setUser(currentUser)
        setLoading(false)
      },
      () => setLoading(false)
    )

    return unsubscribe
  }, [])

  // ── actions ──────────────────────────────────────────────────────────────
  const signUp = async (name, email, password) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error('Firebase not configured')
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser, { displayName: name })
    // Sync the updated profile into state immediately
    setUser({ ...newUser, displayName: name })
    return newUser
  }

  const signIn = async (email, password) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error('Firebase not configured')
    const { user: loggedIn } = await signInWithEmailAndPassword(auth, email, password)
    return loggedIn
  }

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error('Firebase not configured')
    const { user: googleUser } = await signInWithPopup(auth, googleProvider)
    return googleUser
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) return
    await signOut(auth)
  }

  const value = { user, loading, signUp, signIn, signInWithGoogle, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
