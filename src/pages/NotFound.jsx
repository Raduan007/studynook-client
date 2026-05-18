import { Link } from 'react-router-dom'
import useTitle from '../hooks/useTitle'

const NotFound = () => {
  useTitle('404 – Page Not Found')

  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center h-full">
      <div className="text-8xl font-extrabold text-indigo-100 select-none mb-2">404</div>
      <div className="text-5xl mb-6">🔍</div>
      <h1 className="page-title mb-3">Page Not Found</h1>
      <p className="page-subtitle max-w-sm mx-auto mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary px-6">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
        <Link to="/rooms" className="btn-secondary px-6">
          Browse Rooms
        </Link>
      </div>
    </div>
  )
}

export default NotFound
