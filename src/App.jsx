import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CityProvider } from './context/CityContext'
import { ProtectedRoute, PublicOnlyRoute } from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Public pages
import LandingPage from './pages/public/LandingPage'
import VendorListingPage from './pages/public/VendorListingPage'
import VendorDetailPage from './pages/public/VendorDetailPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// User dashboard
import { UserDashboard, UserOverview } from './pages/user/UserDashboard'
import UserBookings from './pages/user/UserBookings'
import UserProfile from './pages/user/UserProfile'

// Vendor dashboard
import { VendorDashboard, VendorOverview } from './pages/vendor/VendorDashboard'
import VendorProfile from './pages/vendor/VendorProfile'
import VendorReviews from './pages/vendor/VendorReviews'
import VendorBookings from './pages/vendor/VendorBookings'
import VendorServices from './pages/vendor/VendorServices'

// Admin dashboard
import { AdminDashboard, AdminAnalytics } from './pages/admin/AdminDashboard'
import AdminVendors from './pages/admin/AdminVendors'
import AdminCategories from './pages/admin/AdminCategories'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'

const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CityProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
            <Route path="/vendors" element={<MainLayout><VendorListingPage /></MainLayout>} />
            <Route path="/vendors/:id" element={<MainLayout><VendorDetailPage /></MainLayout>} />

            {/* Auth */}
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>}>
              <Route index element={<UserOverview />} />
              <Route path="bookings" element={<UserBookings />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Vendor Dashboard */}
            <Route path="/vendor" element={<ProtectedRoute roles={['vendor']}><VendorDashboard /></ProtectedRoute>}>
              <Route index element={<VendorOverview />} />
              <Route path="bookings" element={<VendorBookings />} />
              <Route path="services" element={<VendorServices />} />
              <Route path="profile" element={<VendorProfile />} />
              <Route path="reviews" element={<VendorReviews />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}>
              <Route index element={<AdminAnalytics />} />
              <Route path="vendors" element={<AdminVendors />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <MainLayout>
                <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
                  <div>
                    <div className="text-8xl mb-4">🗺️</div>
                    <h1 className="font-display text-4xl font-extrabold text-gray-900 mb-2">Page Not Found</h1>
                    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                </div>
              </MainLayout>
            } />
          </Routes>
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App