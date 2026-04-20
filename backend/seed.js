import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

import User from './models/User.js'
import Vendor from './models/Vendor.js'
import Category from './models/Category.js'
import Service from './models/Service.js'

await mongoose.connect(process.env.MONGO_URI)
console.log('✅ Connected to MongoDB')

await Service.deleteMany({})
await Vendor.deleteMany({})
await Category.deleteMany({})
await User.deleteMany({ email: { $regex: /@nearserve\.com$/ } })
console.log('🗑️  Cleared old seed data')

const cats = await Category.insertMany([
  { name: 'Cleaning',    icon: '🧹' },
  { name: 'Electrician', icon: '⚡' },
  { name: 'Plumbing',    icon: '🔧' },
  { name: 'Cooking',     icon: '🍳' },
  { name: 'Laundry',     icon: '👕' },
  { name: 'AC Repair',   icon: '❄️' },
  { name: 'Salon',       icon: '💇' },
])
console.log('📂 Categories created:', cats.map(c => c.name).join(', '))

const catMap = Object.fromEntries(cats.map(c => [c.name, c._id]))

const createVendor = async ({ name, email, city, categoryName, businessName, description, rating, totalReviews }) => {
  const user = new User({
    name,
    email,
    password: 'Vendor@123',
    role: 'vendor',
    phone: '9876543210',
    address: city,
  })
  await user.save()

  const vendor = await Vendor.create({
    userId:       user._id,
    businessName,
    categoryId:   catMap[categoryName],
    description,
    serviceAreas: [city],
    isVerified:   true,
    isBlocked:    false,
    rating,
    totalReviews,
  })

  return vendor
}

const mumbaiVendors = [
  { name: 'Rahul Sharma',  email: 'rahul@nearserve.com',   city: 'Mumbai', categoryName: 'Cleaning',    businessName: 'Rahul Clean Pro',        description: 'Professional deep cleaning for homes and offices in Mumbai.',     rating: 4.8, totalReviews: 42 },
  { name: 'Priya Mehta',   email: 'priya@nearserve.com',   city: 'Mumbai', categoryName: 'Salon',       businessName: 'Priya Beauty Studio',    description: 'Expert hair and beauty services at your doorstep.',              rating: 4.7, totalReviews: 35 },
  { name: 'Anil Patil',    email: 'anil@nearserve.com',    city: 'Mumbai', categoryName: 'Plumbing',    businessName: 'Patil Plumbing Works',   description: 'Fast and reliable plumbing repairs across Mumbai.',              rating: 4.5, totalReviews: 28 },
  { name: 'Suresh Kumar',  email: 'suresh@nearserve.com',  city: 'Mumbai', categoryName: 'Electrician', businessName: 'Kumar Electricals',      description: 'Licensed electrician for wiring, fittings and repairs.',         rating: 4.6, totalReviews: 31 },
  { name: 'Meena Joshi',   email: 'meena@nearserve.com',   city: 'Mumbai', categoryName: 'Cooking',     businessName: 'Meena Home Kitchen',     description: 'Home cook specialising in Maharashtrian and North Indian food.',  rating: 4.9, totalReviews: 56 },
  { name: 'Vikram Desai',  email: 'vikram@nearserve.com',  city: 'Mumbai', categoryName: 'Laundry',     businessName: 'Desai Laundry Services', description: 'Pick-up and drop laundry service across Mumbai suburbs.',         rating: 4.4, totalReviews: 19 },
  { name: 'Ramesh Nair',   email: 'ramesh@nearserve.com',  city: 'Mumbai', categoryName: 'AC Repair',   businessName: 'Nair Cool Tech',         description: 'AC installation, servicing and repair specialists.',             rating: 4.7, totalReviews: 38 },
  { name: 'Sunita Rao',    email: 'sunita@nearserve.com',  city: 'Mumbai', categoryName: 'Cleaning',    businessName: 'SunShine Cleaning Co',   description: 'Affordable sofa, carpet and bathroom deep cleaning.',             rating: 4.3, totalReviews: 22 },
]

