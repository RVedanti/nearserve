import asyncHandler from 'express-async-handler'
import Review from '../models/Review.js'
import Vendor from '../models/Vendor.js'
import Booking from '../models/Booking.js'

// @desc    Create review
// @route   POST /api/reviews
// @access  User
export const createReview = asyncHandler(async (req, res) => {
  const { vendorId, rating, comment } = req.body

  // Check if user has a completed booking with this vendor
  const booking = await Booking.findOne({
    userId:   req.user._id,
    vendorId,
    status:   'Completed',
  })

  if (!booking) {
    res.status(400)
    throw new Error('You can only review vendors after a completed booking')
  }

  // Check if already reviewed
  const alreadyReviewed = await Review.findOne({
    userId:   req.user._id,
    vendorId,
  })
  if (alreadyReviewed) {
    res.status(400)
    throw new Error('You have already reviewed this vendor')
  }

  const review = await Review.create({
    userId:    req.user._id,
    vendorId,
    bookingId: booking._id,
    rating,
    comment,
  })

  // Recalculate vendor rating
  const allReviews = await Review.find({ vendorId })
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

  await Vendor.findByIdAndUpdate(vendorId, {
    rating:       Math.round(avgRating * 10) / 10,
    totalReviews: allReviews.length,
  })

  res.status(201).json({ review })
})

// @desc    Get reviews by vendor
// @route   GET /api/reviews/vendor/:vendorId
// @access  Public
export const getReviewsByVendor = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ vendorId: req.params.vendorId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })

  res.json({ reviews })
})