import { useState, useEffect } from 'react'
import { getRecipes, deleteRecipe } from '../services/api'
import UserRecipeForm from './UserRecipeForm'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { logout } from '../services/api'
import './user.css'

function UserDashboard({ currentUser, onNavigate, onLogout }) {
  const [tab, setTab] = useState('browse') // 'browse' | 'my-recipes' | 'add' | 'edit'
  const [allRecipes, setAllRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeToDelete, setRecipeToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  async function loadRecipes() {
    setLoading(true)
    setError('')
    try {
      const data = await getRecipes()
      setAllRecipes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Could not load recipes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  // My recipes = recipes created by this user
  const myRecipes = allRecipes.filter(
    (r) => r.createdBy === currentUser.id || r.createdBy?._id === currentUser.id
  )

  // Browse = all recipes, filtered by search
  const term = searchTerm.trim().toLowerCase()
  const browseRecipes = allRecipes.filter((r) => {
    if (!term) return true
    const text = `${r.name} ${r.description || ''} ${(r.categories || []).join(' ')}`.toLowerCase()
    return text.includes(term)
  })

  async function handleDelete(recipe) {
    setIsDeleting(true)
    try {
      await deleteRecipe(recipe._id)
      setSuccessMsg(`"${recipe.name}" deleted.`)
      setRecipeToDelete(null)
      setAllRecipes((prev) => prev.filter((r) => r._id !== recipe._id))
      setTimeout(() => setSuccessMsg(''), 3500)
    } catch (err) {
      setError(err.message || 'Delete failed.')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleLogout() {
    await logout()
    onLogout()
  }

  function goEdit(recipe) {
    setEditingRecipe(recipe)
    setTab('edit')
  }

  function handleTabChange(t) {
    setTab(t)
    setEditingRecipe(null)
  }

  return (
    <div className="user-shell">
      {/* Top bar */}
      <div className="user-topbar">
        <a href="/" className="brand user-topbar-brand">
          <span className="brand-wordmark" aria-hidden="true">
            <span className="brand-script">स्वा</span>
            <svg className="brand-fork-d" viewBox="0 -8 32 48" fill="none">
              <path d="M22 19v27M22 23c-2.5-2.7-5-4-9-4-6.3 0-10.8 5-10.8 13S6.7 44 13 44c4 0 7-1.7 9-4.5" />
              <path d="M16-6v19m4-19v20m4-20v20m4-20v19m-12 0c0 4.5 2.5 7 6 7s6-2.5 6-7" />
            </svg>
          </span>
        </a>

        <div className="user-topbar-tabs">
          {[
            { key: 'browse', label: 'All Recipes' },
            { key: 'my-recipes', label: 'My Recipes' },
            { key: 'add', label: '+ Share Recipe' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              className={`user-tab-btn ${tab === t.key ? 'is-active' : ''}`}
              onClick={() => handleTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="user-topbar-actions">
          <span className="user-topbar-name">👤 {currentUser.name}</span>
          <button type="button" className="user-btn-secondary" onClick={handleLogout} style={{ padding: '7px 12px', fontSize: '0.85rem' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="user-content">
        {/* Notifications */}
        {successMsg && <div className="user-alert user-alert-success">✓ {successMsg}</div>}
        {error && <div className="user-alert user-alert-error">⚠️ {error}</div>}

        {/* ─── BROWSE ALL RECIPES ─── */}
        {tab === 'browse' && (
          <div>
            <div className="user-recipes-header">
              <h2>Explore Nepali Recipes</h2>
              <input
                type="search"
                placeholder="Search recipes…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '9px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  fontSize: '0.9rem',
                  minWidth: 240,
                  background: 'var(--paper)',
                }}
              />
            </div>

            {loading ? (
              <div className="user-empty-state"><div className="admin-spinner" /></div>
            ) : browseRecipes.length === 0 ? (
              <div className="user-empty-state">
                <h3>No recipes found</h3>
                <p>Try a different search term.</p>
              </div>
            ) : (
              <div className="user-recipes-grid">
                {browseRecipes.map((r) => (
                  <RecipeCardUser
                    key={r._id || r.name}
                    recipe={r}
                    viewingUserId={currentUser.id}
                    onView={() => setSelectedRecipe(r)}
                    onEdit={goEdit}
                    onDeleteClick={(recipe) => setRecipeToDelete(recipe)}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── MY RECIPES ─── */}
        {tab === 'my-recipes' && (
          <div>
            <div className="user-recipes-header">
              <h2>My Recipes</h2>
              <button type="button" className="user-btn-primary" onClick={() => handleTabChange('add')}>
                + Share a Recipe
              </button>
            </div>

            {loading ? (
              <div className="user-empty-state"><div className="admin-spinner" /></div>
            ) : myRecipes.length === 0 ? (
              <div className="user-empty-state">
                <h3>You haven't shared a recipe yet</h3>
                <p>Share your first authentic Nepali recipe with the community.</p>
                <button
                  type="button"
                  className="user-btn-primary"
                  style={{ marginTop: 16 }}
                  onClick={() => handleTabChange('add')}
                >
                  + Share a Recipe
                </button>
              </div>
            ) : (
              <div className="user-recipes-grid">
                {myRecipes.map((r) => (
                  <RecipeCardUser
                    key={r._id}
                    recipe={r}
                    viewingUserId={currentUser.id}
                    onView={() => setSelectedRecipe(r)}
                    onEdit={goEdit}
                    onDeleteClick={(recipe) => setRecipeToDelete(recipe)}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── ADD RECIPE ─── */}
        {tab === 'add' && (
          <UserRecipeForm
            onNavigate={handleTabChange}
            onSuccess={() => { loadRecipes() }}
          />
        )}

        {/* ─── EDIT RECIPE ─── */}
        {tab === 'edit' && editingRecipe && (
          <UserRecipeForm
            initial={editingRecipe}
            onNavigate={(t) => { handleTabChange(t); loadRecipes() }}
            onSuccess={() => { loadRecipes() }}
          />
        )}
      </div>

      {/* Full Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}

      {/* Delete Confirmation */}
      {recipeToDelete && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-dialog">
            <h3>Delete Recipe</h3>
            <p>
              Are you sure you want to permanently delete{' '}
              <strong className="danger-highlight">"{recipeToDelete.name}"</strong>?
              <br />This cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-button-secondary" onClick={() => setRecipeToDelete(null)} disabled={isDeleting}>Cancel</button>
              <button type="button" className="admin-button-danger" onClick={() => handleDelete(recipeToDelete)} disabled={isDeleting}>
                {isDeleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Recipe card inside user dashboard ────────────────────────────────────────
function RecipeCardUser({ recipe, viewingUserId, onView, onEdit, onDeleteClick, showActions }) {
  const categoryLabel = Array.isArray(recipe.categories) ? recipe.categories[0] : recipe.category || ''
  const cookDisplay = typeof recipe.cookTime === 'number' ? `${recipe.cookTime} min` : recipe.cookTime || ''
  const isOwner = recipe.createdBy === viewingUserId || recipe.createdBy?._id === viewingUserId

  return (
    <div className="user-recipe-card">
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="user-recipe-card-img"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="user-recipe-card-img-placeholder">📷 No photo</div>
      )}
      <div className="user-recipe-card-body">
        {categoryLabel && <div className="user-recipe-card-category">{categoryLabel}</div>}
        <h3 className="user-recipe-card-name">{recipe.name}</h3>
        {recipe.description && (
          <p className="user-recipe-card-desc">{recipe.description}</p>
        )}
        <div className="user-recipe-card-meta">
          {cookDisplay && <span>🕐 {cookDisplay}</span>}
          {recipe.difficulty && <span>📊 {recipe.difficulty}</span>}
          {recipe.creatorName && <span>👤 {recipe.creatorName}</span>}
        </div>
        <div className="user-recipe-card-actions">
          <button type="button" className="user-btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 12px' }} onClick={onView}>
            View Recipe
          </button>
          {(showActions || isOwner) && (
            <>
              <button type="button" className="user-btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 12px' }} onClick={() => onEdit(recipe)}>
                Edit
              </button>
              <button type="button" className="user-btn-danger" style={{ fontSize: '0.82rem', padding: '6px 12px' }} onClick={() => onDeleteClick(recipe)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
