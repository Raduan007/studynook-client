import { useState } from 'react'
import toast from 'react-hot-toast'
import useTitle from '../hooks/useTitle'

const AddRoom = () => {
  useTitle('Add Room')
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    seats: '',
    description: '',
    amenities: '',
    image: '',
  })

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: connect to backend API
    toast.success('Room listed successfully!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Add a Room</h1>
        <p className="text-slate-500">List your study space and start earning.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="room-title" className="block text-sm font-medium text-slate-700 mb-1.5">Room Title</label>
            <input
              id="room-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Quiet Corner Studio"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>
          <div>
            <label htmlFor="room-location" className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input
              id="room-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g. New York, NY"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>
          <div>
            <label htmlFor="room-price" className="block text-sm font-medium text-slate-700 mb-1.5">Price per Hour ($)</label>
            <input
              id="room-price"
              name="price"
              type="number"
              min="1"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>
          <div>
            <label htmlFor="room-seats" className="block text-sm font-medium text-slate-700 mb-1.5">Seats Available</label>
            <input
              id="room-seats"
              name="seats"
              type="number"
              min="1"
              value={form.seats}
              onChange={handleChange}
              required
              placeholder="e.g. 4"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="room-description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            id="room-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Describe your room — ambiance, rules, nearby facilities..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition resize-none"
          />
        </div>

        <div>
          <label htmlFor="room-amenities" className="block text-sm font-medium text-slate-700 mb-1.5">Amenities (comma-separated)</label>
          <input
            id="room-amenities"
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="e.g. WiFi, AC, Whiteboard, Coffee"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
          />
        </div>

        <div>
          <label htmlFor="room-image" className="block text-sm font-medium text-slate-700 mb-1.5">Image URL</label>
          <input
            id="room-image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition"
          >
            Publish Listing
          </button>
          <button
            type="reset"
            onClick={() => setForm({ title: '', location: '', price: '', seats: '', description: '', amenities: '', image: '' })}
            className="border border-slate-200 text-slate-600 font-medium px-6 py-2.5 rounded-lg hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRoom
