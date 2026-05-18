const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-slate-200 border-t-indigo-600 animate-spin ${sizes[size] ?? sizes.md} ${className}`}
    />
  )
}

export default LoadingSpinner
