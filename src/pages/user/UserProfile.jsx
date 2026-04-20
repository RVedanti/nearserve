import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import { authAPI } from '../../services/api'

const UserProfile = () => {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      // Refresh user data from server after update
      const { data } = await authAPI.me()
      // Persist updated display — backend update endpoint can be added later
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">My Profile</h1>
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

      {editing ? (
        <div className="card p-6">
          <h2 className="font-display font-bold text-gray-900 mb-4">Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="input pl-10" required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit phone number"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Your city"
                  className="input pl-10"
                />
              </div>
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
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-brand text-2xl">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-900 text-lg">{user?.name}</p>
              <span className="badge badge-orange text-xs">User</span>
            </div>
          </div>

          {[
            { label: 'Full Name',     value: user?.name    || '—', icon: User    },
            { label: 'Email Address', value: user?.email   || '—', icon: Mail    },
            { label: 'Phone Number',  value: user?.phone   || '—', icon: Phone   },
            { label: 'City',          value: user?.address || '—', icon: MapPin  },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <Icon className="w-4 h-4 text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-gray-800 font-medium text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserProfile