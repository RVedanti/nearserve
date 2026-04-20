import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Package } from 'lucide-react'
import { vendorAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

const STATUS_COLORS = {
  Pending: 'badge-orange', Accepted: 'badge-blue',
  Completed: 'badge-green', Rejected: 'badge-red', Cancelled: 'badge-gray'
}

const VendorBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = { page: 1, limit: 20 }
      if (statusFilter) params.status = statusFilter
      const { data } = await vendorAPI.getMyBookings(params)
      setBookings(data.bookings || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [statusFilter])

  const action = async (fn, id) => {
    try { await fn(id); fetchBookings() } catch {}
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Bookings</h1>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand focus:outline-none">
          <option value="">All</option>
          {['Pending','Accepted','Completed','Rejected'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : bookings.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b._id} className="card p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-bold text-gray-900">{b.userId?.name}</p>
                    <span className={`badge ${STATUS_COLORS[b.status] || 'badge-gray'}`}>{b.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {b.serviceId?.serviceName} — <span className="font-semibold text-brand">₹{b.serviceId?.price}</span>
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>📅 {new Date(b.date).toLocaleDateString()}</span>
                    <span>🕐 {b.timeSlot}</span>
                    <span>📍 {b.address}</span>
                    <span>📞 {b.userId?.phone}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {b.status === 'Pending' && (
                    <>
                      <button onClick={() => action(vendorAPI.acceptBooking, b._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button onClick={() => action(vendorAPI.rejectBooking, b._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {b.status === 'Accepted' && (
                    <button onClick={() => action(vendorAPI.completeBooking, b._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-brand text-white px-3 py-1.5 rounded-lg hover:bg-brand-dark transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorBookings