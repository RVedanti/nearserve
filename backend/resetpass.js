import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

await mongoose.connect(process.env.MONGO_URI)

const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash('Vedanti@123', salt)

await User.updateOne(
  { email: 'vedanti@gmail.com' },
  { $set: { password: hashedPassword } }
)

console.log('Password reset successfully!')
console.log('Email: vedanti@gmail.com')
console.log('Password: Vedanti@123')

await mongoose.disconnect()