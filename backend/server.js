import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// Routes
import authRoutes     from './routes/authRoutes.js'
import vendorRoutes   from './routes/vendorRoutes.js'
import serviceRoutes  from './routes/serviceRoutes.js'
import bookingRoutes  from './routes/bookingRoutes.js'
import reviewRoutes   from './routes/reviewRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import adminRoutes    from './routes/adminRoutes.js'
import chatRoute      from './routes/chatRoute.js'

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://nearserve-two.vercel.app'
  ],
  credentials: true,
}))
app.use(helmet())
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Keep-alive: called once a day by .github/workflows/keepalive.yml.
// A real query keeps the free MongoDB Atlas cluster from being paused
// after 30 days without connections.
app.get('/api/keepalive', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping()
    const users = await mongoose.connection.db.collection('users').estimatedDocumentCount()
    res.json({ success: true, mongodb: 'ok', users })
  } catch (error) {
    res.status(503).json({ success: false, mongodb: 'error', message: error.message })
  }
})

// API Routes
app.use('/api/auth',       authRoutes)
app.use('/api/vendors',    vendorRoutes)
app.use('/api/services',   serviceRoutes)
app.use('/api/bookings',   bookingRoutes)
app.use('/api/reviews',    reviewRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/admin',      adminRoutes)
app.use('/api',            chatRoute)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'NearServe API is running!' })
})

// Error Middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})