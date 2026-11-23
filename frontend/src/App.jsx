import { useState, useEffect } from 'react'
import CultureSection from './components/CultureSection.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './components/HeroSection.jsx'
import Navbar from './components/Navbar.jsx'
import { categories } from './data/categories.js'
import RecipeGrid from './components/RecipeGrid.jsx'
import ShareRecipeSection from './components/ShareRecipeSection.jsx'
import CategoryRecipesPage from './pages/CategoryRecipesPage.jsx'

// Admin Views
import AdminLogin from './admin/AdminLogin.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import ManageRecipes from './admin/ManageRecipes.jsx'
import AddRecipe from './admin/AddRecipe.jsx'
import EditRecipe from './admin/EditRecipe.jsx'

// User Views
import UserAuth from './user/UserAuth.jsx'
import UserDashboard from './user/UserDashboard.jsx'

import { getMe, logout, getStoredUser } from './services/api.js'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname.replace(/\/+$/, '') || '/'
  )

  // Auth state
  const [adminUser, setAdminUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [editRecipeId, setEditRecipeId] = useState(null)

  // Handle browser back/forward buttons
  useEffect(() => {
    function handlePopState() {
      setCurrentPath(window.location.pathname.replace(/\/+$/, '') || '/')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Check initial session on load
  useEffect(() => {
    async function verifySession() {
      // First try localStorage (fast path, no network)
      const stored = getStoredUser()
      if (stored?.role === 'admin') setAdminUser(stored)
      else if (stored?.role === 'user') setCurrentUser(stored)

      // Then verify with server
      try {
        const res = await getMe()
        if (res?.user?.role === 'admin') {
          setAdminUser(res.user)
          setCurrentUser(null)
        } else if (res?.user?.role === 'user') {
          setCurrentUser(res.user)
          setAdminUser(null)
        } else {
          setAdminUser(null)
          setCurrentUser(null)
        }
      } catch (err) {
        // Server says not authenticated – clear state
        setAdminUser(null)
        setCurrentUser(null)
      } finally {
        setAuthChecking(false)
      }
    }
    verifySession()
  }, [])

  function navigateTo(path) {
    window.history.pushState({}, '', path)
    setCurrentPath(path.replace(/\/+$/, '') || '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleAdminLogout() {
    await logout()
    setAdminUser(null)
    navigateTo('/admin/login')
  }

  async function handleUserLogout() {
    await logout()
    setCurrentUser(null)
    navigateTo('/')
  }

  // ─── ADMIN ROUTING ────────────────────────────────────────────────────────
  const isAdminPath = currentPath.startsWith('/admin')

  if (isAdminPath) {
    if (authChecking) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--canvas)',
          }}
        >
          <div className="admin-spinner" />
        </div>
      )
    }

    if (currentPath === '/admin/login' || (!adminUser && currentPath.startsWith('/admin'))) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user)
            navigateTo('/admin/dashboard')
          }}
        />
      )
    }

    let activeTab = 'dashboard'
    if (currentPath === '/admin/recipes') activeTab = 'recipes'
    else if (currentPath === '/admin/recipes/add') activeTab = 'add'
    else if (currentPath.startsWith('/admin/recipes/edit')) activeTab = 'edit'

    function handleAdminTabNavigate(tab) {
      if (tab === 'dashboard') navigateTo('/admin/dashboard')
      else if (tab === 'recipes') navigateTo('/admin/recipes')
      else if (tab === 'add') navigateTo('/admin/recipes/add')
    }

    return (
      <AdminLayout
        activeTab={activeTab}
        onNavigate={handleAdminTabNavigate}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
      >
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigate={handleAdminTabNavigate}
            onSelectEdit={(id) => {
              setEditRecipeId(id)
              navigateTo(`/admin/recipes/edit/${id}`)
            }}
          />
        )}

        {activeTab === 'recipes' && (
          <ManageRecipes
            onNavigate={handleAdminTabNavigate}
            onSelectEdit={(id) => {
              setEditRecipeId(id)
              navigateTo(`/admin/recipes/edit/${id}`)
            }}
          />
        )}

        {activeTab === 'add' && (
          <AddRecipe
            onNavigate={handleAdminTabNavigate}
            onRecipeCreated={() => {}}
          />
        )}

        {activeTab === 'edit' && (
          <EditRecipe
            recipeId={editRecipeId || currentPath.split('/admin/recipes/edit/')[1]}
            onNavigate={handleAdminTabNavigate}
            onRecipeUpdated={() => {}}
          />
        )}
      </AdminLayout>
    )
  }

  // ─── USER ROUTING ─────────────────────────────────────────────────────────
  const isUserPath = currentPath.startsWith('/user')

  if (isUserPath) {
    if (authChecking) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--canvas)',
          }}
        >
          <div className="admin-spinner" />
        </div>
      )
    }

    // Login / Register page
    if (currentPath === '/user/login' || currentPath === '/user/register') {
      // If already logged in as user → go to dashboard
      if (currentUser) {
        navigateTo('/user/dashboard')
        return null
      }
      // If logged in as admin → go to admin
      if (adminUser) {
        navigateTo('/admin/dashboard')
        return null
      }
      return (
        <UserAuth
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            navigateTo('/user/dashboard')
          }}
        />
      )
    }

    // User dashboard (protected)
    if (currentPath === '/user/dashboard') {
      if (!currentUser) {
        navigateTo('/user/login')
        return null
      }
      return (
        <UserDashboard
          currentUser={currentUser}
          onLogout={handleUserLogout}
        />
      )
    }

    // Fallback: redirect unknown /user/* paths
    navigateTo('/user/login')
    return null
  }

  // ─── PUBLIC WEBSITE ROUTING ───────────────────────────────────────────────
  const activeCategory = categories.find(
    (category) => category.href === currentPath
  )

  return (
    <div className="site-shell" id="top">
      <Navbar
        categories={categories}
        showSearch={!activeCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onUserLogout={handleUserLogout}
        onNavigateTo={navigateTo}
      />
      <main>
        {activeCategory ? (
          <CategoryRecipesPage slug={activeCategory.slug} />
        ) : (
          <>
            <HeroSection />
            <RecipeGrid
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <CultureSection />
            <ShareRecipeSection />
          </>
        )}
      </main>
      <Footer homePath={activeCategory ? '/' : ''} />
    </div>
  )
}

export default App
