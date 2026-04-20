import { Link } from 'react-router-dom'
import { MapPin, Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react'

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Near<span className="text-brand">Serve</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Your hyperlocal service marketplace. Discover verified vendors near you and book services with transparent pricing.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-brand transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 font-display">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ['Home', '/'],
              ['Browse Vendors', '/vendors'],
              ['Login', '/login'],
              ['Register', '/register'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="hover:text-brand transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 font-display">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand shrink-0" /> support@nearserve.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand shrink-0" /> +91 98765 43210
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© 2025 NearServe. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer