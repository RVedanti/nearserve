import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'

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

// @desc    Send OTP to email for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    res.status(404)
    throw new Error('No account found with this email')
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  user.resetOtp       = otp
  user.resetOtpExpiry = otpExpiry
  await user.save({ validateBeforeSave: false })

  // Send email
  await sendEmail({
    to: email,
    subject: 'NearServe — Password Reset OTP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h2 style="color:#E85D24;margin:0;">📍 NearServe</h2>
        </div>
        <h3 style="color:#1a1a2e;">Password Reset Request</h3>
        <p style="color:#6b7280;">Hi <strong>${user.name}</strong>, use the OTP below to reset your password.</p>
        <div style="background:#FFF7F4;border:2px solid #E85D24;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
          <p style="margin:0;color:#6b7280;font-size:13px;">Your OTP</p>
          <h1 style="margin:8px 0;color:#E85D24;font-size:42px;letter-spacing:8px;">${otp}</h1>
          <p style="margin:0;color:#6b7280;font-size:12px;">Valid for 10 minutes only</p>
        </div>
        <p style="color:#6b7280;font-size:12px;">If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
        <p style="color:#9ca3af;font-size:11px;text-align:center;">NearServe — Hyperlocal Services Marketplace</p>
      </div>
    `,
  })

  res.json({ message: 'OTP sent to your email' })
})

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body

  const user = await User.findOne({ email })

  if (!user || user.resetOtp !== otp) {
    res.status(400)
    throw new Error('Invalid OTP')
  }

  if (user.resetOtpExpiry < new Date()) {
    res.status(400)
    throw new Error('OTP has expired. Please request a new one.')
  }

  res.json({ message: 'OTP verified successfully' })
})

// @desc    Reset password after OTP verified
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body

  const user = await User.findOne({ email })
  console.log("User found:", !!user);
   if (user) {
      console.log("Password match:", await user.matchPassword(password));
}

  if (!user || user.resetOtp !== otp) {
    res.status(400)
    throw new Error('Invalid OTP')
  }

  if (user.resetOtpExpiry < new Date()) {
    res.status(400)
    throw new Error('OTP has expired. Please request a new one.')
  }

  // Set new password — model pre-save hook will hash it
  user.password       = newPassword
  user.resetOtp       = undefined
  user.resetOtpExpiry = undefined
  await user.save({ validateBeforeSave: false })

  res.json({ message: 'Password reset successfully! Please login.' })
})