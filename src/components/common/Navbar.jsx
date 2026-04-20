import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, ChevronDown, User, Package, LogOut, LayoutDashboard, Menu, X, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCity } from '../../context/CityContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { city, changeCity, clearCity, SUPPORTED_CITIES } = useCity()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [cityDropOpen, setCityDropOpen] = useState(false)
  const dropRef = useRef(null)
  const cityDropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (cityDropRef.current && !cityDropRef.current.contains(e.target)) setCityDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const dashboardLink =
    user?.role === 'admin'  ? '/admin' :
    user?.role === 'vendor' ? '/vendor' : '/dashboard'

  const profileLink =
    user?.role === 'vendor' ? '/vendor/profile' : '/dashboard/profile'

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-gray-900">
            Near<span className="text-brand">Serve</span>
          </span>
        </Link>

        {/* City picker */}
        <div className="relative hidden md:block" ref={cityDropRef}>
          <button
            onClick={() => setCityDropOpen(!cityDropOpen)}
            className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <span className="font-medium">{city || 'Select City'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {cityDropOpen && (
            <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
              <p className="text-xs text-gray-400 font-medium px-4 py-1">Select your city</p>
              {SUPPORTED_CITIES.map(c => (
                <button key={c}
                  onClick={() => { changeCity(c); setCityDropOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-orange-50 hover:text-brand transition-colors ${city === c ? 'text-brand font-semibold' : 'text-gray-700'}`}>
                  <MapPin className="w-3.5 h-3.5" />
                  {c}
                  {city === c && <span className="ml-auto text-xs">✓</span>}
                </button>
              ))}
              {city && (
                <div className="border-t border-gray-100 mt-1">
                  <button onClick={() => { clearCity(); setCityDropOpen(false) }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
                    Clear city filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/vendors" className="nav-link px-3 py-2 rounded-lg hover:bg-gray-50">Browse</Link>
          {!user && (
            <Link to="/register?role=vendor" className="nav-link px-3 py-2 rounded-lg hover:bg-gray-50">
              List your service
            </Link>
          )}
        </div>

        <div className="flex-1" />

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
            </button>

            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                  <span className="text-brand font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-700">{user.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    <span className="badge badge-orange capitalize mt-1">{user.role}</span>
                  </div>
                  <Link to={dashboardLink}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand transition-colors"
                    onClick={() => setDropOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to={profileLink}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand transition-colors"
                    onClick={() => setDropOpen(false)}>
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {user.role === 'user' && (
                    <Link to="/dashboard/bookings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand transition-colors"
                      onClick={() => setDropOpen(false)}>
                      <Package className="w-4 h-4" /> My Bookings
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
          </div>
        )}

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 animate-slide-up">
          {/* Mobile city picker */}
          <div className="flex gap-2 pb-3 border-b border-gray-100">
            {SUPPORTED_CITIES.map(c => (
              <button key={c}
                onClick={() => changeCity(c)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${city === c ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-600'}`}>
                📍 {c}
              </button>
            ))}
          </div>
          <Link to="/vendors" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
            Browse Vendors
          </Link>
          {!user && (
            <Link to="/register?role=vendor" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
              List your service
            </Link>
          )}
          {user && (
            <Link to={dashboardLink} className="text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          {!user && (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link to="/login" className="btn-secondary text-sm flex-1 justify-center" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 justify-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar