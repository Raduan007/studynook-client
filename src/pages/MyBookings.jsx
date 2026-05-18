import useTitle from '../hooks/useTitle'

const MyBookings = () => {
  useTitle('My Bookings')

  const placeholderBookings = [
    { id: 1, room: 'Quiet Corner Studio', date: '2026-05-20', time: '10:00 AM – 12:00 PM', total: 20, status: 'Confirmed' },
    { id: 2, room: 'Bright Focus Room', date: '2026-05-22', time: '2:00 PM – 5:00 PM', total: 24, status: 'Pending' },
    { id: 3, room: 'Premium Suite 4', date: '2026-05-15', time: '9:00 AM – 11:00 AM', total: 30, status: 'Completed' },
  ]

  const statusColors = {
    Confirmed: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Completed: 'bg-slate-100 text-slate-500',
    Cancelled: 'bg-red-100 text-red-600',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">My Bookings</h1>
        <p className="text-slate-500">Track all your study room reservations.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: 3, color: 'text-indigo-600' },
          { label: 'Confirmed', value: 1, color: 'text-emerald-600' },
          { label: 'Pending', value: 1, color: 'text-amber-600' },
          { label: 'Completed', value: 1, color: 'text-slate-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">#</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Room</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Time</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Total</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {placeholderBookings.map((booking, i) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-slate-400">{i + 1}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{booking.room}</td>
                <td className="px-6 py-4 text-slate-500">{booking.date}</td>
                <td className="px-6 py-4 text-slate-500">{booking.time}</td>
                <td className="px-6 py-4 text-indigo-600 font-semibold">${booking.total}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {booking.status === 'Pending' || booking.status === 'Confirmed' ? (
                    <button className="text-red-500 hover:text-red-700 font-medium transition text-sm">Cancel</button>
                  ) : (
                    <span className="text-slate-300 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyBookings
