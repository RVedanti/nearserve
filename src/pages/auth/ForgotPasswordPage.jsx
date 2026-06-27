import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, KeyRound, MapPin, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { authAPI } from '../../services/api'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1) // 1=email, 2=otp, 3=newpass, 4=done
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await authAPI.forgotPassword({ email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await authAPI.verifyOtp({ email, otp })
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.')
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPass !== confirm) { setError('Passwords do not match.'); return }
    if (newPass.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      await authAPI.resetPassword({ email, otp, newPassword: newPass })
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-brand-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="relative text-white max-w-sm">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-2xl">Near<span className="text-brand-light">Serve</span></span>
          </div>
          <h2 className="font-display text-3xl font-extrabold mb-4 leading-tight">Reset your password</h2>
          <p className="text-gray-300 leading-relaxed">We'll send a 6-digit OTP to your email. Use it to set a new password securely.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {[1,2,3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s ? 'bg-green-500 text-white' :
                  step === s ? 'bg-brand text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
            <span className="text-xs text-gray-500 ml-2">
              {step === 1 ? 'Enter email' : step === 2 ? 'Verify OTP' : step === 3 ? 'New password' : 'Done!'}
            </span>
          </div>

          {/* Step 1 — Email */}
          {step === 1 && (
            <>
              <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-1">Forgot Password</h1>
              <p className="text-gray-500 text-sm mb-8">Enter your registered email to receive an OTP.</p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input pl-10" />
                  </div>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            </>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <>
              <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-1">Enter OTP</h1>
              <p className="text-gray-500 text-sm mb-8">
                We sent a 6-digit OTP to <span className="font-semibold text-gray-700">{email}</span>. Valid for 10 minutes.
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" required value={otp} maxLength={6}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="input pl-10 text-center text-xl font-bold tracking-widest" />
                  </div>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <button type="submit" disabled={loading || otp.length !== 6}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError('') }}
                  className="btn-secondary w-full justify-center py-2.5 text-sm">
                  Resend OTP
                </button>
              </form>
            </>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <>
              <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-1">New Password</h1>
              <p className="text-gray-500 text-sm mb-8">Choose a strong new password for your account.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type={showPw ? 'text' : 'password'} required value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="Min 6 characters"
                      className="input pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="password" required value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="input pl-10" />
                  </div>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">Password Reset!</h1>
              <p className="text-gray-500 text-sm mb-8">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <button onClick={() => navigate('/login')} className="btn-primary w-full justify-center py-3.5">
                Go to Login
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link to="/login" className="text-sm text-brand font-semibold hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage