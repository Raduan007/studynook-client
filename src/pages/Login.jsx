import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import useTitle from '../hooks/useTitle'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Google colour icon ────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

const Login = () => {
  useTitle('Login')
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle } = useAuth()

  // Redirect to the page the user was trying to visit, or home
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // ── Email / password sign-in ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(friendlyError(err.code) || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Google sign-in ───────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google!')
      navigate(from, { replace: true })
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error(friendlyError(err.code) || 'Google sign-in failed')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your StudyNook account</p>
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="btn-secondary w-full py-2.5 mb-5"
        >
          {googleLoading ? <LoadingSpinner size="sm" /> : <GoogleIcon />}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            id="login-submit"
            disabled={loading || googleLoading}
            className="btn-primary w-full py-2.5"
          >
            {loading ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

// Map Firebase error codes to readable messages
const friendlyError = (code) => {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/configuration-not-found': 'Firebase Auth is not enabled in your Firebase Console.',
  }
  return map[code] ?? null
}

export default Login
