import { useState } from 'react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('main')
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleEmailLogin = (e) => {
    e.preventDefault()
    // Handle email login logic here
    console.log('Email login:', { email, password })
  }

  const handleEmailRegister = (e) => {
    e.preventDefault()
    // Handle email register logic here
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Email register:', { email, password })
  }

  const handleGithubLogin = () => {
    // Handle GitHub SSO login logic here
    console.log('GitHub SSO login')
  }

  const handleGoogleLogin = () => {
    // Handle Google SSO login logic here
    console.log('Google SSO login')
  }

  const renderFormContent = () => (
    <>
      {/* Card Container */}
      <div className="login-card">
        {/* Welcome Section - Centered */}
        <div className="welcome-section">
          <h1 className="login-title">
            {activeTab === 'login' ? 'Welcome back!' : 'Create an account!'}
          </h1>
          <p className="login-subtitle">
            {activeTab === 'login' 
              ? 'Enter your credentials to jump back in.' 
              : 'Enter your details to create your account.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="tab-selector">
          <button
            type="button"
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login/Register Form */}
        <form onSubmit={activeTab === 'login' ? handleEmailLogin : handleEmailRegister} className="email-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password Field - Only for Register */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showConfirmPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Remember Me and Forgot Password - Only for Login */}
          {activeTab === 'login' && (
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="submit-button">
            {activeTab === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">Or sign in with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-buttons">
          <button
            type="button"
            onClick={handleGithubLogin}
            className="social-button social-button-github"
            aria-label="Sign in with GitHub"
          >
            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="social-button social-button-google"
            aria-label="Sign in with Google"
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>
    </>
  )

  // Main Page Component
  const renderMainPage = () => (
    <div className="main-page">
      {/* Navigation Bar */}
      <nav className="main-navigation">
        {/* Logo - Left Side */}
        <div 
          className="logo-container"
          onClick={() => setCurrentPage('main')}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon">J</div>
          <span className="logo-text">Jejakra.</span>
        </div>
        
        {/* Navigation Links - Right Side */}
        <div className="nav-links">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); console.log('Pricing clicked'); }}>
            Pricing
          </a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); console.log('Feature clicked'); }}>
            Feature
          </a>
          <button
            type="button"
            className="nav-button"
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Hero Content - Centered */}
        <div className="hero-content">
          <h1 className="hero-title">Track your culinary journey, one recipe at a time.</h1>
          <p className="hero-subtitle">Every recipe holds a story—save your dishes, reflect on what worked, and grow your cooking skills one meal at a time.</p>
          <div className="hero-buttons">
            <button
              type="button"
              className="hero-button hero-button-primary"
              onClick={() => setCurrentPage('login')}
            >
              Get Started
            </button>
            <button
              type="button"
              className="hero-button hero-button-secondary"
              onClick={(e) => { e.preventDefault(); console.log('Learn More clicked'); }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature-section">
        <div className="feature-content">
          <h2 className="feature-section-title">Features</h2>
          
          <div className="feature-grid">
            {/* Core Tracking */}
            <div className="feature-card">
              <h3 className="feature-card-title">Core Tracking</h3>
              <p className="feature-card-tagline">Log every attempt. Learn from every cook.</p>
              <p className="feature-card-description">Save recipes you want to try. Record time, difficulty, outcomes, notes, and changes for each attempt.</p>
            </div>

            {/* Skill Growth */}
            <div className="feature-card">
              <h3 className="feature-card-title">Skill Growth</h3>
              <p className="feature-card-tagline">Turn repetition into progress.</p>
              <p className="feature-card-description">Track techniques learned, cuisines explored, and difficulty levels you've mastered.</p>
            </div>

            {/* Journey Timeline */}
            <div className="feature-card">
              <h3 className="feature-card-title">Journey Timeline</h3>
              <p className="feature-card-tagline">See how far you've come.</p>
              <p className="feature-card-description">A visual timeline of your cooking progress—from first try to refined favorite.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Jejakra</h3>
            <p className="footer-text">Track your culinary journey, one recipe at a time.</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Pricing clicked'); }}>Pricing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Feature clicked'); }}>Feature</a></li>
              <li><a href="#" onClick={() => setCurrentPage('login')}>Login</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:contact@jejakra.com">contact@jejakra.com</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 Jejakra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )

  // Login Page Component
  const renderLoginPage = () => (
    <div className={`app-container ${activeTab === 'register' ? 'inverted' : ''}`}>
      {/* Pattern Section - Left for Register, Right for Login */}
      {activeTab === 'register' && (
        <div className="pattern-section">
          <div className="pattern-container"></div>
        </div>
      )}

      {/* Form Section */}
      <div className="login-section">
        {/* Logo - Top Left */}
        <div 
          className="logo-container logo-top-left"
          onClick={() => setCurrentPage('main')}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon">J</div>
          <span className="logo-text">Jejakra.</span>
        </div>
        <div className="login-content">
          {renderFormContent()}
        </div>
      </div>

      {/* Pattern Section - Right for Login, Left for Register */}
      {activeTab === 'login' && (
        <div className="pattern-section">
          <div className="pattern-container"></div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {currentPage === 'main' ? renderMainPage() : renderLoginPage()}
    </>
  )
}

export default App
