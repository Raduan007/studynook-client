import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

// ── Helpers ───────────────────────────────────────────────────────────────────

// Today's date in YYYY-MM-DD (local time, no UTC shift)
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Convert "HH:MM" to fractional hours
const timeToHours = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h + m / 60
}

// Calculate hours between two "HH:MM" strings (positive only)
const hoursBetween = (start, end) => {
  const diff = timeToHours(end) - timeToHours(start)
  return diff > 0 ? diff : 0
}

// ── Time slot options ─────────────────────────────────────────────────────────
const TIME_SLOTS = Array.from({ length: 29 }, (_, i) => {
  const totalMins = 7 * 60 + i * 30   // 07:00 to 21:00
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const label = new Date(0, 0, 0, h, m).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return { value, label }
})

const EMPTY = { date: '', startTime: '', endTime: '', note: '' }

// ── Modal ─────────────────────────────────────────────────────────────────────
/**
 * BookingModal
 * Props:
 *   room   — { id | _id, name, hourlyRate }
 *   user   — Firebase user object
 *   onClose() — close the modal
 *   onBooked() — called after a successful booking (e.g. re-fetch room)
 */
const BookingModal = ({ room, user, onClose, onBooked }) => {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // ── Derived values ──────────────────────────────────────────────────────────
  const hours = form.startTime && form.endTime ? hoursBetween(form.startTime, form.endTime) : 0
  const total = hours > 0 ? (hours * (room.hourlyRate || 0)).toFixed(2) : null

  const isTimeValid = hours > 0
  const canSubmit = form.date && form.startTime && form.endTime && isTimeValid

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!canSubmit) {
      toast.error('Please fill in date, start time, and end time.')
      return
    }
    if (!isTimeValid) {
      toast.error('End time must be after start time.')
      return
    }

    setLoading(true)
    try {
      await axios.post('/bookings', {
        roomId: room.id || room._id,
        roomName: room.name,
        userEmail: user.email,
        userName: user.displayName,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        totalHours: hours,
        totalCost: Number(total),
        note: form.note.trim(),
      })
      toast.success('Room booked successfully! 🎉')
      onBooked?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel — bottom-sheet on mobile, centered dialog on sm+ */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile only) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 id="booking-modal-title" className="text-lg font-bold text-slate-800">
              Book This Room
            </h2>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{room.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition"
            aria-label="Close booking modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Date */}
          <div>
            <label htmlFor="booking-date" className="block text-sm font-medium text-slate-700 mb-1.5">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              id="booking-date"
              type="date"
              name="date"
              value={form.date}
              min={todayStr()}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Start / End time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="booking-start" className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Time <span className="text-red-400">*</span>
              </label>
              <select
                id="booking-start"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select</option>
                {TIME_SLOTS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="booking-end" className="block text-sm font-medium text-slate-700 mb-1.5">
                End Time <span className="text-red-400">*</span>
              </label>
              <select
                id="booking-end"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select</option>
                {TIME_SLOTS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time validation hint */}
          {form.startTime && form.endTime && !isTimeValid && (
            <p className="text-xs text-red-500 -mt-3">End time must be after start time.</p>
          )}

          {/* Cost summary */}
          {total && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-indigo-700">
                <span className="font-medium">{hours.toFixed(1)} hr{hours !== 1 ? 's' : ''}</span>
                <span className="text-indigo-400 mx-1.5">×</span>
                <span>${room.hourlyRate}/hr</span>
              </div>
              <div className="text-lg font-extrabold text-indigo-700">${total}</div>
            </div>
          )}

          {/* Special note */}
          <div>
            <label htmlFor="booking-note" className="block text-sm font-medium text-slate-700 mb-1.5">
              Special Note <span className="text-xs text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="booking-note"
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Any special requirements or requests…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="confirm-booking-btn"
              type="submit"
              disabled={loading || !canSubmit}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
                : null}
              {loading ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
