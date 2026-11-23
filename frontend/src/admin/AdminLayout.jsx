import { useState } from 'react'
import './admin.css'

function AdminLayout({
  activeTab = 'dashboard',
  onNavigate,
  adminUser,
  onLogout,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <a className="brand" href="/" aria-label="Swad Home">
            <span className="brand-lockup">
              <span className="brand-wordmark" aria-hidden="true">
                <span className="brand-script">स्वा</span>
                <svg className="brand-fork-d" viewBox="0 -8 32 48" fill="none">
                  <path d="M22 19v27M22 23c-2.5-2.7-5-4-9-4-6.3 0-10.8 5-10.8 13S6.7 44 13 44c4 0 7-1.7 9-4.5" />
                  <path d="M16-6v19m4-19v20m4-20v20m4-20v19m-12 0c0 4.5 2.5 7 6 7s6-2.5 6-7" />
                </svg>
              </span>
            </span>
          </a>
          <span className="admin-role-tag">Management Console</span>
        </div>

        <nav className="admin-nav" aria-label="Admin Navigation">
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'is-active' : ''}`}
            onClick={() => {
              onNavigate('dashboard')
              setMobileMenuOpen(false)
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'recipes' ? 'is-active' : ''}`}
            onClick={() => {
              onNavigate('recipes')
              setMobileMenuOpen(false)
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Manage Recipes
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'add' ? 'is-active' : ''}`}
            onClick={() => {
              onNavigate('add')
              setMobileMenuOpen(false)
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add New Recipe
          </button>

          <a
            href="/"
            className="admin-nav-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Live Site ↗
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <strong>{adminUser?.name || 'Administrator'}</strong>
            <span>{adminUser?.email || 'admin@swad.com'}</span>
          </div>
          <button
            type="button"
            className="admin-nav-item admin-logout-btn"
            onClick={onLogout}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <h1 className="admin-topbar-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'recipes' && 'Recipe Management'}
              {activeTab === 'add' && 'Create New Recipe'}
              {activeTab === 'edit' && 'Modify Recipe'}
            </h1>
          </div>

          <div className="admin-topbar-actions">
            {activeTab !== 'add' && (
              <button
                type="button"
                className="admin-button-primary"
                onClick={() => onNavigate('add')}
              >
                + Add Recipe
              </button>
            )}
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
