const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    tips: {
      type: [String],
      default: [],
    },
    prepTime: {
      type: Number,
      min: 0,
    },
    cookTime: {
      type: Number,
      min: 0,
    },
    servings: {
      type: Number,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'creatorRole',
    },
    creatorRole: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    creatorName: {
      type: String,
      trim: true,
      default: 'Swad Team',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Recipe', recipeSchema)
