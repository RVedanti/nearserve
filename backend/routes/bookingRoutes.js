import express from 'express'
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from '../controllers/bookingController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/',           protect, authorizeRoles('user'), createBooking)
router.get('/my',          protect, authorizeRoles('user'), getMyBookings)
router.patch('/:id/cancel', protect, authorizeRoles('user'), cancelBooking)

export default router