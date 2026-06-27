import asyncHandler from 'express-async-handler'
import Vendor from '../models/Vendor.js'
import Booking from '../models/Booking.js'
import Service from '../models/Service.js'

// @desc    Get all verified vendors (with filters + pagination)
// @route   GET /api/vendors
// @access  Public
export const getVendors = asyncHandler(async (req, res) => {
 const { search, category, minRating, city, page = 1, limit = 12 } = req.query

const query = { isVerified: true, isBlocked: false }

if (minRating) query.rating = { $gte: Number(minRating) }
if (city) query.serviceAreas = { $in: [new RegExp(city, 'i')] }

  let vendors = await Vendor.find(query)
    .populate('userId', 'name email phone')
    .populate('categoryId', 'name icon')
    .sort({ rating: -1 })

  // Filter on populated fields in JS (cannot filter on populated fields in MongoDB query directly)
  if (category) {
    vendors = vendors.filter(v =>
      v.categoryId?.name?.toLowerCase() === category.toLowerCase()
    )
  }

  if (search) {
    const s = search.toLowerCase()
    vendors = vendors.filter(v =>
      v.businessName.toLowerCase().includes(s) ||
      v.description.toLowerCase().includes(s) ||
      v.categoryId?.name?.toLowerCase().includes(s)
    )
  }

  const total = vendors.length
  const startIndex = (Number(page) - 1) * Number(limit)
  const paginated = vendors.slice(startIndex, startIndex + Number(limit))

  res.json({ vendors: paginated, total, page: Number(page) })
})

// @desc    Get single vendor by ID
// @route   GET /api/vendors/:id
// @access  Public
export const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
    .populate('userId', 'name email phone')
    .populate('categoryId', 'name icon')

  if (!vendor) {
    res.status(404)
    throw new Error('Vendor not found')
  }
  res.json({ vendor })
})

// @desc    Create vendor profile
// @route   POST /api/vendors/profile
// @access  Vendor
export const createVendorProfile = asyncHandler(async (req, res) => {
  const { businessName, categoryId, description, serviceAreas } = req.body

  const exists = await Vendor.findOne({ userId: req.user._id })
  if (exists) {
    res.status(400)
    throw new Error('Vendor profile already exists')
  }

  const vendor = await Vendor.create({
    userId: req.user._id,
    businessName,
    categoryId,
    description,
    serviceAreas,
  })

  res.status(201).json({ vendor })
})

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Vendor
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor profile not found')
  }

  const { businessName, categoryId, description, serviceAreas } = req.body
  vendor.businessName  = businessName  || vendor.businessName
  vendor.categoryId    = categoryId    || vendor.categoryId
  vendor.description   = description   || vendor.description
  vendor.serviceAreas  = serviceAreas  || vendor.serviceAreas

  const updated = await vendor.save()
  res.json({ vendor: updated })
})

// @desc    Get logged in vendor profile
// @route   GET /api/vendors/my-profile
// @access  Vendor
export const getMyProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
    .populate('categoryId', 'name icon')
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor profile not found')
  }
  res.json({ vendor })
})

// @desc    Get vendor revenue summary
// @route   GET /api/vendors/revenue
// @access  Vendor
export const getRevenue = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor profile not found')
  }

  const bookings = await Booking.find({ vendorId: vendor._id })
    .populate('serviceId', 'price')

  const totalRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.serviceId?.price || 0), 0)

  res.json({
    totalRevenue,
    totalBookings: bookings.length,
    pending:   bookings.filter(b => b.status === 'Pending').length,
    accepted:  bookings.filter(b => b.status === 'Accepted').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    rejected:  bookings.filter(b => b.status === 'Rejected').length,
  })
})

// @desc    Get vendor bookings
// @route   GET /api/vendors/bookings
// @access  Vendor
export const getVendorBookings = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor profile not found')
  }

  const { status, page = 1, limit = 20 } = req.query
  const query = { vendorId: vendor._id }
  if (status) query.status = status

  const total = await Booking.countDocuments(query)
  const bookings = await Booking.find(query)
    .populate('userId', 'name email phone')
    .populate('serviceId', 'serviceName price')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({ bookings, total })
})

// @desc    Accept booking
// @route   PATCH /api/vendors/bookings/:id/accept
// @access  Vendor
export const acceptBooking = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  const booking = await Booking.findOne({ _id: req.params.id, vendorId: vendor._id })

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }
  if (booking.status !== 'Pending') {
    res.status(400)
    throw new Error('Only pending bookings can be accepted')
  }

  booking.status = 'Accepted'
  await booking.save()
  res.json({ booking })
})

// @desc    Reject booking
// @route   PATCH /api/vendors/bookings/:id/reject
// @access  Vendor
export const rejectBooking = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  const booking = await Booking.findOne({ _id: req.params.id, vendorId: vendor._id })

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }
  if (booking.status !== 'Pending') {
    res.status(400)
    throw new Error('Only pending bookings can be rejected')
  }

  booking.status = 'Rejected'
  await booking.save()
  res.json({ booking })
})

// @desc    Complete booking
// @route   PATCH /api/vendors/bookings/:id/complete
// @access  Vendor
export const completeBooking = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  const booking = await Booking.findOne({ _id: req.params.id, vendorId: vendor._id })

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }
  if (booking.status !== 'Accepted') {
    res.status(400)
    throw new Error('Only accepted bookings can be completed')
  }

  booking.status = 'Completed'
  await booking.save()
  res.json({ booking })
})