const nandedVendors = [
  { name: 'Ganesh Kulkarni', email: 'ganesh@nearserve.com',  city: 'Nanded', categoryName: 'Plumbing',    businessName: 'Kulkarni Plumbers',    description: 'Trusted plumbing service across Nanded city.',                   rating: 4.6, totalReviews: 24 },
  { name: 'Kavita Shinde',   email: 'kavita@nearserve.com',  city: 'Nanded', categoryName: 'Cleaning',    businessName: 'Kavita Home Care',     description: 'Professional home and office cleaning in Nanded.',               rating: 4.8, totalReviews: 33 },
  { name: 'Santosh More',    email: 'santosh@nearserve.com', city: 'Nanded', categoryName: 'Electrician', businessName: 'More Electricals',     description: 'All electrical work — wiring, repairs, new fittings.',           rating: 4.5, totalReviews: 18 },
  { name: 'Lata Pawar',      email: 'lata@nearserve.com',    city: 'Nanded', categoryName: 'Cooking',     businessName: 'Lata Tiffin Service',  description: 'Daily tiffin and home cooking for families in Nanded.',          rating: 4.9, totalReviews: 47 },
  { name: 'Raju Jadhav',     email: 'raju@nearserve.com',    city: 'Nanded', categoryName: 'Salon',       businessName: 'Raju Gents Salon',     description: 'Haircut, shaving and grooming at home — Nanded.',               rating: 4.4, totalReviews: 15 },
  { name: 'Ashok Gaikwad',   email: 'ashok@nearserve.com',   city: 'Nanded', categoryName: 'AC Repair',   businessName: 'Gaikwad AC Services',  description: 'Expert AC repair, gas refilling and servicing in Nanded.',       rating: 4.6, totalReviews: 21 },
  { name: 'Pooja Deshmukh',  email: 'pooja@nearserve.com',   city: 'Nanded', categoryName: 'Laundry',     businessName: 'Pooja Laundry',        description: 'Affordable laundry pickup and delivery across Nanded.',          rating: 4.3, totalReviews: 12 },
  { name: 'Nilesh Bhosale',  email: 'nilesh@nearserve.com',  city: 'Nanded', categoryName: 'Plumbing',    businessName: 'Bhosale Pipe & Tap',   description: 'Pipe fitting, tap repairs and drain cleaning in Nanded.',        rating: 4.5, totalReviews: 16 },
]

const serviceTemplates = {
  Cleaning:    [{ serviceName: 'Home Deep Clean',     price: 799,  description: 'Full home deep cleaning including kitchen and bathrooms.' },
                { serviceName: 'Sofa & Carpet Clean', price: 499,  description: 'Professional sofa and carpet steam cleaning.' }],
  Electrician: [{ serviceName: 'Wiring & Fitting',    price: 599,  description: 'Complete electrical wiring and fixture installation.' },
                { serviceName: 'Fault Repair',        price: 299,  description: 'Diagnose and fix electrical faults quickly.' }],
  Plumbing:    [{ serviceName: 'Pipe Repair',         price: 399,  description: 'Fix leaking or broken pipes fast.' },
                { serviceName: 'Tap & Drain Fix',     price: 249,  description: 'Tap replacement and drain unblocking.' }],
  Cooking:     [{ serviceName: 'Daily Tiffin',        price: 1499, description: 'Home-cooked meals delivered daily (monthly plan).' },
                { serviceName: 'Party Cooking',       price: 2499, description: 'Cook for parties and events at your home.' }],
  Laundry:     [{ serviceName: 'Wash & Fold',         price: 299,  description: 'Pickup, wash, fold and deliver within 24 hours.' },
                { serviceName: 'Ironing Service',     price: 149,  description: 'Professional ironing per kg of clothes.' }],
  'AC Repair': [{ serviceName: 'AC Service',          price: 499,  description: 'Full AC cleaning and servicing.' },
                { serviceName: 'Gas Refilling',       price: 899,  description: 'AC gas top-up and leak check.' }],
  Salon:       [{ serviceName: 'Haircut & Style',     price: 299,  description: 'Professional haircut and styling at home.' },
                { serviceName: 'Facial & Cleanup',    price: 499,  description: 'Facial, cleanup and skincare at your doorstep.' }],
}

for (const v of [...mumbaiVendors, ...nandedVendors]) {
  const vendor = await createVendor(v)
  const services = serviceTemplates[v.categoryName] || []
  for (const svc of services) {
    await Service.create({ vendorId: vendor._id, ...svc })
  }
}

console.log('🌱 Seeded', mumbaiVendors.length, 'Mumbai vendors and', nandedVendors.length, 'Nanded vendors')
console.log('✅ Done! All vendors can log in with password: Vendor@123')
await mongoose.disconnect()