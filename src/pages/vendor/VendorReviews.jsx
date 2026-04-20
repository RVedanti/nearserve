import { useState, useEffect } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { vendorAPI, reviewAPI } from '../../services/api'
import StarRating from '../../components/common/StarRating'
import Spinner from '../../components/common/Spinner'

const VendorReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ avg: 0, total: 0, breakdown: {} })

  useEffect(() => {
    const load = async () => {
      try {
        const vRes = await vendorAPI.getMyProfile()
        const vendorId = vRes.data.vendor._id
        const rRes = await reviewAPI.getByVendor(vendorId)
        const revs = rRes.data.reviews || []
        setReviews(revs)

        // Calculate stats
        if (revs.length > 0) {
          const avg = revs.reduce((sum, r) => sum + r.rating, 0) / revs.length
          const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          revs.forEach(r => { breakdown[r.rating] = (breakdown[r.rating] || 0) + 1 })
          setStats({ avg: avg.toFixed(1), total: revs.length, breakdown })
        }
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="animate-fade-in max-w-3xl">
      <h1 className="section-title mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-600 mb-1">No reviews yet</p>
          <p className="text-sm">Reviews will appear here after customers complete bookings</p>
        </div>
      ) : (
        <>
          {/* Rating summary */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="font-display font-black text-5xl text-brand">{stats.avg}</p>
                <StarRating value={Math.round(stats.avg)} readonly size={5} />
                <p className="text-sm text-gray-500 mt-1">{stats.total} reviews</p>
              </div>
              <div className="flex-1 space-y-2 min-w-48">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = stats.breakdown[star] || 0
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-4">{star}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-4">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand">
                        {r.userId?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{r.userId?.name || 'Anonymous'}</p>
                      <StarRating value={r.rating} readonly size={4} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default VendorReviews