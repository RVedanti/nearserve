import express from 'express'
import {
  getStats,
  getAllVendors,
  approveVendor,
  rejectVendor,
  blockVendor,
  getAllUsers,
  getAllBookings,
} from '../controllers/adminController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, authorizeRoles('admin'))

router.get('/stats',                 getStats)
router.get('/vendors',               getAllVendors)
router.patch('/vendors/:id/approve', approveVendor)
router.patch('/vendors/:id/reject',  rejectVendor)
router.patch('/vendors/:id/block',   blockVendor)
router.get('/users',                 getAllUsers)
router.get('/bookings',              getAllBookings)

export default router