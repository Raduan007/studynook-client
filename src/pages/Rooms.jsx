import { useMemo, useState } from 'react'
import useTitle from '../hooks/useTitle'
import useRooms from '../hooks/useRooms'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'

// ── All unique amenities derived from the full room list ─────────────────────
const deriveAmenities = (rooms) => {
  const set = new Set()
  rooms.forEach((r) => (r.amenities || []).forEach((a) => set.add(a)))
  return Array.from(set).sort()
}

// ── Search icon ───────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
)

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ query, amenity }) => (
  <div className="col-span-full flex flex-col items-center py-24 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">No rooms found</h3>
    <p className="text-sm text-slate-500 max-w-xs">
      {query && amenity
        ? `No rooms matching "${query}" with amenity "${amenity}".`
        : query
        ? `No rooms matching "${query}".`
        : amenity
        ? `No rooms with the amenity "${amenity}".`
        : 'There are no rooms available right now.'}
    </p>
  </div>
)

// ── Error state ───────────────────────────────────────────────────────────────
const ErrorState = ({ message }) => (
  <div className="col-span-full flex flex-col items-center py-24 text-center">
    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-700 mb-1">Failed to load rooms</h3>
    <p className="text-sm text-slate-500">{message}</p>
  </div>
)

// ── Page ──────────────────────────────────────────────────────────────────────
const Rooms = () => {
  useTitle('Available Rooms')

  const { rooms, loading, error } = useRooms()

  const [query, setQuery] = useState('')
  const [activeAmenity, setActiveAmenity] = useState('')

  // Derived list of unique amenities for the filter chips
  const amenityOptions = useMemo(() => deriveAmenities(rooms), [rooms])

  // Client-side filter — runs only when rooms, query, or activeAmenity changes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rooms.filter((room) => {
      const matchesSearch =
        !q ||
        room.name?.toLowerCase().includes(q) ||
        room.description?.toLowerCase().includes(q)

      const matchesAmenity =
        !activeAmenity ||
        (room.amenities || []).includes(activeAmenity)

      return matchesSearch && matchesAmenity
    })
  }, [rooms, query, activeAmenity])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="page-title">Browse Rooms</h1>
        <p className="page-subtitle">
          {loading ? 'Loading available spaces…' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon />
          </span>
          <input
            id="rooms-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or description…"
            className="form-input pl-9"
          />
        </div>
      </div>

      {/* ── Amenity filter chips ── */}
      {!loading && !error && amenityOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {/* "All" pill */}
          <button
            onClick={() => setActiveAmenity('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
              !activeAmenity
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            All
          </button>

          {amenityOptions.map((amenity) => (
            <button
              key={amenity}
              onClick={() =>
                setActiveAmenity((prev) => (prev === amenity ? '' : amenity))
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                activeAmenity === amenity
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      )}

      {/* ── Results count (when filters active) ── */}
      {!loading && !error && (query || activeAmenity) && (
        <p className="text-xs text-slate-400 mb-4">
          Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {query && <> for &ldquo;{query}&rdquo;</>}
          {activeAmenity && <> · amenity: <strong className="text-slate-500">{activeAmenity}</strong></>}
        </p>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Loading */}
        {loading && (
          <div className="col-span-full flex justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error */}
        {!loading && error && <ErrorState message={error} />}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState query={query} amenity={activeAmenity} />
        )}

        {/* Cards */}
        {!loading && !error &&
          filtered.map((room) => <RoomCard key={room.id || room._id} room={room} />)}
      </div>
    </div>
  )
}

export default Rooms
