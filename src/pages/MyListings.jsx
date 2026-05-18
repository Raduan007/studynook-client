import useTitle from '../hooks/useTitle'

const MyListings = () => {
  useTitle('My Listings')

  const placeholderListings = [
    { id: 1, title: 'Quiet Corner Studio', location: 'New York, NY', price: 10, status: 'Active' },
    { id: 2, title: 'Bright Focus Room', location: 'Brooklyn, NY', price: 8, status: 'Inactive' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">My Listings</h1>
          <p className="text-slate-500">Manage the study rooms you&apos;ve listed.</p>
        </div>
        <a
          href="/add-room"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Room
        </a>
      </div>

      {placeholderListings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏚️</div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">No listings yet</h2>
          <p className="text-slate-500 mb-6">Start by adding your first study room.</p>
          <a href="/add-room" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition">
            Add a Room
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">#</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Title</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Location</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Price/hr</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {placeholderListings.map((room, i) => (
                <tr key={room.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-slate-400">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{room.title}</td>
                  <td className="px-6 py-4 text-slate-500">{room.location}</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">${room.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        room.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium transition">Edit</button>
                      <button className="text-red-500 hover:text-red-700 font-medium transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyListings
