import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from './Spinner'

export const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner full />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />

  return children
}

export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Spinner full />
  if (user) {
    if (user.role === 'admin')  return <Navigate to="/admin" replace />
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}