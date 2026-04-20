import asyncHandler from 'express-async-handler'
import Booking from '../models/Booking.js'
import Vendor from '../models/Vendor.js'

// @desc    Create booking
// @route   POST /api/bookings
// @access  User
export const createBooking = asyncHandler(async (req, res) => {
  const { vendorId, serviceId, date, timeSlot, address } = req.body

  const booking = await Booking.create({
    userId:   req.user._id,
    vendorId,
    serviceId,
    date,
    timeSlot,
    address,
    status:   'Pending',
  })

  res.status(201).json({ booking })
})

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  User
export const getMyBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 8 } = req.query
  const query = { userId: req.user._id }
  if (status) query.status = status

  const total = await Booking.countDocuments(query)
  const bookings = await Booking.find(query)
    .populate('vendorId', 'businessName _id')
    .populate('serviceId', 'serviceName price description')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({ bookings, total })
})

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  User
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id:    req.params.id,
    userId: req.user._id,
  })

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }
  if (booking.status !== 'Pending') {
    res.status(400)
    throw new Error('Only pending bookings can be cancelled')
  }

  booking.status = 'Cancelled'
  await booking.save()
  res.json({ booking })
})