import { useState } from 'react'

function Navbar({
  categories,
  showSearch = true,
  searchQuery,
  onSearchChange,
  currentUser,
  onUserLogout,
  onNavigateTo,
}) {
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const homeSectionPrefix = showSearch ? '' : '/'

  function closeAfterFocusLeaves(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsExploreOpen(false)
    }
  }

  function closeCreateAfterFocusLeaves(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsCreateOpen(false)
    }
  }

  return (
    <header className="site-header">
      <div className="nav-container">
        {/* Logo */}
        <a className="brand" href="/" aria-label="Swad home">
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

        {/* Center nav */}
        <nav className="primary-nav" aria-label="Main navigation">
          <div
            className={`nav-dropdown${isExploreOpen ? ' is-open' : ''}`}
            onMouseEnter={() => setIsExploreOpen(true)}
            onMouseLeave={() => setIsExploreOpen(false)}
            onFocus={() => setIsExploreOpen(true)}
            onBlur={closeAfterFocusLeaves}
          >
            <button
              className="nav-dropdown-trigger"
              type="button"
              aria-haspopup="true"
              aria-expanded={isExploreOpen}
              aria-controls="explore-category-menu"
              onClick={() => setIsExploreOpen(true)}
            >
              Explore
              <span className="nav-chevron" aria-hidden="true" />
            </button>
            <div
              className="nav-dropdown-menu"
              id="explore-category-menu"
              role="group"
              aria-label="Recipe categories"
            >
              {categories.map((category) => (
                <a
                  className="nav-dropdown-item"
                  href={category.href}
                  key={category.name}
                  onClick={() => setIsExploreOpen(false)}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
          <a href={`${homeSectionPrefix}#culture`}>Food Culture</a>
        </nav>

        {/* Right side: auth + create */}
        <div className="nav-actions">
          {showSearch && (
            <label className="search-field">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="search-icon"
              >
                <circle cx="8.8" cy="8.8" r="5.8" />
                <path d="m13.2 13.2 4 4" />
              </svg>
              <input
                aria-label="Search recipes"
                type="search"
                placeholder="Find a recipe"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </label>
          )}

          {currentUser ? (
            <>
              <span className="nav-greeting">Hi, {currentUser.name?.split(' ')[0] || 'User'}</span>
              <button className="nav-auth-link" onClick={onUserLogout}>Log out</button>
            </>
          ) : (
            <>
              <a href="/user/login" className="nav-auth-link">Log in</a>
              <a href="/user/login" className="nav-auth-link">Sign up</a>
            </>
          )}

          {/* Create button with dropdown */}
          <div
            className={`create-dropdown${isCreateOpen ? ' is-open' : ''}`}
            onMouseEnter={() => setIsCreateOpen(true)}
            onMouseLeave={() => setIsCreateOpen(false)}
            onFocus={() => setIsCreateOpen(true)}
            onBlur={closeCreateAfterFocusLeaves}
          >
            <button
              className="create-btn"
              type="button"
              aria-haspopup="true"
              aria-expanded={isCreateOpen}
              onClick={() => setIsCreateOpen(!isCreateOpen)}
            >
              Create
              <span className="create-chevron" aria-hidden="true">▾</span>
            </button>
            <div className="create-dropdown-menu">
              <a
                className="create-dropdown-item"
                href={currentUser ? '/user/dashboard' : '/user/login'}
                onClick={() => setIsCreateOpen(false)}
              >
                <span className="create-item-icon">🍴</span>
                <span className="create-item-text">
                  <strong>Recipe</strong>
                  <small>Write a recipe from scratch</small>
                </span>
              </a>
              <a
                className="create-dropdown-item"
                href={`${homeSectionPrefix}#recipes`}
                onClick={() => setIsCreateOpen(false)}
              >
                <span className="create-item-icon">⭐</span>
                <span className="create-item-text">
                  <strong>Bookmark</strong>
                  <small>Save an online recipe</small>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
