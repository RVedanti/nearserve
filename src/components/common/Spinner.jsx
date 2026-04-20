const Spinner = ({ full, size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const spinner = (
    <div
      className={`${sizes[size]} border-4 border-gray-200 rounded-full animate-spin`}
      style={{ borderTopColor: '#E8340A' }}
    />
  )

  if (full) return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        {spinner}
        <span className="text-sm text-gray-500 font-medium">Loading...</span>
      </div>
    </div>
  )

  return spinner
}

export default Spinner