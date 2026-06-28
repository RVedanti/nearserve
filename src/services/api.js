import axios from 'axios'

console.log(import.meta.env);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})
// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nearserve_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nearserve_token')
      localStorage.removeItem('nearserve_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default API

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
  me:       ()     => API.get('/auth/me'),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
verifyOtp:      (data) => API.post('/auth/verify-otp', data),
resetPassword:  (data) => API.post('/auth/reset-password', data),
}

// ─── Vendors ─────────────────────────────────────────────────────────────────
export const vendorAPI = {
  getAll:         (params) => API.get('/vendors', { params }),
  getById:        (id)     => API.get(`/vendors/${id}`),
  getMyProfile:   ()       => API.get('/vendors/my-profile'),  // ← ADD THIS
  createProfile:  (data)   => API.post('/vendors/profile', data),
  updateProfile:  (data)   => API.put('/vendors/profile', data),
  getRevenue:     ()       => API.get('/vendors/revenue'),
  getMyBookings:  (params) => API.get('/vendors/bookings', { params }),
  acceptBooking:  (id)     => API.patch(`/vendors/bookings/${id}/accept`),
  rejectBooking:  (id)     => API.patch(`/vendors/bookings/${id}/reject`),
  completeBooking:(id)     => API.patch(`/vendors/bookings/${id}/complete`),
}

// ─── Services ────────────────────────────────────────────────────────────────
export const serviceAPI = {
  getByVendor: (vendorId) => API.get(`/services/vendor/${vendorId}`),
  create:      (data)     => API.post('/services', data),
  update:      (id, data) => API.put(`/services/${id}`, data),
  delete:      (id)       => API.delete(`/services/${id}`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
  create:        (data)   => API.post('/bookings', data),
  getMyBookings: (params) => API.get('/bookings/my', { params }),
  cancel:        (id)     => API.patch(`/bookings/${id}/cancel`),
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviewAPI = {
  create:      (data)     => API.post('/reviews', data),
  getByVendor: (vendorId) => API.get(`/reviews/vendor/${vendorId}`),
}

// ─── Categories ──────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: ()     => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  delete: (id)   => API.delete(`/categories/${id}`),
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:      ()       => API.get('/admin/stats'),
  getVendors:    (params) => API.get('/admin/vendors', { params }),
  approveVendor: (id)     => API.patch(`/admin/vendors/${id}/approve`),
  rejectVendor:  (id)     => API.patch(`/admin/vendors/${id}/reject`),
  blockVendor:   (id)     => API.patch(`/admin/vendors/${id}/block`),
  getUsers:      (params) => API.get('/admin/users', { params }),
  getBookings:   (params) => API.get('/admin/bookings', { params }),
}