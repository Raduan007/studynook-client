import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import useTitle from '../hooks/useTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

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

const EMPTY_FORM = {
  name: '',
  description: '',
  image: '',
  floor: '',
  capacity: '',
  hourlyRate: '',
  amenities: [],
}

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (form) => {
  if (!form.name.trim()) return 'Room name is required.'
  if (!form.description.trim()) return 'Description is required.'
  if (form.description.trim().length < 20) return 'Description must be at least 20 characters.'
  if (!form.floor) return 'Floor number is required.'
  if (!form.capacity || Number(form.capacity) < 1) return 'Capacity must be at least 1.'
  if (!form.hourlyRate || Number(form.hourlyRate) < 1) return 'Hourly rate must be at least $1.'
  if (form.image && !/^https?:\/\/.+/.test(form.image)) return 'Image must be a valid URL starting with http(s).'
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────
const AddRoom = () => {
  useTitle('Add Room')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

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
        ownerEmail: user.email,
        ownerUid: user.uid,
        ownerName: user.displayName,
      }
      const { data } = await axios.post(`${API}/rooms`, payload)
      toast.success('Room listed successfully!')
      navigate(`/rooms/${data.id || data._id || ''}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add room. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Add a Room</h1>
        <p className="page-subtitle">List your study space and start accepting bookings.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">

        {/* ── Room name ── */}
        <div>
          <label htmlFor="add-name" className="form-label">Room Name <span className="text-red-400">*</span></label>
          <input
            id="add-name"
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
          <label htmlFor="add-description" className="form-label">Description <span className="text-red-400">*</span></label>
          <textarea
            id="add-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Describe the room — ambiance, rules, nearby facilities… (min 20 chars)"
            className="form-input resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">{form.description.length} characters</p>
        </div>

        {/* ── Image URL ── */}
        <div>
          <label htmlFor="add-image" className="form-label">Image URL</label>
          <input
            id="add-image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/room-photo.jpg"
            className="form-input"
          />
        </div>

        {/* ── Floor / Capacity / Rate ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="add-floor" className="form-label">Floor <span className="text-red-400">*</span></label>
            <input
              id="add-floor"
              name="floor"
              type="number"
              min="0"
              value={form.floor}
              onChange={handleChange}
              required
              placeholder="e.g. 2"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="add-capacity" className="form-label">Capacity <span className="text-red-400">*</span></label>
            <input
              id="add-capacity"
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              required
              placeholder="e.g. 6"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="add-rate" className="form-label">Hourly Rate ($) <span className="text-red-400">*</span></label>
            <input
              id="add-rate"
              name="hourlyRate"
              type="number"
              min="1"
              value={form.hourlyRate}
              onChange={handleChange}
              required
              placeholder="e.g. 10"
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
            id="add-room-submit"
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 sm:flex-none sm:w-48"
          >
            {loading ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" /> : null}
            {loading ? 'Publishing…' : 'Publish Listing'}
          </button>
          <button
            type="button"
            onClick={() => setForm(EMPTY_FORM)}
            disabled={loading}
            className="btn-secondary px-6"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRoom
