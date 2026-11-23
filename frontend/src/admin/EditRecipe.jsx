import { useState, useEffect } from 'react'
import { getRecipeById, updateRecipe } from '../services/api'
import { categories } from '../data/categories'
import './admin.css'

function EditRecipe({ recipeId, onNavigate, onRecipeUpdated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [ingredients, setIngredients] = useState([''])
  const [instructions, setInstructions] = useState([''])
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadRecipeData() {
      if (!recipeId) {
        setError('No recipe ID provided.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const recipe = await getRecipeById(recipeId)
        if (recipe) {
          setName(recipe.name || '')
          setDescription(recipe.description || '')
          setImage(recipe.image || '')
          setSelectedCategories(
            Array.isArray(recipe.categories) ? recipe.categories : []
          )
          setIngredients(
            Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
              ? recipe.ingredients
              : ['']
          )
          setInstructions(
            Array.isArray(recipe.instructions) && recipe.instructions.length > 0
              ? recipe.instructions
              : ['']
          )
          setPrepTime(recipe.prepTime !== undefined ? String(recipe.prepTime) : '')
          setCookTime(recipe.cookTime !== undefined ? String(recipe.cookTime) : '')
          setServings(recipe.servings !== undefined ? String(recipe.servings) : '')
          setDifficulty(recipe.difficulty || 'Easy')
        }
      } catch (err) {
        setError(err.message || 'Failed to load recipe information.')
      } finally {
        setLoading(false)
      }
    }

    loadRecipeData()
  }, [recipeId])

  function handleCategoryToggle(catName) {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catName))
    } else {
      setSelectedCategories([...selectedCategories, catName])
    }
  }

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

    setSaving(true)
    try {
      const updated = await updateRecipe(recipeId, payload)
      setSuccess(`Recipe "${updated.name}" updated successfully!`)
      if (onRecipeUpdated) onRecipeUpdated(updated)
      setTimeout(() => {
        onNavigate('recipes')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to update recipe.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-empty-state">
        <div className="admin-spinner" />
        <p style={{ marginTop: 12 }}>Loading recipe details...</p>
      </div>
    )
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
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="edit-recipe-name">Recipe Name *</label>
            <input
              id="edit-recipe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-recipe-image">Image URL</label>
            <input
              id="edit-recipe-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-recipe-desc">Description</label>
          <textarea
            id="edit-recipe-desc"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

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

        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="edit-prep-time">Prep Time (minutes)</label>
            <input
              id="edit-prep-time"
              type="number"
              min="0"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-cook-time">Cooking Time (minutes)</label>
            <input
              id="edit-cook-time"
              type="number"
              min="0"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-servings">Servings</label>
            <input
              id="edit-servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 300 }}>
          <label htmlFor="edit-difficulty">Difficulty Level</label>
          <select
            id="edit-difficulty"
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
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="admin-button-danger admin-button-sm"
                  onClick={() => removeIngredientRow(idx)}
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
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="admin-button-danger admin-button-sm"
                  onClick={() => removeInstructionRow(idx)}
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

        <div className="form-actions-row">
          <button
            type="submit"
            className="admin-button-primary"
            disabled={saving}
          >
            {saving ? 'Updating Recipe...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="admin-button-secondary"
            onClick={() => onNavigate('recipes')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditRecipe
