import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please add a time slot'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Rejected', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking