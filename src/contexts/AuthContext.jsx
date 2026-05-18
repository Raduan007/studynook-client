import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app, { isConfigured } from '../firebase/firebase.config'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured || !app) {
      console.warn('⚠️ Firebase not configured. Add your credentials to .env')
      setLoading(false)
      return
    }

    let auth
    try {
      auth = getAuth(app)
    } catch (e) {
      console.warn('Firebase Auth initialization failed:', e.message)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      () => {
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const value = { user, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
