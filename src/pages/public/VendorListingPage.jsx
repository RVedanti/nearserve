import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, MapPin } from 'lucide-react'
import { vendorAPI, categoryAPI } from '../../services/api'
import VendorCard from '../../components/common/VendorCard'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import { useCity } from '../../context/CityContext'

const VendorListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { city, changeCity, SUPPORTED_CITIES } = useCity()
  const [vendors, setVendors] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search:    searchParams.get('search')    || '',
    category:  searchParams.get('category') || '',
    minRating: searchParams.get('minRating')|| '',
    page:      Number(searchParams.get('page')) || 1,
  })

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => {})
  }, [])

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page: filters.page, limit: 12 }
      if (filters.search)    params.search    = filters.search
      if (filters.category)  params.category  = filters.category
      if (filters.minRating) params.minRating = filters.minRating
      if (city)              params.city      = city   // ← city filter
      const { data } = await vendorAPI.getAll(params)
      setVendors(data.vendors || [])
      setTotal(data.total || 0)
    } catch { setVendors([]) } finally { setLoading(false) }
  }, [filters, city])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value, page: 1 }
    setFilters(updated)
    const p = new URLSearchParams()
    Object.entries(updated).forEach(([k, v]) => { if (v) p.set(k, v) })
    setSearchParams(p)
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', minRating: '', page: 1 })
    setSearchParams({})
  }

  const totalPages = Math.ceil(total / 12)
  const hasFilters = filters.category || filters.minRating

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 items-center flex-wrap">

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 min-w-[180px]">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input type="text" value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              placeholder="Search vendors, services..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400" />
            {filters.search && (
              <button onClick={() => updateFilter('search', '')}><X className="w-4 h-4 text-gray-400" /></button>
            )}
          </div>

          {/* Category */}
          <div className="relative hidden md:block">
            <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-700 focus:border-brand focus:outline-none cursor-pointer">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Rating */}
          <div className="relative hidden md:block">
            <select value={filters.minRating} onChange={e => updateFilter('minRating', e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-700 focus:border-brand focus:outline-none cursor-pointer">
              <option value="">Any Rating</option>
              {[4.5, 4, 3.5, 3].map(r => <option key={r} value={r}>⭐ {r}+</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mobile filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-2 border rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${showFilters ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-700'}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-brand font-medium hover:underline shrink-0">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="md:hidden px-4 py-3 border-t border-gray-100 flex gap-3 overflow-x-auto">
            <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}
              className="shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand focus:outline-none">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
            <select value={filters.minRating} onChange={e => updateFilter('minRating', e.target.value)}
              className="shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand focus:outline-none">
              <option value="">Any Rating</option>
              {[4.5, 4, 3.5, 3].map(r => <option key={r} value={r}>⭐ {r}+</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* City indicator */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? 'Searching...' : (
              <>
                <span className="font-semibold text-gray-800">{total}</span> vendors found
                {city && <> in <span className="text-brand font-semibold">📍 {city}</span></>}
              </>
            )}
          </p>
          {!city && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Filter by city:</span>
              {SUPPORTED_CITIES.map(c => (
                <button key={c} onClick={() => changeCity(c)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 hover:border-brand hover:text-brand transition-colors">
                  📍 {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">No vendors found</h3>
            <p className="text-gray-500 text-sm">
              {city ? `No vendors in ${city} match your search.` : 'Try different keywords or clear your filters.'}
            </p>
            <button onClick={clearFilters} className="btn-primary mt-5 text-sm py-2.5">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vendors.map(v => <VendorCard key={v._id} vendor={v} />)}
            </div>
            <Pagination page={filters.page} totalPages={totalPages} onPageChange={p => updateFilter('page', p)} />
          </>
        )}
      </div>
    </div>
  )
}

export default VendorListingPage