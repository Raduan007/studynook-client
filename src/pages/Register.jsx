import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

// ── Password rules ────────────────────────────────────────────────────────────
const RULES = [
  { id: 'length', label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { id: 'upper',  label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',  label: 'One lowercase letter',  test: (p) => /[a-z]/.test(p) },
]

const validatePassword = (password) => {
  const failed = RULES.filter((r) => !r.test(password))
  return failed.length === 0 ? null : failed[0].label
}

// ── Password strength indicator ───────────────────────────────────────────────
const PasswordHints = ({ password }) => {
  if (!password) return null
  return (
    <ul className="mt-2 space-y-1">
      {RULES.map(({ id, label, test }) => {
        const passed = test(password)
        return (
          <li key={id} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-slate-400'}`}>
            {passed ? (
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
            {label}
          </li>
        )
      })}
    </ul>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
const Register = () => {
  useTitle('Register')
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // ── Email / password registration ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validatePassword(form.password)
    if (error) {
      toast.error(error)
      return
    }

    setLoading(true)
    try {
      await signUp(form.name.trim(), form.email, form.password)
      toast.success('Account created! Welcome to StudyNook 🎉')
      navigate('/')
    } catch (err) {
      toast.error(friendlyError(err.code) || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Google registration / sign-in ────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google!')
      navigate('/')
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Join StudyNook and start finding your space</p>
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

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reg-name" className="form-label">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="form-label">
              Email
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Min. 6 characters"
              className="form-input"
            />
            {/* Live password hints */}
            <PasswordHints password={form.password} />
          </div>

          <button
            type="submit"
            id="register-submit"
            disabled={loading || googleLoading}
            className="btn-primary w-full py-2.5"
          >
            {loading ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

// Map Firebase error codes to readable messages
const friendlyError = (code) => {
  const map = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/configuration-not-found': 'Firebase Auth is not enabled in your Firebase Console.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  }
  return map[code] ?? null
}

export default Register
