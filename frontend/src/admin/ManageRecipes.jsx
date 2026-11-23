import { useState, useEffect } from 'react'
import { getRecipes, deleteRecipe } from '../services/api'
import { categories } from '../data/categories'
import './admin.css'

function ManageRecipes({ onNavigate, onSelectEdit }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // State for delete confirmation modal
  const [recipeToDelete, setRecipeToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadRecipes() {
    try {
      setLoading(true)
      const data = await getRecipes()
      setRecipes(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch recipes from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  async function handleConfirmDelete() {
    if (!recipeToDelete) return
    setIsDeleting(true)
    try {
      await deleteRecipe(recipeToDelete._id)
      setSuccessMsg(`Recipe "${recipeToDelete.name}" was permanently removed.`)
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id))
      setRecipeToDelete(null)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setError(err.message || 'Failed to delete recipe.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter recipes based on client search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      !selectedCategory ||
      (Array.isArray(recipe.categories) &&
        recipe.categories.includes(selectedCategory))

    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      recipe.name?.toLowerCase().includes(term) ||
      recipe.description?.toLowerCase().includes(term) ||
      recipe.categories?.some((c) => c.toLowerCase().includes(term))

    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Notifications */}
      {successMsg && (
        <div className="admin-alert admin-alert-success" style={{ marginBottom: 20 }}>
          <span>✓ {successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 20 }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Action Header & Filters */}
      <div className="manage-recipes-header">
        <div className="manage-recipes-filters">
          <input
            type="search"
            className="manage-recipes-search form-group"
            placeholder="Search by name, ingredients, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="manage-recipes-category-select form-group"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories ({recipes.length})</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="admin-button-primary"
          onClick={() => onNavigate('add')}
        >
          + Add New Recipe
        </button>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="admin-empty-state">
          <div className="admin-spinner" />
          <p style={{ marginTop: 12 }}>Loading recipes...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="dashboard-panel admin-empty-state">
          <h3>No recipes found</h3>
          <p>
            {searchTerm || selectedCategory
              ? 'Try modifying your search or clearing category filters.'
              : 'There are currently no recipes stored in the database.'}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              type="button"
              className="admin-button-secondary"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="recipes-table-container">
          <table className="recipes-table">
            <thead>
              <tr>
                <th>Recipe</th>
                <th>Category</th>
                <th>Cooking Time</th>
                <th>Difficulty</th>
                <th>Added By</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe._id || recipe.name}>
                  <td>
                    <div className="table-recipe-info">
                      <img
                        src={recipe.image || 'https://via.placeholder.com/52'}
                        alt={recipe.name}
                        className="table-recipe-thumb"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=100&q=80'
                        }}
                      />
                      <div>
                        <span className="table-recipe-name">{recipe.name}</span>
                        <span className="table-recipe-desc">
                          {recipe.description || 'No description provided'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {recipe.categories && recipe.categories.length > 0
                      ? recipe.categories.join(', ')
                      : 'Uncategorized'}
                  </td>
                  <td>{recipe.cookTime ? `${recipe.cookTime} mins` : '—'}</td>
                  <td>
                    <span
                      className={`difficulty-pill ${
                        (recipe.difficulty || 'Easy').toLowerCase()
                      }`}
                    >
                      {recipe.difficulty || 'Easy'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {recipe.creatorName || 'Swad Team'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: recipe.creatorRole === 'User' ? 'var(--green)' : 'var(--saffron)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {recipe.creatorRole || 'Admin'}
                      </span>
                      {recipe.createdAt && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink)', opacity: 0.5 }}>
                          {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="admin-button-secondary admin-button-sm"
                        onClick={() => onSelectEdit(recipe._id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-button-danger admin-button-sm"
                        onClick={() => setRecipeToDelete(recipe)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recipeToDelete && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-dialog">
            <h3>Delete Recipe</h3>
            <p>
              Are you sure you want to permanently delete{' '}
              <strong className="danger-highlight">"{recipeToDelete.name}"</strong>?
              <br />
              This action cannot be undone and will immediately remove the recipe from the live public website and MongoDB database.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() => setRecipeToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-button-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageRecipes
