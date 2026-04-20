import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, MapPin, CheckCircle, Clock, ChevronLeft, MessageSquare, Package } from 'lucide-react'
import { vendorAPI, serviceAPI, reviewAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import StarRating from '../../components/common/StarRating'
import Spinner from '../../components/common/Spinner'
import BookingModal from '../../components/user/BookingModal'

const VendorDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [services, setServices] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [activeTab, setActiveTab] = useState('services')

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, sRes, rRes] = await Promise.all([
          vendorAPI.getById(id),
          serviceAPI.getByVendor(id),
          reviewAPI.getByVendor(id),
        ])
        setVendor(vRes.data.vendor)
        setServices(sRes.data.services || [])
        setReviews(rRes.data.reviews || [])
      } catch { navigate('/vendors') } finally { setLoading(false) }
    }
    load()
  }, [id, navigate])

  if (loading) return <Spinner full />
  if (!vendor) return null

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto px-4 pt-5">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to vendors
        </button>
      </div>

      {/* Vendor header */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="card p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
              <span className="text-4xl font-black text-brand font-display">{vendor.businessName?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-2xl text-gray-900">{vendor.businessName}</h1>
                {vendor.isVerified && (
                  <span className="badge badge-green"><CheckCircle className="w-3 h-3" /> Verified</span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{vendor.description}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-800">{vendor.rating?.toFixed(1) || '—'}</span>
                  <span className="text-sm text-gray-500">({vendor.totalReviews || 0} reviews)</span>
                </div>
                {vendor.serviceAreas?.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    {vendor.serviceAreas.join(', ')}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit mb-6">
          {['services', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-brand text-white shadow-sm' : 'text-gray-600 hover:text-brand'
              }`}>
              {tab} {tab === 'reviews' && reviews.length > 0 && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No services listed yet</p>
              </div>
            ) : services.map(svc => (
              <div key={svc._id} className="card p-5 flex items-start justify-between gap-4 group">
                <div>
                  <h3 className="font-display font-bold text-gray-900 mb-1">{svc.serviceName}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{svc.description}</p>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-xl font-extrabold text-brand font-display">₹{svc.price}</span>
                    <span className="text-xs text-gray-400">fixed price</span>
                  </div>
                </div>
                <button
                  onClick={() => { if (!user) { navigate('/login'); return; } setSelectedService(svc) }}
                  className="btn-primary text-sm py-2 px-4 shrink-0 whitespace-nowrap">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No reviews yet</p>
              </div>
            ) : reviews.map(r => (
              <div key={r._id} className="card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand">{r.userId?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{r.userId?.name || 'Anonymous'}</p>
                      <StarRating value={r.rating} readonly size={4} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <BookingModal
          vendor={vendor}
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={() => { setSelectedService(null); navigate('/dashboard/bookings') }}
        />
      )}
    </div>
  )
}

export default VendorDetailPage