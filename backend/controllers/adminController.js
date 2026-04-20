import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Vendor from '../models/Vendor.js'
import Booking from '../models/Booking.js'

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Admin
export const getStats = asyncHandler(async (req, res) => {
  const totalUsers     = await User.countDocuments({ role: 'user' })
  const totalVendors   = await Vendor.countDocuments()
  const totalBookings  = await Booking.countDocuments()
  const pendingVendors = await Vendor.countDocuments({ isVerified: false, isBlocked: false })
  const verifiedVendors = await Vendor.countDocuments({ isVerified: true })
  const completedBookings = await Booking.countDocuments({ status: 'Completed' })

  const completedBookingDocs = await Booking.find({ status: 'Completed' })
    .populate('serviceId', 'price')
  const totalRevenue = completedBookingDocs.reduce(
    (sum, b) => sum + (b.serviceId?.price || 0), 0
  )

  res.json({
    totalUsers,
    totalVendors,
    totalBookings,
    pendingVendors,
    verifiedVendors,
    completedBookings,
    totalRevenue,
  })
})

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Admin
export const getAllVendors = asyncHandler(async (req, res) => {
  const { status } = req.query
  let query = {}

  if (status === 'pending')  query = { isVerified: false, isBlocked: false }
  if (status === 'verified') query = { isVerified: true }
  if (status === 'blocked')  query = { isBlocked: true }

  const vendors = await Vendor.find(query)
    .populate('userId', 'name email phone')
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 })

  res.json({ vendors })
})

// @desc    Approve vendor
// @route   PATCH /api/admin/vendors/:id/approve
// @access  Admin
export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor not found')
  }
  vendor.isVerified = true
  vendor.isBlocked  = false
  await vendor.save()
  res.json({ message: 'Vendor approved', vendor })
})

// @desc    Reject vendor
// @route   PATCH /api/admin/vendors/:id/reject
// @access  Admin
export const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor not found')
  }
  vendor.isVerified = false
  await vendor.save()
  res.json({ message: 'Vendor rejected', vendor })
})

// @desc    Block vendor
// @route   PATCH /api/admin/vendors/:id/block
// @access  Admin
export const blockVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor not found')
  }
  vendor.isBlocked  = true
  vendor.isVerified = false
  await vendor.save()
  res.json({ message: 'Vendor blocked', vendor })
})

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' })
    .select('-password')
    .sort({ createdAt: -1 })
  res.json({ users })
})

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const query = status ? { status } : {}

  const total = await Booking.countDocuments(query)
  const bookings = await Booking.find(query)
    .populate('userId', 'name email')
    .populate('vendorId', 'businessName')
    .populate('serviceId', 'serviceName price')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({ bookings, total })
})