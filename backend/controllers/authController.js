import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({ name, email, password, role, phone, address })

  if (user) {
    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: {
        _id:     user._id,
        name:    user.name,
        email:   user.email,
        role:    user.role,
        phone:   user.phone,
        address: user.address,
      },
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id, user.role),
      user: {
        _id:     user._id,
        name:    user.name,
        email:   user.email,
        role:    user.role,
        phone:   user.phone,
        address: user.address,
      },
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.json({ user })
})