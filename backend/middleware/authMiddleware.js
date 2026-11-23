const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'swad_super_secret_jwt_key_2026'

// Authenticates any logged-in entity (admin or user).
// Sets req.user with { id, email, name, role } where role is 'admin' or 'user'.
async function authenticate(req, res, next) {
  try {
    let token = null

    if (req.cookies && req.cookies.swadToken) {
      token = req.cookies.swadToken
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password')
      if (!admin) {
        return res.status(401).json({ message: 'Admin account not found.' })
      }
      req.user = { id: admin._id.toString(), email: admin.email, name: admin.name, role: 'admin' }
    } else {
      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        return res.status(401).json({ message: 'User account not found.' })
      }
      req.user = { id: user._id.toString(), email: user.email, name: user.name, role: 'user' }
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ message: 'Invalid authentication token.' })
  }
}

// Requires that the authenticated user is an admin.
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' })
  }
  next()
}

// Optional authentication – if token exists, decode and attach, else continue.
async function optionalAuth(req, res, next) {
  try {
    let token = null

    if (req.cookies && req.cookies.swadToken) {
      token = req.cookies.swadToken
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET)
      if (decoded.role === 'admin') {
        const admin = await Admin.findById(decoded.id).select('-password')
        if (admin) {
          req.user = { id: admin._id.toString(), email: admin.email, name: admin.name, role: 'admin' }
        }
      } else {
        const user = await User.findById(decoded.id).select('-password')
        if (user) {
          req.user = { id: user._id.toString(), email: user.email, name: user.name, role: 'user' }
        }
      }
    }
  } catch (_) {
    // Silently continue – unauthenticated
  }
  next()
}

module.exports = { authenticate, requireAdmin, optionalAuth }
