import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Package, Tag, Shield, LogOut, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

export const AdminDashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin',            label: 'Analytics',  icon: LayoutDashboard, end: true },
    { to: '/admin/vendors',    label: 'Vendors',    icon: Shield },
    { to: '/admin/users',      label: 'Users',      icon: Users },
    { to: '/admin/bookings',   label: 'Bookings',   icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 p-4 shrink-0">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-red-600 text-sm">A</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Admin</p>
              <span className="badge badge-red text-xs">Admin Panel</span>
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
        <button onClick={() => { logout(); navigate('/') }}
          className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 mt-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
      <main className="flex-1 min-w-0 p-5"><Outlet /></main>
    </div>
  )
}
export const AdminAnalytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="animate-fade-in max-w-5xl">
      <h1 className="section-title mb-2">Analytics Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Click any card to view details</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users',    val: stats?.totalUsers || 0,    icon: Users,      color: 'bg-blue-50 text-blue-600',   link: '/admin/users' },
          { label: 'Total Vendors',  val: stats?.totalVendors || 0,  icon: Shield,     color: 'bg-orange-50 text-brand',    link: '/admin/vendors' },
          { label: 'Total Bookings', val: stats?.totalBookings || 0, icon: Package,    color: 'bg-purple-50 text-purple-600', link: '/admin/bookings' },
          { label: 'Revenue',        val: `₹${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'bg-green-50 text-green-600', link: null },
        ].map(({ label, val, icon: Icon, color, link }) => (
          <div key={label}
            onClick={() => link && navigate(link)}
            className={`card p-4 flex items-center gap-3 ${link ? 'cursor-pointer hover:-translate-y-1 hover:shadow-card-hover' : ''} transition-all duration-200`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.split(' ')[0]}`}>
              <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-display font-bold text-gray-900 text-xl">{val}</p>
            </div>
            {link && <span className="ml-auto text-gray-300 text-lg">→</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Pending Vendors',    val: stats?.pendingVendors || 0,    color: 'text-orange-600', link: '/admin/vendors' },
          { label: 'Verified Vendors',   val: stats?.verifiedVendors || 0,   color: 'text-green-600',  link: '/admin/vendors' },
          { label: 'Completed Bookings', val: stats?.completedBookings || 0, color: 'text-brand',      link: '/admin/bookings' },
        ].map(({ label, val, color, link }) => (
          <div key={label}
            onClick={() => navigate(link)}
            className="card p-4 text-center cursor-pointer hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
          >
            <p className={`font-display font-extrabold text-3xl ${color}`}>{val}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
            <p className="text-xs text-brand mt-1">Click to view →</p>
          </div>
        ))}
      </div>
    </div>
  )
}