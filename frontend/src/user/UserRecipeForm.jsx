import { useState, useRef } from 'react'
import { createRecipe, updateRecipe, uploadRecipeImage } from '../services/api'
import { categories } from '../data/categories'
import './user.css'

const RECIPE_STRUCTURE = {
  intro: 'Introduction',
  ingredients: 'Ingredients',
  instructions: 'Cooking Instructions',
  tips: 'Tips & Notes',
}

function ImageUploadField({ imageUrl, imagePublicId, onUpload, onRemove }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5 MB.')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const result = await uploadRecipeImage(file)
      onUpload(result.url, result.publicId)
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (uploading) {
    return (
      <div className="image-upload-zone">
        <div className="image-uploading-overlay">
          <div className="admin-spinner" /> Uploading image…
        </div>
      </div>
    )
  }

  if (imageUrl) {
    return (
      <div className="image-upload-preview">
        <img src={imageUrl} alt="Recipe preview" />
        <button
          type="button"
          className="image-upload-preview-remove"
          onClick={onRemove}
          aria-label="Remove image"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div
      className={`image-upload-zone ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        handleFile(file)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div className="image-upload-zone-icon">📷</div>
      <div className="image-upload-zone-text">
        <strong>Click to upload</strong> or drag & drop
        <br />
        <span style={{ fontSize: '0.82rem' }}>JPG, PNG, WEBP — max 5 MB</span>
      </div>
      {uploadError && (
        <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: 8 }}>
          {uploadError}
        </p>
      )}
    </div>
  )
}

function DynamicList({ items, onChange, placeholder }) {
  function handleChange(i, val) {
    const updated = [...items]
    updated[i] = val
    onChange(updated)
  }
  function add() { onChange([...items, '']) }
  function remove(i) {
    if (items.length === 1) { onChange(['']); return }
    onChange(items.filter((_, idx) => idx !== i))
  }
  return (
    <div className="dynamic-list-group">
      {items.map((item, i) => (
        <div key={i} className="dynamic-list-row">
          <span className="dynamic-list-counter">{i + 1}.</span>
          <input
            type="text"
            value={item}
            placeholder={placeholder}
            onChange={(e) => handleChange(i, e.target.value)}
          />
          <button type="button" className="admin-button-danger admin-button-sm" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="admin-button-secondary admin-button-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={add}>
        + Add
      </button>
    </div>
  )
}

function UserRecipeForm({ initial = null, onNavigate, onSuccess }) {
  const editing = !!initial

  // ─── Form state ───────────────────────────────────────────────────────────
  const [name, setName] = useState(initial?.name || '')
  const [imageUrl, setImageUrl] = useState(initial?.image || '')
  const [imagePublicId, setImagePublicId] = useState(initial?.imagePublicId || '')
  const [selectedCategories, setSelectedCategories] = useState(initial?.categories || [])

  // Structured sections (same headings for all, different content)
  const [intro, setIntro] = useState(
    initial?.description || ''
  )
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients : ['']
  )
  const [instructions, setInstructions] = useState(
    initial?.instructions?.length ? initial.instructions : ['']
  )
  const [tips, setTips] = useState(
    initial?.tips?.length ? initial.tips : ['']
  )

  const [prepTime, setPrepTime] = useState(initial?.prepTime !== undefined ? String(initial.prepTime) : '')
  const [cookTime, setCookTime] = useState(initial?.cookTime !== undefined ? String(initial.cookTime) : '')
  const [servings, setServings] = useState(initial?.servings !== undefined ? String(initial.servings) : '')
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'Easy')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function toggleCategory(catName) {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) { setError('Recipe name is required.'); return }
    if (selectedCategories.length === 0) { setError('Select at least one category.'); return }

    const cleanIngredients = ingredients.map((s) => s.trim()).filter(Boolean)
    const cleanInstructions = instructions.map((s) => s.trim()).filter(Boolean)
    const cleanTips = tips.map((s) => s.trim()).filter(Boolean)

    const payload = {
      name: name.trim(),
      description: intro.trim(),
      image: imageUrl,
      imagePublicId,
      categories: selectedCategories,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      tips: cleanTips,
      prepTime: prepTime ? Number(prepTime) : undefined,
      cookTime: cookTime ? Number(cookTime) : undefined,
      servings: servings ? Number(servings) : undefined,
      difficulty,
    }

    setLoading(true)
    try {
      const saved = editing
        ? await updateRecipe(initial._id, payload)
        : await createRecipe(payload)

      setSuccess(editing ? 'Recipe updated!' : 'Recipe published!')
      onSuccess && onSuccess(saved)
      setTimeout(() => onNavigate('my-recipes'), 1200)
    } catch (err) {
      setError(err.message || 'Failed to save recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-recipe-form-wrap">
      <h2>{editing ? 'Edit Recipe' : 'Share a New Recipe'}</h2>

      {error && <div className="user-alert user-alert-error">⚠️ {error}</div>}
      {success && <div className="user-alert user-alert-success">✓ {success}</div>}

      <form className="admin-form" onSubmit={handleSubmit} style={{ gap: 24 }}>

        {/* Recipe Name */}
        <div className="form-group">
          <label htmlFor="r-name">Recipe Name *</label>
          <input
            id="r-name"
            type="text"
            placeholder="e.g. Grandma's Sel Roti"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label>Recipe Photo</label>
          <ImageUploadField
            imageUrl={imageUrl}
            imagePublicId={imagePublicId}
            onUpload={(url, pid) => { setImageUrl(url); setImagePublicId(pid) }}
            onRemove={() => { setImageUrl(''); setImagePublicId('') }}
          />
        </div>

        {/* Categories */}
        <div className="form-group">
          <label>Category * (Select one or more)</label>
          <div className="category-checkbox-group">
            {categories.map((cat) => (
              <label key={cat.slug} className="category-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* ─── FIXED STRUCTURE SECTIONS ─── */}

        {/* Introduction */}
        <div className="form-group">
          <label htmlFor="r-intro">
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>§ </span>
            {RECIPE_STRUCTURE.intro}
          </label>
          <textarea
            id="r-intro"
            rows="4"
            placeholder="Tell the story behind this dish — its origin, what makes it special, when you make it…"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
        </div>

        {/* Ingredients */}
        <div className="form-group">
          <label>
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>§ </span>
            {RECIPE_STRUCTURE.ingredients}
          </label>
          <DynamicList
            items={ingredients}
            onChange={setIngredients}
            placeholder="e.g. 2 cups rice flour"
          />
        </div>

        {/* Instructions */}
        <div className="form-group">
          <label>
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>§ </span>
            {RECIPE_STRUCTURE.instructions}
          </label>
          <DynamicList
            items={instructions}
            onChange={setInstructions}
            placeholder="e.g. Knead dough until smooth"
          />
        </div>

        {/* Tips */}
        <div className="form-group">
          <label>
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>§ </span>
            {RECIPE_STRUCTURE.tips}
          </label>
          <DynamicList
            items={tips}
            onChange={setTips}
            placeholder="e.g. Best enjoyed fresh with masala chiya"
          />
        </div>

        {/* Times & Difficulty */}
        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="r-prep">Prep Time (min)</label>
            <input id="r-prep" type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="r-cook">Cook Time (min)</label>
            <input id="r-cook" type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="r-servings">Servings</label>
            <input id="r-servings" type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 260 }}>
          <label htmlFor="r-difficulty">Difficulty</label>
          <select id="r-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="form-actions-row">
          <button type="submit" className="user-btn-primary" disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update Recipe' : 'Publish Recipe'}
          </button>
          <button type="button" className="user-btn-secondary" onClick={() => onNavigate('my-recipes')} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserRecipeForm
