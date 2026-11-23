import { useState, useEffect } from 'react'
import { getRecipes } from '../services/api'
import { categories } from '../data/categories'
import './admin.css'

function AdminDashboard({ onNavigate, onSelectEdit }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const data = await getRecipes()
        setRecipes(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Failed to load recipe statistics.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Calculate category statistics
  const categoryCounts = categories.map((cat) => {
    const count = recipes.filter(
      (r) => Array.isArray(r.categories) && r.categories.includes(cat.name)
    ).length
    return { name: cat.name, count }
  })

  // Recently added recipes (last 5)
  const recentRecipes = [...recipes].slice(0, 5)

  // User submission count
  const userSubmissions = recipes.filter((r) => r.creatorRole === 'User').length
  const adminSubmissions = recipes.filter((r) => r.creatorRole === 'Admin').length

  if (loading) {
    return (
      <div className="admin-empty-state">
        <div className="admin-spinner" />
        <p style={{ marginTop: 12 }}>Loading dashboard metrics...</p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 24 }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Top statistics cards */}
      <div className="stats-grid">
        <div className="stat-card stat-featured">
          <div className="stat-card-label">Total Recipes</div>
          <div className="stat-card-value">{recipes.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">Categories</div>
          <div className="stat-card-value">{categories.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">User Submissions</div>
          <div className="stat-card-value">{userSubmissions}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">Admin Created</div>
          <div className="stat-card-value">{adminSubmissions}</div>
        </div>
      </div>

      <div className="dashboard-sections-grid">
        {/* Recently added recipes panel */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Recently Added Recipes</h2>
            <button
              type="button"
              className="admin-button-secondary admin-button-sm"
              onClick={() => onNavigate('recipes')}
            >
              View All
            </button>
          </div>

          {recentRecipes.length === 0 ? (
            <div className="admin-empty-state">
              <p>No recipes recorded yet.</p>
              <button
                type="button"
                className="admin-button-primary"
                onClick={() => onNavigate('add')}
              >
                Create your first recipe
              </button>
            </div>
          ) : (
            <div className="recipes-table-container">
              <table className="recipes-table">
                <thead>
                  <tr>
                    <th>Recipe</th>
                    <th>Category</th>
                    <th>Cook Time</th>
                    <th>Added By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecipes.map((recipe) => (
                    <tr key={recipe._id || recipe.name}>
                      <td>
                        <div className="table-recipe-info">
                          <img
                            src={recipe.image || 'https://via.placeholder.com/52'}
                            alt={recipe.name}
                            className="table-recipe-thumb"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=100&q=80'
                            }}
                          />
                          <div>
                            <span className="table-recipe-name">{recipe.name}</span>
                            <span className="table-recipe-desc">{recipe.description}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {recipe.categories && recipe.categories.length > 0
                          ? recipe.categories.join(', ')
                          : 'General'}
                      </td>
                      <td>{recipe.cookTime ? `${recipe.cookTime} min` : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {recipe.creatorName || 'Swad Team'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: recipe.creatorRole === 'User'
                                ? 'var(--green)'
                                : 'var(--saffron)',
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
                        <button
                          type="button"
                          className="admin-button-secondary admin-button-sm"
                          onClick={() => onSelectEdit(recipe._id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category distribution breakdown */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Category Distribution</h2>
          </div>

          <div className="category-breakdown-list">
            {categoryCounts.map((cat) => (
              <div className="category-breakdown-item" key={cat.name}>
                <strong>{cat.name}</strong>
                <span className="category-count-badge">{cat.count} recipes</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <button
              type="button"
              className="admin-button-primary"
              style={{ width: '100%' }}
              onClick={() => onNavigate('add')}
            >
              + Add New Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

