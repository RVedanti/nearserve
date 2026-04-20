import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, PlusCircle, Star, LogOut, ChevronRight, DollarSign, Clock, CheckCircle, User, AlertCircle, MapPin, Briefcase, FileText, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { vendorAPI, categoryAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

const STATUS_COLORS = {
  Pending: 'badge-orange', Accepted: 'badge-blue',
  Completed: 'badge-green', Rejected: 'badge-red', Cancelled: 'badge-gray'
}

export const VendorDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/vendor',          label: 'Overview',  icon: LayoutDashboard, end: true },
    { to: '/vendor/bookings', label: 'Bookings',  icon: Package },
    { to: '/vendor/services', label: 'Services',  icon: PlusCircle },
    { to: '/vendor/reviews',  label: 'Reviews',   icon: Star },
    { to: '/vendor/profile',  label: 'Profile',   icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 p-4 shrink-0">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand/10 rounded-full flex items-center justify-center">
              <span className="font-bold text-brand text-sm">{user?.name?.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
              <span className="badge badge-orange text-xs">Vendor</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon className="w-4 h-4 shrink-0" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
          <button onClick={() => navigate('/')}
            className="sidebar-link text-gray-500 hover:bg-gray-50 w-full">
            <Home className="w-4 h-4" /> Go to Homepage
          </button>
          <button onClick={() => { logout(); navigate('/') }}
            className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-5"><Outlet /></main>
    </div>
  )
}

// ── Create Profile Form (shown to brand-new vendors who have no profile yet) ──
const CreateProfileForm = ({ onCreated }) => {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ businessName: '', categoryId: '', description: '', serviceAreas: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await vendorAPI.createProfile({
        businessName: form.businessName,
        categoryId:   form.categoryId,
        description:  form.description,
        serviceAreas: form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      })
      onCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-lg mx-auto mt-8">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-brand" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900">Set Up Your Business</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Complete your business profile to start receiving bookings from customers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Business Name</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={form.businessName}
                onChange={e => setForm({ ...form, businessName: e.target.value })}
                placeholder="e.g. Sharma Plumbing Services"
                className="input pl-10" required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="input" required
            >
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
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Tell customers about your business and experience..."
                rows={3}
                className="input pl-10 resize-none" required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Service Areas <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={form.serviceAreas}
                onChange={e => setForm({ ...form, serviceAreas: e.target.value })}
                placeholder="Mumbai, Thane, Navi Mumbai"
                className="input pl-10"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Enter areas separated by commas</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
            {saving ? 'Creating Profile...' : 'Create Business Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export const VendorOverview = () => {
  const [profileExists, setProfileExists] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboard = () => {
    Promise.all([vendorAPI.getRevenue(), vendorAPI.getMyBookings({ limit: 5, page: 1 })])
      .then(([r, b]) => {
        setRevenue(r.data)
        setBookings(b.data.bookings || [])
        setProfileExists(true)
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setProfileExists(false)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadDashboard() }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  if (profileExists === false) {
    return <CreateProfileForm onCreated={() => { setLoading(true); loadDashboard() }} />
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <h1 className="section-title mb-6">Vendor Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue',  val: `₹${revenue?.totalRevenue || 0}`, icon: DollarSign,  color: 'bg-green-50 text-green-600' },
          { label: 'Total Bookings', val: revenue?.totalBookings || 0,      icon: Package,     color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending',        val: revenue?.pending || 0,            icon: Clock,       color: 'bg-orange-50 text-orange-600' },
          { label: 'Completed',      val: revenue?.completed || 0,          icon: CheckCircle, color: 'bg-orange-50 text-brand' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.split(' ')[0]}`}>
              <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-display font-bold text-gray-900 text-lg">{val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-900">Recent Bookings</h2>
          <NavLink to="/vendor/bookings"
            className="text-sm text-brand font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
        {bookings.length === 0
          ? <p className="text-sm text-gray-400 py-4 text-center">No bookings yet.</p>
          : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{b.userId?.name}</p>
                    <p className="text-xs text-gray-500">
                      {b.serviceId?.serviceName} • {new Date(b.date).toLocaleDateString()} {b.timeSlot}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[b.status] || 'badge-gray'}`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}