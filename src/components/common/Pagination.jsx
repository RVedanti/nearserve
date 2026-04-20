import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-gray-200 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Pages */}
      {visible.reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) {
          acc.push(<span key={`dot-${p}`} className="px-1 text-gray-400">…</span>)
        }
        acc.push(
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
              p === page
                ? 'bg-brand text-white'
                : 'border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
            }`}
          >
            {p}
          </button>
        )
        return acc
      }, [])}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-gray-200 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Pagination