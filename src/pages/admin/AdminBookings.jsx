import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import { adminAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'
import Pagination from '../../components/common/Pagination'

const STATUS_COLORS = {
  Pending:   'badge-orange',
  Accepted:  'badge-blue',
  Completed: 'badge-green',
  Rejected:  'badge-red',
  Cancelled: 'badge-gray',
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (statusFilter) params.status = statusFilter
      const { data } = await adminAPI.getBookings(params)
      setBookings(data.bookings || [])
      setTotalPages(Math.ceil((data.total || 0) / 10))
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [page, statusFilter])

  return (
    <div className="animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">All Bookings</h1>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">All Status</option>
          {['Pending', 'Accepted', 'Completed', 'Rejected', 'Cancelled'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : bookings.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No bookings found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b._id} className="card p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-display font-bold text-gray-900">
                        {b.serviceId?.serviceName || 'Service'}
                      </p>
                      <span className={`badge ${STATUS_COLORS[b.status] || 'badge-gray'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      <span>👤 {b.userId?.name}</span>
                      <span>🏪 {b.vendorId?.businessName}</span>
                      <span>💰 ₹{b.serviceId?.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                      <span>📅 {new Date(b.date).toLocaleDateString()}</span>
                      <span>🕐 {b.timeSlot}</span>
                      <span>📍 {b.address}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default AdminBookings