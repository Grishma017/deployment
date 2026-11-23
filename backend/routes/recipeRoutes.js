const express = require('express')
const Recipe = require('../models/Recipe')
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/authMiddleware')
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/uploadMiddleware')

const router = express.Router()

function handleError(res, error) {
  if (error.name === 'CastError' || error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }
  return res.status(500).json({ message: 'Something went wrong.' })
}

// ─── PUBLIC: Get all recipes (with optional search/category filters) ───────────
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = {}
    if (category) filter.categories = category
    if (search) {
      const re = new RegExp(search.trim(), 'i')
      filter.$or = [{ name: re }, { description: re }, { categories: re }]
    }
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 })
    return res.status(200).json(recipes)
  } catch (err) {
    return handleError(res, err)
  }
})

// ─── PUBLIC: Get single recipe ─────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' })
    return res.status(200).json(recipe)
  } catch (err) {
    return handleError(res, err)
  }
})

// ─── PROTECTED: Upload image to Cloudinary ─────────────────────────────────────
// POST /api/recipes/upload-image
router.post(
  '/upload-image',
  authenticate,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' })
      }
      const result = await uploadToCloudinary(req.file.buffer, 'swad-recipes')
      return res.status(200).json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    } catch (err) {
      console.error('Image upload error:', err)
      return res.status(500).json({ message: 'Image upload failed: ' + err.message })
    }
  }
)

// ─── PROTECTED: Create recipe (any authenticated user or admin) ────────────────
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, image, imagePublicId, categories, ingredients, instructions, prepTime, cookTime, servings, difficulty } = req.body

    const recipe = await Recipe.create({
      name,
      description,
      image,
      imagePublicId,
      categories: Array.isArray(categories) ? categories : [],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      instructions: Array.isArray(instructions) ? instructions : [],
      prepTime: prepTime ? Number(prepTime) : undefined,
      cookTime: cookTime ? Number(cookTime) : undefined,
      servings: servings ? Number(servings) : undefined,
      difficulty: difficulty || 'Easy',
      createdBy: req.user.id,
      creatorRole: req.user.role === 'admin' ? 'Admin' : 'User',
      creatorName: req.user.name,
    })
    return res.status(201).json(recipe)
  } catch (err) {
    return handleError(res, err)
  }
})

// ─── PROTECTED: Update recipe ──────────────────────────────────────────────────
// Users can only edit their own; admins can edit any
router.put('/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' })

    // Permission check: user can only edit their own recipes
    if (req.user.role === 'user' && recipe.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own recipes.' })
    }

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    return res.status(200).json(updated)
  } catch (err) {
    return handleError(res, err)
  }
})

// ─── PROTECTED: Delete recipe ──────────────────────────────────────────────────
// Users can only delete their own; admins can delete any
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' })

    // Permission check
    if (req.user.role === 'user' && recipe.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own recipes.' })
    }

    // Delete Cloudinary image if stored
    if (recipe.imagePublicId) {
      await deleteFromCloudinary(recipe.imagePublicId)
    }

    await Recipe.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Recipe deleted successfully.' })
  } catch (err) {
    return handleError(res, err)
  }
})

// ─── ADMIN: Get all recipes with creator info ──────────────────────────────────
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 })
    return res.status(200).json(recipes)
  } catch (err) {
    return handleError(res, err)
  }
})

module.exports = router
