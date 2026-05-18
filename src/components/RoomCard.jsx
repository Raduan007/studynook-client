import { Link } from 'react-router-dom'

const RoomCard = ({ room }) => {
  const {
    id,
    _id,
    name,
    description,
    image,
    floor,
    capacity,
    hourlyRate,
    amenities = [],
  } = room

  const roomId = id || _id

  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100 shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
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

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name */}
        <h3 className="text-base font-semibold text-slate-800 leading-snug line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Meta */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
            Floor {floor}
          </li>
          <li className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.197-3.787M9 20H4v-2a4 4 0 015.197-3.787M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Up to {capacity}
          </li>
          <li className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2" />
            </svg>
            ${hourlyRate}/hr
          </li>
        </ul>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="inline-block text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full"
              >
                {a}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="inline-block text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="pt-1 mt-auto">
          <Link
            to={`/rooms/${roomId}`}
            className="block w-full text-center text-sm font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

export default RoomCard
