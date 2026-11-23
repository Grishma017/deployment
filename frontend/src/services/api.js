const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function getStoredToken() {
  return localStorage.getItem('swad_token')
}

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken()
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return data
}

// ─── Recipes ──────────────────────────────────────────────────────────────────

export async function getRecipes(params = {}) {
  const query = new URLSearchParams()
  if (params.category) query.append('category', params.category)
  if (params.search) query.append('search', params.search)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/recipes${qs}`, { method: 'GET' })
}

export async function getRecipeById(id) {
  return apiRequest(`/recipes/${id}`, { method: 'GET' })
}

export async function createRecipe(recipeData) {
  return apiRequest('/recipes', { method: 'POST', body: JSON.stringify(recipeData) })
}

export async function updateRecipe(id, recipeData) {
  return apiRequest(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(recipeData) })
}

export async function deleteRecipe(id) {
  return apiRequest(`/recipes/${id}`, { method: 'DELETE' })
}

// Upload image file → returns { url, publicId }
export async function uploadRecipeImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return apiRequest('/recipes/upload-image', { method: 'POST', body: formData })
}

// ─── Auth (shared) ────────────────────────────────────────────────────────────

function saveSession(token, user) {
  localStorage.setItem('swad_token', token)
  localStorage.setItem('swad_user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('swad_token')
  localStorage.removeItem('swad_user')
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('swad_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ─── User Auth ────────────────────────────────────────────────────────────────

export async function userRegister(name, email, password) {
  const data = await apiRequest('/auth/user/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  if (data?.token) saveSession(data.token, data.user)
  return data
}

export async function userLogin(email, password) {
  const data = await apiRequest('/auth/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data?.token) saveSession(data.token, data.user)
  return data
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export async function adminLogin(email, password) {
  const data = await apiRequest('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data?.token) saveSession(data.token, data.user)
  return data
}

// ─── Shared Auth ──────────────────────────────────────────────────────────────

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } finally {
    clearSession()
  }
}

export async function getMe() {
  return apiRequest('/auth/me', { method: 'GET' })
}

// Legacy compat shims
export { adminLogin as adminLoginLegacy }
export async function adminLogout() { return logout() }
export async function getAdminProfile() { return getMe() }
