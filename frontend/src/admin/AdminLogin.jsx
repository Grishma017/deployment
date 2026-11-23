import { useState, useEffect } from 'react'
import { adminLogin, getMe } from '../services/api'
import './admin.css'

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already authenticated as admin, redirect to dashboard directly
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await getMe()
        if (res?.user?.role === 'admin') {
          onLoginSuccess(res.user)
        }
      } catch (err) {
        // Not authenticated yet, stay on login
      }
    }
    checkExistingSession()
  }, [onLoginSuccess])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)
    try {
      const data = await adminLogin(email, password)
      // adminLogin saves token; data.user has { id, name, email, role }
      if (data?.user) {
        onLoginSuccess(data.user)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
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
          <br />
          <span className="admin-badge">Admin Portal</span>
          <h1>Sign In</h1>
          <p>Manage Swad recipes, categories, and culinary archives</p>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error" role="alert" style={{ marginBottom: 20 }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@swad.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="password-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-button-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">← Return to public website</a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
