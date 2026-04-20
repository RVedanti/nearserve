import { useState, useEffect } from 'react'
import { vendorAPI, categoryAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/common/Spinner'
import { MapPin, Briefcase, FileText, CheckCircle } from 'lucide-react'

const VendorProfile = () => {
  const { user } = useAuth()
  const [vendor, setVendor] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    businessName: '', categoryId: '', description: '', serviceAreas: ''
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, cRes] = await Promise.all([
          vendorAPI.getMyProfile(),
          categoryAPI.getAll(),
        ])
        const v = vRes.data.vendor
        setVendor(v)
        setCategories(cRes.data.categories || [])
        setForm({
          businessName: v.businessName || '',
          categoryId:   v.categoryId?._id || '',
          description:  v.description || '',
          serviceAreas: v.serviceAreas?.join(', ') || '',
        })
      } catch (err) {
        setError('Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await vendorAPI.updateProfile({
        businessName: form.businessName,
        categoryId:   form.categoryId,
        description:  form.description,
        serviceAreas: form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      })
      setVendor(data.vendor)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Business Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2">
            Edit Profile
          </button>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      {/* Verification status */}
      <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
        vendor?.isVerified ? 'bg-green-50 text-green-700 border border-green-200' :
        vendor?.isBlocked  ? 'bg-red-50 text-red-700 border border-red-200' :
        'bg-orange-50 text-orange-700 border border-orange-200'
      }`}>
        {vendor?.isVerified ? '✅ Your profile is verified and visible to customers' :
         vendor?.isBlocked  ? '🚫 Your profile has been blocked by admin' :
         '⏳ Your profile is pending admin approval'}
      </div>

      {editing ? (
        <div className="card p-6">
          <h2 className="font-display font-bold text-gray-900 mb-4">Edit Business Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Business Name</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input value={form.businessName}
                  onChange={e => setForm({ ...form, businessName: e.target.value })}
                  placeholder="Your business name" className="input pl-10" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
              <select value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="input" required>
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <textarea value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your business..." rows={3}
                  className="input pl-10 resize-none" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Service Areas <span className="text-gray-400 font-normal">(comma separated)</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input value={form.serviceAreas}
                  onChange={e => setForm({ ...form, serviceAreas: e.target.value })}
                  placeholder="Mumbai, Thane, Navi Mumbai"
                  className="input pl-10" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter areas separated by commas</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm py-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card p-6 space-y-5">
          {[
            { label: 'Business Name', value: vendor?.businessName, icon: Briefcase },
            { label: 'Category', value: `${vendor?.categoryId?.icon || ''} ${vendor?.categoryId?.name || '—'}`, icon: null },
            { label: 'Description', value: vendor?.description || '—', icon: FileText },
            { label: 'Service Areas', value: vendor?.serviceAreas?.join(', ') || '—', icon: MapPin },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              {Icon && <Icon className="w-4 h-4 text-brand mt-0.5 shrink-0" />}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-gray-800 font-medium text-sm">{value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 pt-1">
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-brand">{vendor?.rating?.toFixed(1) || '0.0'}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-gray-900">{vendor?.totalReviews || 0}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorProfile