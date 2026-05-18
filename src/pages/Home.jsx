import useTitle from '../hooks/useTitle'

const Home = () => {
  useTitle('Home')

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Find Your Perfect <br className="hidden sm:block" />
            <span className="text-cyan-200">Study Space</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Discover cozy, distraction-free study rooms near you. Book by the hour, focus better, achieve more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition shadow-lg"
            >
              Browse Rooms
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Study Rooms' },
            { value: '12K+', label: 'Happy Students' },
            { value: '50+', label: 'Cities' },
            { value: '4.9★', label: 'Avg. Rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-indigo-600">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Why StudyNook?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Everything you need to find the perfect environment for deep work and learning.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: 'Easy Discovery',
              desc: 'Search and filter rooms by location, amenities, price, and availability.',
            },
            {
              icon: '⚡',
              title: 'Instant Booking',
              desc: 'Reserve your spot in seconds. No phone calls, no waiting.',
            },
            {
              icon: '🛡️',
              title: 'Verified Spaces',
              desc: 'All rooms are reviewed and verified to ensure quality standards.',
            },
            {
              icon: '📅',
              title: 'Flexible Hours',
              desc: 'Book by the hour, half-day, or full day — whatever suits your schedule.',
            },
            {
              icon: '💬',
              title: 'Real Reviews',
              desc: 'Read honest reviews from fellow students before you book.',
            },
            {
              icon: '💰',
              title: 'Best Prices',
              desc: 'Transparent pricing with no hidden fees. Always know what you pay.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-cyan-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to focus?</h2>
          <p className="text-indigo-100 mb-8">Join thousands of students who found their perfect study space on StudyNook.</p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition shadow-lg"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
