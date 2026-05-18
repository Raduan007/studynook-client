import useTitle from '../hooks/useTitle'

const Rooms = () => {
  useTitle('Browse Rooms')

  const placeholderRooms = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Study Room ${i + 1}`,
    location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle'][i],
    price: [8, 12, 10, 7, 15, 9][i],
    rating: (4 + Math.random() * 0.9).toFixed(1),
    seats: [4, 8, 6, 2, 10, 4][i],
    tag: ['Quiet Zone', 'Group Friendly', 'WiFi+', 'Solo Focus', 'Premium', 'Budget'][i],
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Browse Rooms</h1>
        <p className="text-slate-500">Find the perfect study space for your needs.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['All', 'Quiet Zone', 'Group Friendly', 'Solo Focus', 'Premium'].map((f) => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
              f === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="h-44 bg-gradient-to-br from-indigo-100 to-cyan-100 relative flex items-center justify-center">
              <span className="text-5xl">🏫</span>
              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {room.tag}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 transition">{room.title}</h2>
                <span className="text-sm font-bold text-indigo-600">${room.price}/hr</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {room.location}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">👥 {room.seats} seats</span>
                <span className="text-amber-500 font-medium">★ {room.rating}</span>
              </div>
              <button className="mt-4 w-full bg-indigo-50 text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rooms
