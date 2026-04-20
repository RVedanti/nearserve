import { useState, useEffect } from 'react'
import { X, Package } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { bookingAPI, reviewAPI } from '../../services/api'
import StarRating from '../../components/common/StarRating'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'

const STATUS_COLORS = {
  Pending:   'badge-orange',
  Accepted:  'badge-blue',
  Completed: 'badge-green',
  Rejected:  'badge-red',
  Cancelled: 'badge-gray',
}

const ReviewModal = ({ booking, onClose, onDone }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await reviewAPI.create({ vendorId: booking.vendorId._id, rating, comment })
      onDone()
    } catch {} finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Leave a Review</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {booking.vendorId?.businessName} — {booking.serviceId?.serviceName}
        </p>
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your Rating</p>
          <StarRating value={rating} onChange={setRating} size={7} />
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          rows={3} placeholder="Share your experience..." className="input resize-none mb-4" />
        <button onClick={submit} disabled={loading || !comment.trim()}
          className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}

const UserBookings = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [bookings, setBookings] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [reviewBooking, setReviewBooking] = useState(null)

  // Read status filter from URL so stat cards work
  const statusFilter = searchParams.get('status') || ''

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 8 }
      if (statusFilter) params.status = statusFilter
      const { data } = await bookingAPI.getMyBookings(params)
      setBookings(data.bookings || [])
      setTotalPages(Math.ceil((data.total || 0) / 8))
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [page, statusFilter])

  const setStatusFilter = (val) => {
    setPage(1)
    if (val) setSearchParams({ status: val })
    else setSearchParams({})
  }

  const cancel = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Cancel this booking?')) return
    try { await bookingAPI.cancel(id); fetchBookings() } catch {}
  }

  const handleReviewClick = (e, booking) => {
    e.stopPropagation()
    setReviewBooking(booking)
  }

  const handleCardClick = (vendorId) => {
    if (vendorId) navigate(`/vendors/${vendorId}`)
  }

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">My Bookings</h1>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">All Status</option>
          {['Pending', 'Accepted', 'Completed', 'Rejected', 'Cancelled'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="font-display font-bold text-gray-700 mb-1">No bookings found</h3>
          <p className="text-sm text-gray-500">
            {statusFilter ? `No ${statusFilter} bookings.` : "You haven't made any bookings yet."}
          </p>
          <button onClick={() => navigate('/vendors')} className="btn-primary mt-4 text-sm py-2">
            Browse Vendors
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div
              key={b._id}
              onClick={() => handleCardClick(b.vendorId?._id)}
              className="card p-5 cursor-pointer hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <p className="font-display font-bold text-gray-900">
                    {b.serviceId?.serviceName || b.serviceId?.name || 'Unnamed Service'}
                  </p>
                  <p className="text-sm text-brand font-medium mt-0.5">
                    {b.vendorId?.businessName || 'Vendor'}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>📅 {new Date(b.date).toLocaleDateString()}</span>
                    <span>🕐 {b.timeSlot}</span>
                    <span>📍 {b.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${STATUS_COLORS[b.status] || 'badge-gray'}`}>
                    {b.status}
                  </span>
                  {b.status === 'Pending' && (
                    <button
                      onClick={(e) => cancel(e, b._id)}
                      className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {b.status === 'Completed' && (
                    <button
                      onClick={(e) => handleReviewClick(e, b)}
                      className="text-xs text-brand font-semibold bg-orange-50 px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onDone={() => { setReviewBooking(null); fetchBookings() }}
        />
      )}
    </div>
  )
}

export default UserBookings