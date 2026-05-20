import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import LoadingSpinner from '../components/LoadingSpinner'
import BookingModal from '../components/BookingModal'

// ── Delete confirmation modal ─────────────────────────────────────────────────
const DeleteModal = ({ roomName, onConfirm, onCancel, deleting }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-modal-title"
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={onCancel}
    />

    {/* Panel */}
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      <h2 id="delete-modal-title" className="text-lg font-bold text-slate-800 text-center mb-2">
        Delete Room
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6">
        Are you sure you want to delete <span className="font-medium text-slate-700">&ldquo;{roomName}&rdquo;</span>?
        This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          id="confirm-delete-btn"
          onClick={onConfirm}
          disabled={deleting}
          className="btn-danger flex-1"
        >
          {deleting ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" /> : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
)

// ── Meta chip ─────────────────────────────────────────────────────────────────
const MetaItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-center flex-1 min-w-[100px]">
    <span className="text-indigo-500">{icon}</span>
    <span className="text-lg font-bold text-slate-800">{value}</span>
    <span className="text-xs text-slate-500">{label}</span>
  </div>
)

// ── Floor icon ────────────────────────────────────────────────────────────────
const FloorIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
  </svg>
)

const CapacityIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.197-3.787M9 20H4v-2a4 4 0 015.197-3.787M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const RateIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2" />
  </svg>
)

const BookingIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

// ── Page ──────────────────────────────────────────────────────────────────────
const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [booking, setBooking] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useTitle(room?.name || 'Room Details')

  // ── Fetch room ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    axios
      .get(`/rooms/${id}`)
      .then(({ data }) => {
        if (!cancelled) setRoom(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load room')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  // ── Derived flags ──────────────────────────────────────────────────────────
  const isOwner =
    user && room && (room.ownerEmail === user.email || room.ownerUid === user.uid)

  // ── Booking bumper (optimistic update after successful booking) ────────────
  const handleBooked = () => {
    setRoom((prev) => ({
      ...prev,
      bookingCount: (prev.bookingCount ?? prev.totalBookings ?? 0) + 1,
    }))
  }

  // ── Delete room ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`/rooms/${id}`)
      toast.success('Room deleted successfully')
      navigate('/rooms', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed. Please try again.')
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-1">Could not load room</h2>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <Link
          to="/rooms"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Rooms
        </Link>
      </div>
    )
  }

  const amenities = room.amenities || []
  const bookingCount = room.bookingCount ?? room.totalBookings ?? 0

  return (
    <>
      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          roomName={room.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}

      {/* Booking modal */}
      {showBookingModal && (
        <BookingModal
          room={room}
          user={user}
          onClose={() => setShowBookingModal(false)}
          onBooked={handleBooked}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Rooms
        </Link>

        {/* ── Hero image ── */}
        <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video w-full mb-8">
          {room.image ? (
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column — main content ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Name + owner actions */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="page-title leading-snug">
                {room.name}
              </h1>

              {/* Owner controls */}
              {isOwner && (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/rooms/${id}/edit`}
                    className="btn-secondary btn-sm"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    id="delete-room-btn"
                    onClick={() => setShowDeleteModal(true)}
                    className="btn-danger btn-sm"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Meta stats row */}
            <div className="flex flex-wrap gap-3">
              <MetaItem icon={<FloorIcon />} label="Floor" value={room.floor ?? '—'} />
              <MetaItem icon={<CapacityIcon />} label="Capacity" value={`Up to ${room.capacity ?? '—'}`} />
              <MetaItem icon={<RateIcon />} label="Per Hour" value={room.hourlyRate != null ? `$${room.hourlyRate}` : '—'} />
              <MetaItem icon={<BookingIcon />} label="Bookings" value={bookingCount} />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-base font-semibold text-slate-700 mb-2">About this room</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {room.description || 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-slate-700 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full"
                    >
                      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — booking card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
              {/* Rate */}
              <div>
                <span className="text-3xl font-extrabold text-slate-800">
                  {room.hourlyRate != null ? `$${room.hourlyRate}` : '—'}
                </span>
                <span className="text-slate-500 text-sm ml-1">/ hour</span>
              </div>

              <hr className="border-slate-100" />

              {/* Booking count */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span><strong className="text-slate-700">{bookingCount}</strong> booking{bookingCount !== 1 ? 's' : ''} so far</span>
              </div>

              {/* CTA */}
              {user ? (
                <button
                  id="book-now-btn"
                  onClick={() => setShowBookingModal(true)}
                  disabled={isOwner}
                  title={isOwner ? 'You own this room' : ''}
                  className="btn-primary w-full py-3"
                >
                  {isOwner ? 'Your Listing' : 'Book Now'}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/rooms/${id}` } }}
                  className="btn-primary w-full py-3"
                >
                  Login to Book
                </Link>
              )}

              {!user && (
                <p className="text-xs text-slate-400 text-center">
                  You need an account to make a booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RoomDetails
