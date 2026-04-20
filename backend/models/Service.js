import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  serviceName: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true })

const Service = mongoose.model('Service', serviceSchema)
export default Service