import asyncHandler from 'express-async-handler'
import Service from '../models/Service.js'
import Vendor from '../models/Vendor.js'

// @desc    Get services by vendor
// @route   GET /api/services/vendor/:vendorId
// @access  Public
export const getServicesByVendor = asyncHandler(async (req, res) => {
  let vendorId = req.params.vendorId

  // If 'my' is passed, find the logged-in vendor's ID
  if (vendorId === 'my') {
    const vendor = await Vendor.findOne({ userId: req.user._id })
    if (!vendor) {
      res.status(404)
      throw new Error('Vendor profile not found')
    }
    vendorId = vendor._id
  }

  const services = await Service.find({ vendorId }).sort({ createdAt: -1 })
  res.json({ services })
})

// @desc    Create service
// @route   POST /api/services
// @access  Vendor
export const createService = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  if (!vendor) {
    res.status(404)
    throw new Error('Vendor profile not found. Create one first.')
  }

  const { serviceName, price, description } = req.body
  const service = await Service.create({
    vendorId: vendor._id,
    serviceName,
    price,
    description,
  })

  res.status(201).json({ service })
})

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Vendor
export const updateService = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  const service = await Service.findOne({ _id: req.params.id, vendorId: vendor._id })

  if (!service) {
    res.status(404)
    throw new Error('Service not found')
  }

  const { serviceName, price, description } = req.body
  service.serviceName  = serviceName  || service.serviceName
  service.price        = price        ?? service.price
  service.description  = description  || service.description

  const updated = await service.save()
  res.json({ service: updated })
})

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Vendor
export const deleteService = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id })
  const service = await Service.findOne({ _id: req.params.id, vendorId: vendor._id })

  if (!service) {
    res.status(404)
    throw new Error('Service not found')
  }

  await service.deleteOne()
  res.json({ message: 'Service removed' })
})