import { Link } from 'react-router-dom'
import useTitle from '../hooks/useTitle'
import useRooms from '../hooks/useRooms'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Mock data (replace with real API call) ──────────────────────────────────
const SAMPLE_ROOMS = [
  {
    id: '1',
    name: 'The Quiet Corner',
    description:
      'A serene, private study room designed for deep focus. Floor-to-ceiling bookshelves, ergonomic seating, and perfect acoustics make this the ideal space for long study sessions.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    floor: 2,
    capacity: 4,
    hourlyRate: 8,
    amenities: ['WiFi', 'Whiteboard', 'AC', 'Projector'],
  },
  {
    id: '2',
    name: 'Collaborative Hub',
    description:
      'Spacious open room built for group work and brainstorming. Moveable furniture lets you reconfigure the layout to suit any team dynamic or project.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    floor: 3,
    capacity: 12,
    hourlyRate: 15,
    amenities: ['WiFi', 'Whiteboard', 'TV Screen', 'Coffee Station', 'Locker'],
  },
  {
    id: '3',
    name: 'Solo Focus Pod',
    description:
      'A compact, distraction-free pod perfect for solo study. Soundproof panels and warm lighting keep your mind locked in, no matter what is happening outside.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    floor: 1,
    capacity: 1,
    hourlyRate: 5,
    amenities: ['WiFi', 'AC', 'Power Outlets'],
  },
  {
    id: '4',
    name: 'Sunrise Reading Room',
    description:
      'Floor-to-ceiling east-facing windows flood this room with natural morning light. Comfortable lounge chairs and a curated book collection create a calm reading atmosphere.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    floor: 4,
    capacity: 6,
    hourlyRate: 10,
    amenities: ['WiFi', 'Natural Light', 'Lounge Seating', 'AC'],
  },
  {
    id: '5',
    name: 'Tech Lab Suite',
    description:
      'Equipped with high-performance workstations, dual monitors, and ultra-fast internet, this room is ideal for developers, designers, and data scientists who need serious computing power.',
    image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
    floor: 2,
    capacity: 8,
    hourlyRate: 20,
    amenities: ['WiFi', 'Workstations', 'Dual Monitors', 'Printer', 'AC'],
  },
  {
    id: '6',
    name: 'Garden View Lounge',
    description:
      'Study amid lush greenery. This semi-open room overlooks a landscaped garden, offering fresh air and a calming backdrop to keep stress at bay during long study marathons.',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    floor: 1,
    capacity: 5,
    hourlyRate: 7,
    amenities: ['WiFi', 'Garden View', 'Lounge Seating', 'Snack Bar'],
  },
]

// ── Why Choose StudyNook data ────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    ),
    title: 'Easy Discovery',
    desc: 'Browse and filter rooms by floor, capacity, price, and available amenities in seconds.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Instant Booking',
    desc: 'Reserve your spot in a few clicks — no phone calls, no waiting, no hassle.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 013 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.162-.571-4.19-1.573-5.945" />
      </svg>
    ),
    title: 'Verified Spaces',
    desc: 'Every room is reviewed and quality-checked so you always know exactly what you are getting.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
      </svg>
    ),
    title: 'Flexible Hours',
    desc: 'Book by the hour or the day. Extend on the fly whenever you need more time.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Honest Reviews',
    desc: 'Real ratings from real students. Make informed decisions every time you book.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: 'Transparent Pricing',
    desc: 'No hidden fees. The rate you see is exactly what you pay — clear and straightforward.',
  },
]

// ── How Booking Works steps ──────────────────────────────────────────────────
const HOW_STEPS = [
  {
    step: '01',
    title: 'Browse Rooms',
    desc: 'Explore available study rooms. Filter by floor, capacity, and the amenities that matter most to you.',
  },
  {
    step: '02',
    title: 'Pick a Time Slot',
    desc: 'Choose your preferred date and hourly time slot on the room\'s availability calendar.',
  },
  {
    step: '03',
    title: 'Confirm & Pay',
    desc: 'Review your booking summary and complete secure payment in just a few seconds.',
  },
  {
    step: '04',
    title: 'Show Up & Study',
    desc: 'Arrive at your booked room, check in effortlessly, and enjoy your focused study session.',
  },
]

// ── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  useTitle('Home')

  const { rooms: fetchedRooms, loading, error } = useRooms()

  // Show up to 6 latest rooms; fall back to sample data during development
  const rooms = (fetchedRooms.length > 0 ? fetchedRooms : SAMPLE_ROOMS).slice(0, 6)

  return (
    <div>
      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative bg-slate-900 text-white overflow-hidden min-h-[560px] flex items-center"
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80"
          alt="Modern study room"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">
              Your Premium Study Space
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find Your Perfect{' '}
              <span className="text-indigo-400">Study Room</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
              Discover cozy, distraction-free study rooms. Book by the hour, focus
              better, and achieve more — all in one place.
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              Explore Rooms
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Rooms ── */}
      <section id="latest-rooms" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Latest Rooms
              </h2>
              <p className="text-slate-500 mt-1 text-sm sm:text-base">
                Freshly listed spaces ready to book.
              </p>
            </div>
            <Link
              to="/rooms"
              className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Could not load latest rooms. Showing sample data.
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" label="Loading rooms" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {rooms.map((room) => (
                <RoomCard key={room.id || room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose StudyNook ── */}
      <section id="why-studynook" className="bg-slate-50 border-y border-slate-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
              Why Choose StudyNook?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
              Everything you need to find the perfect environment for deep work and
              focused learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_ITEMS.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Booking Works ── */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
              How Booking Works
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
              Getting your study room is quick and painless — just four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-slate-200 z-0"
            />

            {HOW_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center">
                {/* Step badge */}
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mb-5 ring-4 ring-white shadow-sm">
                  {step}
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA under steps */}
          <div className="mt-14 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
