import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
    setDropdownOpen(false)
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-indigo-600'
        : 'text-slate-600 hover:text-indigo-600'
    }`

  // Mobile links have larger tap targets
  const mobileNavLinkClass = ({ isActive }) =>
    `block py-2.5 text-sm font-medium transition-colors duration-200 border-b border-slate-50 ${
      isActive
        ? 'text-indigo-600'
        : 'text-slate-600 hover:text-indigo-600'
    }`

  const publicLinks = (
    <>
      <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/rooms" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        Rooms
      </NavLink>
    </>
  )

  const publicLinksMobile = (
    <>
      <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
      <NavLink to="/rooms" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Rooms</NavLink>
    </>
  )

  const privateLinks = (
    <>
      <NavLink to="/add-room" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        Add Room
      </NavLink>
      <NavLink to="/my-listings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        My Listings
      </NavLink>
      <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        My Bookings
      </NavLink>
    </>
  )

  const privateLinksMobile = (
    <>
      <NavLink to="/add-room" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Add Room</NavLink>
      <NavLink to="/my-listings" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>My Listings</NavLink>
      <NavLink to="/my-bookings" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
    </>
  )

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-indigo-600 tracking-tight">StudyNook</span>
          </Link>

          {/* Desktop Nav — hidden on mobile/tablet (< lg) */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 ml-6">
            {publicLinks}
            {user && privateLinks}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-label="User menu"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=4f46e5&color=fff`}
                    alt="avatar"
                    title={user.displayName || user.email}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-300 hover:ring-indigo-500 transition"
                  />
                  <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: avatar (if logged in) + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=4f46e5&color=fff`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-300"
              />
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Menu (< lg) */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100">
          {/* Nav links */}
          <div className="px-4 py-2">
            {publicLinksMobile}
            {user && privateLinksMobile}
          </div>

          {/* User section */}
          <div className="px-4 py-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-1">
                {/* Identity row */}
                <div className="flex items-center gap-3 py-2">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=4f46e5&color=fff`}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-300 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2.5 text-sm font-medium text-red-500 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 py-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-center border border-indigo-200 text-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-center bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
