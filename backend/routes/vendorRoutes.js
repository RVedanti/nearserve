import express from 'express'
import {
  getVendors,
  getVendorById,
  getMyProfile, 
  createVendorProfile,
  updateVendorProfile,
  getRevenue,
  getVendorBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from '../controllers/vendorController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.get('/', getVendors)

// ✅ Vendor only — specific routes BEFORE /:id
router.get('/my-profile', protect, authorizeRoles('vendor'), getMyProfile)
router.post('/profile', protect, authorizeRoles('vendor'), createVendorProfile)
router.put('/profile',  protect, authorizeRoles('vendor'), updateVendorProfile)
router.get('/revenue',  protect, authorizeRoles('vendor'), getRevenue)
router.get('/bookings', protect, authorizeRoles('vendor'), getVendorBookings)
router.patch('/bookings/:id/accept',   protect, authorizeRoles('vendor'), acceptBooking)
router.patch('/bookings/:id/reject',   protect, authorizeRoles('vendor'), rejectBooking)
router.patch('/bookings/:id/complete', protect, authorizeRoles('vendor'), completeBooking)

// ✅ Dynamic route LAST
router.get('/:id', getVendorById)

export default router