import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, User, LogOut, ChevronRight, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { bookingAPI } from '../../services/api'

const STATUS_COLORS = {
  Pending: 'badge-orange', Accepted: 'badge-blue',
  Completed: 'badge-green', Rejected: 'badge-red', Cancelled: 'badge-gray'
}

export const UserDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard',          label: 'Overview',    icon: LayoutDashboard, end: true },
    { to: '/dashboard/bookings', label: 'My Bookings', icon: Package },
    { to: '/dashboard/profile',  label: 'Profile',     icon: User },
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
              <span className="badge badge-orange text-xs">User</span>
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

export const UserOverview = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    bookingAPI.getMyBookings({ page: 1, limit: 20 })
      .then(r => setBookings(r.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})

  const statCards = [
    { label: 'Total Bookings', val: bookings.length,       color: 'text-blue-700',   filter: '' },
    { label: 'Pending',        val: counts.Pending || 0,   color: 'text-orange-600', filter: 'Pending' },
    { label: 'Completed',      val: counts.Completed || 0, color: 'text-green-600',  filter: 'Completed' },
    { label: 'Cancelled',      val: counts.Cancelled || 0, color: 'text-gray-500',   filter: 'Cancelled' },
  ]

  return (
    <div className="animate-fade-in max-w-3xl">
      <h1 className="section-title mb-1">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
      <p className="text-gray-500 text-sm mb-6">Here's a summary of your activity</p>

      {/* Stat cards — clickable, navigate to bookings with filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, val, color, filter }) => (
          <button
            key={label}
            onClick={() => navigate(`/dashboard/bookings${filter ? `?status=${filter}` : ''}`)}
            className="card p-4 text-left hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
          >
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`font-display font-extrabold text-2xl ${color}`}>{val}</p>
          </button>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-900">Recent Bookings</h2>
          <NavLink to="/dashboard/bookings"
            className="text-sm text-brand font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
        {loading ? <p className="text-sm text-gray-400">Loading...</p> : bookings.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              No bookings yet.{' '}
              <NavLink to="/vendors" className="text-brand hover:underline">Browse vendors</NavLink>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map(b => (
              <div key={b._id}
                onClick={() => navigate(`/vendors/${b.vendorId?._id}`)}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {b.serviceId?.serviceName || b.serviceId?.name || '—'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {b.vendorId?.businessName || '—'} • {new Date(b.date).toLocaleDateString()} • {b.timeSlot}
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