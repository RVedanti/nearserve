import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Shield, Clock, ChevronRight, Zap, Users, Package } from 'lucide-react'
import { categoryAPI } from '../../services/api'
import { useCity } from '../../context/CityContext'

const CATEGORY_ICONS = {
  Cleaning: '🧹', Electrician: '⚡', Plumbing: '🔧',
  Salon: '💇', Cooking: '🍳', Laundry: '👕', 'AC Repair': '❄️', default: '🛠️'
}

const STATS = [
  { icon: Users,   label: 'Happy Users',     value: '50,000+' },
  { icon: Package, label: 'Bookings Done',    value: '1,20,000+' },
  { icon: Shield,  label: 'Verified Vendors', value: '2,500+' },
  { icon: Star,    label: 'Avg Rating',       value: '4.8 ★' },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const { city, changeCity, SUPPORTED_CITIES } = useCity()
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    navigate(`/vendors?${params.toString()}`)
  }

  const defaultCategories = [
    { name: 'Cleaning', _id: 'Cleaning' }, { name: 'Electrician', _id: 'Electrician' },
    { name: 'Plumbing', _id: 'Plumbing' }, { name: 'Cooking', _id: 'Cooking' },
    { name: 'Laundry', _id: 'Laundry' },   { name: 'AC Repair', _id: 'AC Repair' },
    { name: 'Salon', _id: 'Salon' },
  ]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-brand-dark min-h-[520px] flex items-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/10 rounded-full blur-2xl -translate-x-1/3 translate-y-1/2" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
              <span className="text-white/80 text-sm font-medium">Hyperlocal services at your doorstep</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Find Local Services<br />
              <span className="text-brand-light">Near You</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Book verified local professionals for cleaning, plumbing, electrical work, and more — with fixed pricing and easy scheduling.
            </p>

            {/* City selector in hero */}
            <div className="flex gap-2 mb-4">
              {SUPPORTED_CITIES.map(c => (
                <button key={c}
                  onClick={() => changeCity(c)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    city === c
                      ? 'bg-brand border-brand text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}>
                  <MapPin className="w-3.5 h-3.5" /> {c}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl max-w-xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={city ? `Search in ${city}...` : 'Search plumber, cleaner, electrician...'}
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
              <button type="submit" className="btn-primary rounded-xl text-sm py-2.5 px-5 shrink-0">
                Search
              </button>
            </form>

            {city && (
              <p className="text-white/60 text-xs mt-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Showing results for <span className="text-white font-semibold">{city}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-5">
              {['🧹 Cleaning', '🔧 Plumbing', '⚡ Electrician', '💇 Salon'].map(tag => (
                <button key={tag}
                  onClick={() => navigate(`/vendors?category=${tag.split(' ')[1]}`)}
                  className="text-white/70 text-sm bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900 text-lg leading-tight">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="text-gray-500 text-sm mt-1">
              {city ? `Services available in ${city}` : 'Pick a service to find vendors near you'}
            </p>
          </div>
          <button onClick={() => navigate('/vendors')}
            className="flex items-center gap-1 text-brand text-sm font-semibold hover:underline">
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
          {(categories.length > 0 ? categories : defaultCategories).map((cat) => (
            <button key={cat._id}
              onClick={() => navigate(`/vendors?category=${cat.name}`)}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand hover:shadow-card-hover transition-all duration-200 group">
              <span className="text-2xl">{CATEGORY_ICONS[cat.name] || CATEGORY_ICONS.default}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-brand transition-colors text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title">How NearServe Works</h2>
            <p className="text-gray-500 mt-2">Get a service booked in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Search, title: 'Browse & Discover', desc: 'Search for local vendors by category, keyword, price, or rating in your area.' },
              { step: '02', icon: Clock,  title: 'Book a Time Slot',  desc: 'Choose a service, pick your preferred date and time slot, and confirm your booking.' },
              { step: '03', icon: Zap,    title: 'Get it Done',       desc: 'Your verified vendor shows up, completes the job, and you leave a review.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-6 relative overflow-hidden group">
                <span className="absolute top-4 right-4 font-display font-black text-6xl text-gray-50 group-hover:text-orange-50 transition-colors select-none">{step}</span>
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand transition-colors">
                  <Icon className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
            Are you a local service provider?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join NearServe and start getting bookings from customers near you. Free to register.
          </p>
          <button onClick={() => navigate('/register?role=vendor')}
            className="bg-white text-brand font-display font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-lg text-base">
            Register as Vendor →
          </button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage