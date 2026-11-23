const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Admin = require('../models/Admin')
const { authenticate } = require('../middleware/authMiddleware')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'swad_super_secret_jwt_key_2026'
const TOKEN_EXPIRY = '7d'

function setTokenCookie(res, token) {
  res.cookie('swadToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

// --- USER AUTH ---

// POST /api/auth/user/register
router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password })

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    )

    setTokenCookie(res, token)

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'user' },
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ message: 'Registration failed. Please try again.' })
  }
})

// POST /api/auth/user/login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    )

    setTokenCookie(res, token)

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'user' },
    })
  } catch (err) {
    console.error('User login error:', err)
    return res.status(500).json({ message: 'Login failed. Please try again.' })
  }
})

// --- ADMIN AUTH ---

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    )

    setTokenCookie(res, token)

    return res.status(200).json({
      message: 'Admin login successful.',
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
    })
  } catch (err) {
    console.error('Admin login error:', err)
    return res.status(500).json({ message: 'Login failed. Please try again.' })
  }
})

// --- SHARED ---

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('swadToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  // Also clear legacy admin cookie
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  return res.status(200).json({ message: 'Logged out successfully.' })
})

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  return res.status(200).json({ user: req.user })
})

module.exports = router
