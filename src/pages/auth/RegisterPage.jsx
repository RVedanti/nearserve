import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'user'

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', role: defaultRole
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // ── Validators ────────────────────────────────────────────
  const validateName = (val) => {
    if (!val.trim()) return 'Name is required'
    if (val.trim().length < 3) return 'Name must be at least 3 characters'
    if (!/^[a-zA-Z\s]+$/.test(val)) return 'Name can only contain letters'
    return ''
  }

  const validateEmail = (val) => {
    if (!val) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address'
    return ''
  }

  const validatePassword = (val) => {
    if (!val) return 'Password is required'
    if (val.length < 6) return 'Password must be at least 6 characters'
    if (!/[A-Z]/.test(val)) return 'Password must have at least one uppercase letter'
    if (!/[0-9]/.test(val)) return 'Password must have at least one number'
    return ''
  }

  const validateConfirmPassword = (val) => {
    if (!val) return 'Please confirm your password'
    if (val !== form.password) return 'Passwords do not match'
    return ''
  }

  const validatePhone = (val) => {
    if (!val) return 'Phone number is required'
    if (val.length !== 10) return 'Phone number must be exactly 10 digits'
    if (!/^[6-9]/.test(val)) return 'Phone number must start with 6, 7, 8 or 9'
    return ''
  }

  const validateAddress = (val) => {
    if (!val.trim()) return 'City is required'
    return ''
  }

  // ── Password strength ─────────────────────────────────────
  const getPasswordStrength = (val) => {
    if (!val) return { label: '', color: '', width: '0%' }
    let score = 0
    if (val.length >= 6) score++
    if (val.length >= 10) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    if (score <= 1) return { label: 'Weak',   color: 'bg-red-500',    width: '25%' }
    if (score <= 2) return { label: 'Fair',   color: 'bg-orange-400', width: '50%' }
    if (score <= 3) return { label: 'Good',   color: 'bg-yellow-400', width: '75%' }
    return             { label: 'Strong', color: 'bg-green-500',  width: '100%' }
  }

  const strength = getPasswordStrength(form.password)

  // ── Field change handler ──────────────────────────────────
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
    setFieldErrors({ ...fieldErrors, [field]: '' })
    setError('')
  }

  // ── Blur handler ──────────────────────────────────────────
  const handleBlur = (field) => {
    const validators = {
      name:            validateName,
      email:           validateEmail,
      password:        validatePassword,
      confirmPassword: validateConfirmPassword,
      phone:           validatePhone,
      address:         validateAddress,
    }
    const err = validators[field]?.(form[field])
    if (err) setFieldErrors(prev => ({ ...prev, [field]: err }))
  }

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const errors = {
      name:            validateName(form.name),
      email:           validateEmail(form.email),
      password:        validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword),
      phone:           validatePhone(form.phone),
      address:         validateAddress(form.address),
    }

    setFieldErrors(errors)
    if (Object.values(errors).some(e => e)) return

    setLoading(true)
    setError('')
    try {
      const { confirmPassword, ...submitData } = form
      const user = await register(submitData)
      navigate(user.role === 'vendor' ? '/vendor' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-gray-900">
            Near<span className="text-brand">Serve</span>
          </span>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">Login</Link>
          </p>

          {/* Role toggle */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
            {[
              { val: 'user',   label: '👤 I need services' },
              { val: 'vendor', label: '🏪 I offer services' },
            ].map(({ val, label }) => (
              <button key={val} type="button"
                onClick={() => setForm({ ...form, role: val })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  form.role === val ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="John Doe"
                  className={`input pl-10 ${fieldErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                />
              </div>
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  className={`input pl-10 ${fieldErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Min. 6 characters"
                  className={`input pl-10 pr-10 ${fieldErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    strength.label === 'Weak'   ? 'text-red-500' :
                    strength.label === 'Fair'   ? 'text-orange-500' :
                    strength.label === 'Good'   ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Re-enter your password"
                  className={`input pl-10 pr-10 ${fieldErrors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
              {!fieldErrors.confirmPassword && form.confirmPassword && form.confirmPassword === form.password && (
                <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
              )}
            </div>

            {/* Phone + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '')
                      if (val.length <= 10) handleChange('phone', val)
                    }}
                    onBlur={() => handleBlur('phone')}
                    placeholder="10 digit number"
                    maxLength={10}
                    className={`input pl-10 ${fieldErrors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                </div>
                {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                {!fieldErrors.phone && form.phone.length === 10 && (
                  <p className="text-xs text-green-600 mt-1">✓ Valid number</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    placeholder="Mumbai"
                    className={`input pl-10 ${fieldErrors.address ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                </div>
                {fieldErrors.address && <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base mt-2 disabled:opacity-60">
              {loading ? 'Creating account...' : `Register as ${form.role === 'vendor' ? 'Vendor' : 'User'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage