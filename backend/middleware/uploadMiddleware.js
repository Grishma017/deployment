const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { Readable } = require('stream')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use memory storage — we stream the buffer directly to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'))
    }
    cb(null, true)
  },
})

// Streams a buffer to Cloudinary and returns the upload result
function uploadToCloudinary(buffer, folder = 'swad-recipes') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 900, crop: 'limit', quality: 'auto:good' },
        ],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    Readable.from(buffer).pipe(stream)
  })
}

// Deletes an image from Cloudinary by its public_id
async function deleteFromCloudinary(publicId) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error('Cloudinary delete error:', err.message)
  }
}

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary }
