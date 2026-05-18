import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// ── Delete confirmation modal ─────────────────────────────────────────────────
const DeleteModal = ({ roomName, onConfirm, onCancel, deleting }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-listing-title"
  >
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <h2 id="delete-listing-title" className="text-lg font-bold text-slate-800 text-center mb-2">
        Delete Listing
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6">
        Are you sure you want to permanently delete{' '}
        <span className="font-medium text-slate-700">&ldquo;{roomName}&rdquo;</span>?
        This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          id="confirm-delete-listing-btn"
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {deleting
            ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
            : 'Yes, Delete'}
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">No listings yet</h3>
    <p className="text-sm text-slate-500 max-w-xs mb-6">
      You haven&apos;t listed any rooms yet. Add your first study room and start accepting bookings.
    </p>
    <Link
      to="/add-room"
      className="inline-flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add a Room
    </Link>
  </div>
)

// ── Listing card ──────────────────────────────────────────────────────────────
const ListingCard = ({ room, onDeleteClick }) => {
  const roomId = room.id || room._id
  const amenities = room.amenities || []
  const bookingCount = room.bookingCount ?? room.totalBookings ?? 0

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row">
      {/* Image */}
      <div className="shrink-0 w-full sm:w-40 h-40 sm:h-auto bg-slate-100">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
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

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <Link
            to={`/rooms/${roomId}`}
            className="text-base font-semibold text-slate-800 hover:text-indigo-600 transition line-clamp-1"
          >
            {room.name}
          </Link>

          {/* Amenity count badge */}
          {amenities.length > 0 && (
            <span className="inline-flex items-center text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full shrink-0">
              {amenities.length} amenit{amenities.length === 1 ? 'y' : 'ies'}
            </span>
          )}
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
            Floor {room.floor ?? '—'}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.197-3.787M9 20H4v-2a4 4 0 015.197-3.787M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Up to {room.capacity ?? '—'}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2" />
            </svg>
            ${room.hourlyRate ?? '—'}/hr
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {bookingCount} booking{bookingCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 mt-auto flex-wrap">
          <Link
            to={`/rooms/${roomId}/edit`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDeleteClick(room)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <Link
            to={`/rooms/${roomId}`}
            className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const MyListings = () => {
  useTitle('My Listings')
  const { user } = useAuth()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // ── Fetch listings ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError(null)

    axios
      .get(`${API}/rooms`, { params: { ownerEmail: user.email } })
      .then(({ data }) => {
        if (!cancelled) setRooms(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load listings')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [user])

  // ── Delete listing ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    const roomId = deleteTarget.id || deleteTarget._id
    setDeleting(true)
    try {
      await axios.delete(`${API}/rooms/${roomId}`)
      setRooms((prev) => prev.filter((r) => (r.id || r._id) !== roomId))
      toast.success('Room deleted successfully.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed. Please try again.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

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
      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          roomName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">My Listings</h1>
            <p className="text-slate-500 text-sm">
              {rooms.length > 0
                ? `${rooms.length} room${rooms.length !== 1 ? 's' : ''} listed`
                : 'Manage the study rooms you\'ve listed.'}
            </p>
          </div>
          <Link
            to="/add-room"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Room
          </Link>
        </div>

        {/* API error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && rooms.length === 0 && <EmptyState />}

        {/* Listing cards */}
        {rooms.length > 0 && (
          <div className="space-y-4">
            {rooms.map((room) => (
              <ListingCard
                key={room.id || room._id}
                room={room}
                onDeleteClick={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyListings
