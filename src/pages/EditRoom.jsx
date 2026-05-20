import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import LoadingSpinner from '../components/LoadingSpinner'
import { normalizeRoom } from '../api/normalizeRoom'

const AMENITY_OPTIONS = [
  'WiFi',
  'AC',
  'Whiteboard',
  'Projector',
  'TV Screen',
  'Printer',
  'Coffee Station',
  'Lounge Seating',
  'Natural Light',
  'Power Outlets',
  'Locker',
  'Snack Bar',
]

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (form) => {
  if (!form.name.trim()) return 'Room name is required.'
  if (!form.description.trim()) return 'Description is required.'
  if (form.description.trim().length < 20) return 'Description must be at least 20 characters.'
  if (!form.floor && form.floor !== 0) return 'Floor number is required.'
  if (!form.capacity || Number(form.capacity) < 1) return 'Capacity must be at least 1.'
  if (!form.hourlyRate || Number(form.hourlyRate) < 1) return 'Hourly rate must be at least $1.'
  if (form.image && !/^https?:\/\/.+/.test(form.image)) return 'Image must be a valid URL starting with http(s).'
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────
const EditRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState(null)       // null = still loading
  const [fetchError, setFetchError] = useState(null)
  const [loading, setLoading] = useState(false)

  useTitle(form?.name ? `Edit — ${form.name}` : 'Edit Room')

  // ── Fetch existing room data ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    axios
      .get(`/rooms/${id}`)
      .then(({ data }) => {
        if (cancelled) return
        const room = normalizeRoom(data)
        setForm({
          name: room.name || '',
          description: room.description || '',
          image: room.image || '',
          floor: room.floor ?? '',
          capacity: room.capacity ?? '',
          hourlyRate: room.hourlyRate ?? '',
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
        })
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err.response?.data?.message || err.message || 'Failed to load room')
      })

    return () => { cancelled = true }
  }, [id])

  // ── Field handlers ────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAmenityToggle = (amenity) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validate(form)
    if (error) {
      toast.error(error)
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        floor: Number(form.floor),
        capacity: Number(form.capacity),
        hourlyRate: Number(form.hourlyRate),
      }
      await axios.put(`/rooms/${id}`, payload)
      toast.success('Room updated successfully!')
      navigate(`/rooms/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Loading (fetching room) ────────────────────────────────────────────────
  if (!form && !fetchError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // ── Fetch error ───────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Could not load room</p>
          <p className="text-sm text-slate-500">{fetchError}</p>
        </div>
        <Link to="/my-listings" className="text-sm text-indigo-600 hover:underline">← My Listings</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/rooms/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Room
        </Link>
        <h1 className="page-title">Edit Room</h1>
        <p className="page-subtitle">Update your listing details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">

        {/* ── Room name ── */}
        <div>
          <label htmlFor="edit-name" className="form-label">Room Name <span className="text-red-400">*</span></label>
          <input
            id="edit-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. The Quiet Corner"
            className="form-input"
          />
        </div>

        {/* ── Description ── */}
        <div>
          <label htmlFor="edit-description" className="form-label">Description <span className="text-red-400">*</span></label>
          <textarea
            id="edit-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="form-input resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">{form.description.length} characters</p>
        </div>

        {/* ── Image URL ── */}
        <div>
          <label htmlFor="edit-image" className="form-label">Image URL</label>
          <input
            id="edit-image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/room-photo.jpg"
            className="form-input"
          />
          {/* Live image preview */}
          {form.image && /^https?:\/\/.+/.test(form.image) && (
            <img
              src={form.image}
              alt="preview"
              className="mt-3 w-full max-h-48 object-cover rounded-lg border border-slate-100"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
        </div>

        {/* ── Floor / Capacity / Rate ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="edit-floor" className="form-label">Floor <span className="text-red-400">*</span></label>
            <input
              id="edit-floor"
              name="floor"
              type="number"
              min="0"
              value={form.floor}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="edit-capacity" className="form-label">Capacity <span className="text-red-400">*</span></label>
            <input
              id="edit-capacity"
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="edit-rate" className="form-label">Hourly Rate ($) <span className="text-red-400">*</span></label>
            <input
              id="edit-rate"
              name="hourlyRate"
              type="number"
              min="1"
              value={form.hourlyRate}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        {/* ── Amenities checkboxes ── */}
        <div>
          <p className="form-label">Amenities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AMENITY_OPTIONS.map((amenity) => {
              const checked = form.amenities.includes(amenity)
              return (
                <label
                  key={amenity}
                  className={`flex items-center gap-2.5 cursor-pointer rounded-lg border px-3 py-2.5 text-sm transition select-none ${
                    checked
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-indigo-600 w-4 h-4 shrink-0"
                    checked={checked}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  {amenity}
                </label>
              )
            })}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <button
            id="edit-room-submit"
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 sm:flex-none sm:w-48"
          >
            {loading ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" /> : null}
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <Link
            to={`/rooms/${id}`}
            className="btn-secondary px-6"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default EditRoom
