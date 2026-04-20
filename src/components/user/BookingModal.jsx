import { useState } from 'react'
import { X, Calendar, Clock, MapPin, Package } from 'lucide-react'
import { bookingAPI } from '../../services/api'

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
]

const BookingModal = ({ vendor, service, onClose, onSuccess }) => {
  const [form, setForm] = useState({ date: '', timeSlot: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.timeSlot) { setError('Please select a time slot'); return }
    setLoading(true)
    setError('')
    try {
      await bookingAPI.create({
        vendorId:  vendor._id,
        serviceId: service._id,
        date:      form.date,
        timeSlot:  form.timeSlot,
        address:   form.address,
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">Book Service</h2>
            <p className="text-sm text-gray-500 mt-0.5">{vendor.businessName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Service summary */}
        <div className="mx-6 my-4 p-4 bg-orange-50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-brand" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{service.serviceName}</p>
            <p className="text-xs text-gray-500">{service.description}</p>
          </div>
          <span className="font-display font-extrabold text-brand text-lg">₹{service.price}</span>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

          {/* Date */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand" /> Select Date
            </label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="input"
            />
          </div>

          {/* Time slot */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand" /> Select Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setForm({ ...form, timeSlot: slot })}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.timeSlot === slot
                      ? 'bg-brand text-white border-brand'
                      : 'border-gray-200 text-gray-700 hover:border-brand hover:text-brand'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand" /> Service Address
            </label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              required
              rows={2}
              placeholder="Enter your full address..."
              className="input resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60"
          >
            {loading ? 'Confirming...' : `Confirm Booking — ₹${service.price}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal