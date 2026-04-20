import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import User from './models/User.js'

await mongoose.connect(process.env.MONGO_URI)

await User.deleteMany({ role: 'admin' })

const user = new User({
  name: 'Admin',
  email: 'admin@nearserve.com',
  password: 'Admin@123',
  role: 'admin',
  phone: '9000000000',
  address: 'Mumbai'
})
await user.save()
console.log('✅ Admin created!')
console.log('Email: admin@nearserve.com')
console.log('Password: Admin@123')

await mongoose.disconnect()