require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('../models/Admin')

async function initAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swad'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    const email = process.env.ADMIN_EMAIL || 'admin@swad.com'
    const password = process.env.ADMIN_PASSWORD || 'Admin@Swad123'
    const name = process.env.ADMIN_NAME || 'Chief Admin'

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })

    if (existingAdmin) {
      existingAdmin.password = password
      existingAdmin.name = name
      await existingAdmin.save()
      console.log(`Admin account [${email}] updated successfully with configured password.`)
    } else {
      const newAdmin = new Admin({
        email,
        password,
        name,
      })
      await newAdmin.save()
      console.log(`Admin account [${email}] created successfully!`)
    }

    console.log(`Login credentials:\n  Email: ${email}\n  Password: ${password}`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

initAdmin()
