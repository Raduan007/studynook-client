import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-100 text-emerald-700' },
  pending:   { label: 'Pending',   cls: 'bg-amber-100 text-amber-700'   },
  completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-500'   },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-500'       },
}

const getStatus = (raw = '') => STATUS[raw.toLowerCase()] ?? { label: raw, cls: 'bg-slate-100 text-slate-500' }

const canCancel = (raw = '') => ['confirmed', 'pending'].includes(raw.toLowerCase())

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

// ── Cancel confirmation modal ─────────────────────────────────────────────────
const CancelModal = ({ roomName, onConfirm, onCancel, cancelling }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cancel-modal-title"
  >
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 id="cancel-modal-title" className="text-lg font-bold text-slate-800 text-center mb-2">
        Cancel Booking
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6">
        Are you sure you want to cancel your booking for{' '}
        <span className="font-medium text-slate-700">&ldquo;{roomName}&rdquo;</span>?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          Keep Booking
        </button>
        <button
          id="confirm-cancel-btn"
          onClick={onConfirm}
          disabled={cancelling}
          className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {cancelling ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" /> : 'Yes, Cancel'}
        </button>
      </div>
    </div>
  </div>
)

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">No bookings yet</h3>
    <p className="text-sm text-slate-500 max-w-xs mb-6">
      You haven&apos;t booked any study rooms yet. Browse available spaces and reserve one.
    </p>
    <Link
      to="/rooms"
      className="inline-flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition"
    >
      Browse Rooms
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
)

// ── Booking card ──────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onCancelClick }) => {
  const status = getStatus(booking.status)
  const cancellable = canCancel(booking.status)

  return (
    <div className="card overflow-hidden flex flex-col sm:flex-row">
      {/* Room image */}
      <div className="shrink-0 w-full sm:w-36 h-36 sm:h-auto bg-slate-100 relative">
        {booking.roomImage ? (
          <img
            src={booking.roomImage}
            alt={booking.roomName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          {/* Room name → links to room */}
          <div>
            <Link
              to={`/rooms/${booking.roomId}`}
              className="text-base font-semibold text-slate-800 hover:text-indigo-600 transition line-clamp-1"
            >
              {booking.roomName || 'Study Room'}
            </Link>
            <p className="text-xs text-slate-400 mt-0.5">
              Booked on {fmt(booking.createdAt)}
            </p>
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.cls}`}>
            {status.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {fmt(booking.date)}
          </span>

          {(booking.startTime || booking.endTime) && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
              {booking.startTime} – {booking.endTime}
            </span>
          )}

          {booking.totalHours != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {booking.totalHours} hr{booking.totalHours !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Note */}
        {booking.note && (
          <p className="text-xs text-slate-400 italic line-clamp-1">
            &ldquo;{booking.note}&rdquo;
          </p>
        )}

        {/* Footer: cost + action */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="text-base font-bold text-indigo-600">
            {booking.totalCost != null ? `$${Number(booking.totalCost).toFixed(2)}` : '—'}
          </span>

          {cancellable ? (
            <button
              onClick={() => onCancelClick(booking)}
              className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3.5 py-1.5 rounded-lg transition"
            >
              Cancel Booking
            </button>
          ) : (
            <Link
              to={`/rooms/${booking.roomId}`}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-3.5 py-1.5 rounded-lg transition"
            >
              View Room
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Summary stats ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, colorClass }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    <p className="text-xs text-slate-500 mt-1">{label}</p>
  </div>
)

// ── Page ──────────────────────────────────────────────────────────────────────
const MyBookings = () => {
  useTitle('My Bookings')
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState(null)   // booking object to cancel
  const [cancelling, setCancelling] = useState(false)

  // ── Fetch bookings ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError(null)

    axios
      .get(`${API}/bookings`, { params: { email: user.email } })
      .then(({ data }) => {
        if (!cancelled) setBookings(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load bookings')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [user])

  // ── Cancel booking ──────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await axios.patch(`${API}/bookings/${cancelTarget.id || cancelTarget._id}/cancel`)
      // Optimistically update status in the list
      setBookings((prev) =>
        prev.map((b) =>
          (b.id || b._id) === (cancelTarget.id || cancelTarget._id)
            ? { ...b, status: 'cancelled' }
            : b
        )
      )
      toast.success('Booking cancelled.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed. Please try again.')
    } finally {
      setCancelling(false)
      setCancelTarget(null)
    }
  }

  // ── Derived stats ───────────────────────────────────────────────────────────
  const count = (s) => bookings.filter((b) => b.status?.toLowerCase() === s).length

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <CancelModal
          roomName={cancelTarget.roomName}
          onConfirm={handleCancel}
          onCancel={() => setCancelTarget(null)}
          cancelling={cancelling}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Track and manage all your study room reservations.</p>
        </div>

        {/* API Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Summary stats — only shown when there is data */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total"     value={bookings.length}      colorClass="text-indigo-600" />
            <StatCard label="Confirmed" value={count('confirmed')}   colorClass="text-emerald-600" />
            <StatCard label="Pending"   value={count('pending')}     colorClass="text-amber-600" />
            <StatCard label="Completed" value={count('completed')}   colorClass="text-slate-500" />
          </div>
        )}

        {/* Empty state */}
        {!error && bookings.length === 0 && <EmptyState />}

        {/* Booking cards */}
        {bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id || booking._id}
                booking={booking}
                onCancelClick={setCancelTarget}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyBookings
