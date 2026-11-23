import { useState } from 'react'
import { createRecipe } from '../services/api'
import { categories } from '../data/categories'
import './admin.css'

function AddRecipe({ onNavigate, onRecipeCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['Main Course'])
  const [ingredients, setIngredients] = useState([''])
  const [instructions, setInstructions] = useState([''])
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle Category Checkbox
  function handleCategoryToggle(catName) {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catName))
    } else {
      setSelectedCategories([...selectedCategories, catName])
    }
  }

  // Dynamic Ingredients Handlers
  function handleIngredientChange(index, value) {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  function addIngredientRow() {
    setIngredients([...ingredients, ''])
  }

  function removeIngredientRow(index) {
    if (ingredients.length === 1) {
      setIngredients([''])
      return
    }
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // Dynamic Instructions Handlers
  function handleInstructionChange(index, value) {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  function addInstructionRow() {
    setInstructions([...instructions, ''])
  }

  function removeInstructionRow(index) {
    if (instructions.length === 1) {
      setInstructions([''])
      return
    }
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Recipe name is required.')
      return
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category.')
      return
    }

    // Clean empty ingredients and instructions
    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean)
    const cleanInstructions = instructions.map((i) => i.trim()).filter(Boolean)

    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      categories: selectedCategories,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      prepTime: prepTime ? Number(prepTime) : undefined,
      cookTime: cookTime ? Number(cookTime) : undefined,
      servings: servings ? Number(servings) : undefined,
      difficulty,
    }

    setLoading(true)
    try {
      const created = await createRecipe(payload)
      setSuccess(`Recipe "${created.name}" created successfully!`)
      if (onRecipeCreated) onRecipeCreated(created)
      setTimeout(() => {
        onNavigate('recipes')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to create recipe. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recipe-form-card">
      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 20 }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success" style={{ marginBottom: 20 }}>
          <span>✓ {success}</span>
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Name and Image */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="recipe-name">Recipe Name *</label>
            <input
              id="recipe-name"
              type="text"
              placeholder="e.g. Newari Samay Baji"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipe-image">Image URL</label>
            <input
              id="recipe-image"
              type="url"
              placeholder="https://example.com/dish.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="recipe-description">Description</label>
          <textarea
            id="recipe-description"
            rows="3"
            placeholder="A brief history, flavor profile, and story of this dish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="form-group">
          <label>Categories * (Select one or more)</label>
          <div className="category-checkbox-group">
            {categories.map((cat) => (
              <label key={cat.slug} className="category-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => handleCategoryToggle(cat.name)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Prep, Cook Time, Servings & Difficulty */}
        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="prep-time">Prep Time (minutes)</label>
            <input
              id="prep-time"
              type="number"
              min="0"
              placeholder="e.g. 20"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cook-time">Cooking Time (minutes)</label>
            <input
              id="cook-time"
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="servings">Servings</label>
            <input
              id="servings"
              type="number"
              min="1"
              placeholder="e.g. 4"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 300 }}>
          <label htmlFor="difficulty">Difficulty Level</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Ingredients */}
        <div className="form-group">
          <label>Ingredients</label>
          <div className="dynamic-list-group">
            {ingredients.map((ingredient, idx) => (
              <div key={idx} className="dynamic-list-row">
                <span className="dynamic-list-counter">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="e.g. 2 tbsp pure mustard oil"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="admin-button-danger admin-button-sm"
                  onClick={() => removeIngredientRow(idx)}
                  title="Remove ingredient"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-button-secondary admin-button-sm"
              style={{ alignSelf: 'flex-start', marginTop: 4 }}
              onClick={addIngredientRow}
            >
              + Add Ingredient
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="form-group">
          <label>Cooking Instructions / Steps</label>
          <div className="dynamic-list-group">
            {instructions.map((step, idx) => (
              <div key={idx} className="dynamic-list-row">
                <span className="dynamic-list-counter">{idx + 1}.</span>
                <textarea
                  rows="2"
                  placeholder={`Step ${idx + 1} instructions...`}
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="admin-button-danger admin-button-sm"
                  onClick={() => removeInstructionRow(idx)}
                  title="Remove step"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-button-secondary admin-button-sm"
              style={{ alignSelf: 'flex-start', marginTop: 4 }}
              onClick={addInstructionRow}
            >
              + Add Step
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <button
            type="submit"
            className="admin-button-primary"
            disabled={loading}
          >
            {loading ? 'Saving Recipe...' : 'Publish Recipe'}
          </button>
          <button
            type="button"
            className="admin-button-secondary"
            onClick={() => onNavigate('recipes')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRecipe
