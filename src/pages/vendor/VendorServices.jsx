import { useState, useEffect } from 'react'
import { PlusCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { serviceAPI, vendorAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

const VendorServices = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState(null)
  const [noProfile, setNoProfile] = useState(false)
  const [form, setForm] = useState({ serviceName: '', description: '', price: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // ── Get vendor profile first ──────────────────────────────
  useEffect(() => {
    const getVendorAndServices = async () => {
      try {
        const profileRes = await vendorAPI.getMyProfile()
        const vid = profileRes.data.vendor._id
        setVendorId(vid)

        const serviceRes = await serviceAPI.getByVendor(vid)
        setServices(serviceRes.data.services || [])
      } catch (err) {
        if (err.response?.status === 404) {
          // Vendor has no profile yet — can't add services without one
          setNoProfile(true)
        } else {
          setError('Failed to load services. Please refresh and try again.')
        }
      } finally {
        setLoading(false)
      }
    }
    getVendorAndServices()
  }, [])

  const fetchServices = async () => {
    if (!vendorId) return
    try {
      const { data } = await serviceAPI.getByVendor(vendorId)
      setServices(data.services || [])
    } catch {}
  }

  // ── Validate form ─────────────────────────────────────────
  const validateForm = () => {
    const errors = {}
    if (!form.serviceName.trim()) errors.serviceName = 'Service name is required'
    else if (form.serviceName.trim().length < 3) errors.serviceName = 'Min 3 characters'
    if (!form.description.trim()) errors.description = 'Description is required'
    else if (form.description.trim().length < 10) errors.description = 'Min 10 characters'
    if (!form.price) errors.price = 'Price is required'
    else if (Number(form.price) <= 0) errors.price = 'Price must be greater than 0'
    else if (Number(form.price) > 100000) errors.price = 'Price cannot exceed ₹1,00,000'
    return errors
  }

  // ── Add service ───────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setAdding(true)
    try {
      await serviceAPI.create({
        serviceName: form.serviceName.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
      })
      setForm({ serviceName: '', description: '', price: '' })
      setFormErrors({})
      setShowForm(false)
      await fetchServices()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service. Try again.')
    } finally {
      setAdding(false)
    }
  }

  // ── Delete service ────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try {
      await serviceAPI.delete(id)
      await fetchServices()
    } catch {}
  }

  // ── Field change ──────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
    setFormErrors({ ...formErrors, [field]: '' })
    setError('')
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  // ── No profile yet — prompt vendor to create one first ────
  if (noProfile) {
    return (
      <div className="animate-fade-in max-w-3xl">
        <h1 className="section-title mb-6">My Services</h1>
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-brand" />
          </div>
          <h2 className="font-display font-bold text-gray-900 text-lg mb-2">
            Set Up Your Profile First
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            You need to create your business profile before you can add services.
          </p>
          <button
            onClick={() => navigate('/vendor/profile')}
            className="btn-primary mx-auto"
          >
            Go to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">My Services</h1>
          <p className="text-sm text-gray-500 mt-1">{services.length} service{services.length !== 1 ? 's' : ''} listed</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormErrors({}); setError('') }}
          className="btn-primary text-sm py-2"
        >
          <PlusCircle className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {/* Add service form */}
      {showForm && (
        <div className="card p-5 mb-6 border-2 border-orange-100">
          <h2 className="font-display font-bold text-gray-900 mb-4">Add New Service</h2>
          <form onSubmit={handleAdd} className="space-y-3">

            {/* Service Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Service Name</label>
              <input
                value={form.serviceName}
                onChange={e => handleChange('serviceName', e.target.value)}
                placeholder="e.g. Deep Home Cleaning"
                className={`input ${formErrors.serviceName ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {formErrors.serviceName && (
                <p className="text-xs text-red-500 mt-1">{formErrors.serviceName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe what this service includes..."
                rows={3}
                className={`input resize-none ${formErrors.description ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {formErrors.description && (
                <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Fixed Price (₹)</label>
              <input
                type="number"
                min={1}
                max={100000}
                value={form.price}
                onChange={e => handleChange('price', e.target.value)}
                placeholder="e.g. 999"
                className={`input ${formErrors.price ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {formErrors.price && (
                <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={adding} className="btn-primary text-sm py-2 disabled:opacity-60">
                {adding ? 'Adding...' : 'Add Service'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormErrors({}); setError('') }}
                className="btn-secondary text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services list */}
      {services.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <PlusCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-600 mb-1">No services yet</p>
          <p className="text-sm">Click "Add Service" to list your first service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(svc => (
            <div key={svc._id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-bold text-gray-900">{svc.serviceName}</h3>
                <button
                  onClick={() => handleDelete(svc._id)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">{svc.description}</p>
              <p className="font-extrabold text-brand font-display text-xl">₹{svc.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorServices