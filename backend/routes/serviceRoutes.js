import express from 'express'
import {
  getServicesByVendor,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/vendor/:vendorId', getServicesByVendor)
router.post('/',      protect, authorizeRoles('vendor'), createService)
router.put('/:id',    protect, authorizeRoles('vendor'), updateService)
router.delete('/:id', protect, authorizeRoles('vendor'), deleteService)

export default router