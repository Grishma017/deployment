const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const recipeRoutes = require('./routes/recipeRoutes')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else if (process.env.NODE_ENV !== 'production') {
        callback(null, true)
      } else {
        callback(new Error('Origin is not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Swad server is running smoothly!',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swad'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Swad server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    app.listen(port, () => {
      console.log(`Swad server listening on port ${port} (waiting for MongoDB...)`)
    })
  }
}

startServer()
