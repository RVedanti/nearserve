import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'

const categoryColors = {
  Cleaning:   'bg-blue-100 text-blue-700',
  Plumbing:   'bg-cyan-100 text-cyan-700',
  Electrical: 'bg-yellow-100 text-yellow-700',
  Salon:      'bg-pink-100 text-pink-700',
  Cooking:    'bg-orange-100 text-orange-700',
  default:    'bg-gray-100 text-gray-700',
}

const VendorCard = ({ vendor }) => {
  const { _id, businessName, description, rating, totalReviews, isVerified, categoryId, serviceAreas } = vendor
  const colorClass = categoryColors[categoryId?.name] || categoryColors.default

  return (
    <Link to={`/vendors/${_id}`} className="card block group overflow-hidden hover:-translate-y-1 transition-all duration-300">

      {/* Top color bar */}
      <div className="h-1.5 bg-gradient-to-r from-brand to-orange-400" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
              <span className="text-xl font-bold text-brand font-display">
                {businessName?.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-sm leading-tight group-hover:text-brand transition-colors">
                {businessName}
              </h3>
              {isVerified && (
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>
          {categoryId?.name && (
            <span className={`badge text-xs shrink-0 ${colorClass}`}>
              {categoryId.name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-gray-800">{rating?.toFixed(1) || '—'}</span>
            <span className="text-xs text-gray-400">({totalReviews || 0})</span>
          </div>
          {serviceAreas?.[0] && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {serviceAreas[0]}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
            <Clock className="w-3 h-3" /> Open
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VendorCard