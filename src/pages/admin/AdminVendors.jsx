import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Ban, Shield } from 'lucide-react'
import { adminAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

const AdminVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const params = filter ? { status: filter } : {}
      const { data } = await adminAPI.getVendors(params)
      setVendors(data.vendors || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchVendors() }, [filter])

  const act = async (fn, id) => {
    try { await fn(id); fetchVendors() } catch {}
  }

  return (
    <div className="animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Manage Vendors</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand focus:outline-none">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <div className="space-y-3">
          {vendors.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No vendors found.</p>
            </div>
          ) : vendors.map(v => (
            <div key={v._id} className="card p-5 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display font-bold text-gray-900">{v.businessName}</p>
                  {v.isVerified
                    ? <span className="badge badge-green">Verified</span>
                    : v.isBlocked
                    ? <span className="badge badge-red">Blocked</span>
                    : <span className="badge badge-orange">Pending</span>}
                </div>
                <p className="text-sm text-gray-500">{v.userId?.email} • {v.userId?.phone}</p>
                <p className="text-xs text-gray-400 mt-1">{v.categoryId?.name} • {v.serviceAreas?.join(', ')}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {!v.isVerified && !v.isBlocked && (
                  <>
                    <button onClick={() => act(adminAPI.approveVendor, v._id)}
                      className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => act(adminAPI.rejectVendor, v._id)}
                      className="flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {v.isVerified && (
                  <button onClick={() => act(adminAPI.blockVendor, v._id)}
                    className="flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                    <Ban className="w-3.5 h-3.5" /> Block
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVendors