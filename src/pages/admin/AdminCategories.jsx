import { useState, useEffect } from 'react'
import { categoryAPI } from '../../services/api'

const ICONS = ['🧹','🔧','⚡','💇','🍳','👕','🪚','🎨','🐕','🚗']

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🛠️')
  const [adding, setAdding] = useState(false)

  const fetchCategories = () => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => {})
  }

  useEffect(() => { fetchCategories() }, [])

  const add = async (e) => {
    e.preventDefault()
    setAdding(true)
    try { await categoryAPI.create({ name, icon }); setName(''); fetchCategories() }
    catch {} finally { setAdding(false) }
  }

  const del = async (id) => {
    try { await categoryAPI.delete(id); fetchCategories() } catch {}
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="section-title mb-6">Categories</h1>

      <div className="card p-5 mb-6">
        <h2 className="font-display font-bold text-gray-900 mb-4">Add Category</h2>
        <form onSubmit={add} className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {ICONS.map(ic => (
              <button key={ic} type="button" onClick={() => setIcon(ic)}
                className={`text-2xl p-2 rounded-xl border-2 transition-all ${
                  icon === ic ? 'border-brand bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                {ic}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input required value={name} onChange={e => setName(e.target.value)}
              placeholder="Category name" className="input flex-1" />
            <button type="submit" disabled={adding}
              className="btn-primary text-sm py-2 px-5 shrink-0 disabled:opacity-60">
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map(c => (
          <div key={c._id} className="card p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{c.icon}</span>
              <span className="font-semibold text-sm text-gray-800">{c.name}</span>
            </div>
            <button onClick={() => del(c._id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminCategories