import { useState } from 'react'
import { userLogin, userRegister } from '../services/api'
import './user.css'

function UserAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    setLoading(true)
    try {
      const data =
        mode === 'register'
          ? await userRegister(name, email, password)
          : await userLogin(email, password)

      if (data?.user) {
        onLoginSuccess(data.user)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-auth-wrapper">
      <div className="user-auth-card">
        <div className="user-auth-header">
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
          <span className="user-badge">Community</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Join Swad'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to share and manage your Nepali recipes'
              : 'Create an account to contribute recipes to our community'}
          </p>
        </div>

        {error && (
          <div className="user-alert user-alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form
          className="admin-form"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="user-name">Your Name</label>
              <input
                id="user-name"
                type="text"
                placeholder="e.g. Priya Shrestha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user-email">Email Address</label>
            <input
              id="user-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password">
              Password {mode === 'register' && '(min 6 characters)'}
            </label>
            <div className="password-input-wrap">
              <input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="user-btn-primary"
            style={{ width: '100%', padding: '12px 20px', marginTop: 4 }}
            disabled={loading}
          >
            {loading
              ? mode === 'register'
                ? 'Creating Account…'
                : 'Signing In…'
              : mode === 'register'
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        <div className="user-auth-switch">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setMode('register'); setError('') }}>
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError('') }}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--muted)',
          }}
        >
          <a href="/" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
            ← Return to public site
          </a>
        </div>
      </div>
    </div>
  )
}

export default UserAuth
