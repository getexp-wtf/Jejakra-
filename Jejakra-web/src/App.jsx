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
  
  // BMI Calculator states
  const [height, setHeight] = useState('170')
  const [weight, setWeight] = useState('70')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [unitSystem, setUnitSystem] = useState('metric') // 'metric' or 'us'
  const [bmiCalculated, setBmiCalculated] = useState(false)
  const [bmiResult, setBmiResult] = useState(null)
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    height: '',
    weight: '',
    age: ''
  })

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

  // Validation functions
  const validateInput = (name, value) => {
    const numValue = parseFloat(value)
    let error = ''
    
    if (value === '' || value === null || value === undefined) {
      return error // Empty is okay, show error only on blur or submit
    }
    
    if (isNaN(numValue) || numValue <= 0) {
      error = `Please enter a valid ${name}`
      return error
    }
    
    if (name === 'height') {
      if (unitSystem === 'metric') {
        if (numValue < 50 || numValue > 250) error = 'Height should be between 50-250 cm'
      } else {
        if (numValue < 20 || numValue > 120) error = 'Height should be between 20-120 inches'
      }
    } else if (name === 'weight') {
      if (unitSystem === 'metric') {
        if (numValue < 20 || numValue > 300) error = 'Weight should be between 20-300 kg'
      } else {
        if (numValue < 44 || numValue > 660) error = 'Weight should be between 44-660 lbs'
      }
    } else if (name === 'age') {
      if (numValue < 10 || numValue > 120) error = 'Age should be between 10-120 years'
    }
    
    return error
  }

  const handleInputChange = (name, value) => {
    // Update the value
    if (name === 'height') setHeight(value)
    else if (name === 'weight') setWeight(value)
    else if (name === 'age') setAge(value)
    
    // Validate in real-time
    const error = validateInput(name, value)
    setValidationErrors(prev => ({ ...prev, [name]: error }))
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { 
      name: 'Underweight', 
      color: '#60a5fa', 
      bgColor: '#dbeafe',
      message: 'Consider consulting with a healthcare provider about healthy weight gain strategies.'
    }
    else if (bmi < 25) return { 
      name: 'Normal', 
      color: '#81A388', 
      bgColor: '#e8f0ea',
      message: 'Great! You\'re within a healthy weight range. Keep up the good work!'
    }
    else if (bmi < 30) return { 
      name: 'Overweight', 
      color: '#facc15', 
      bgColor: '#fef9c3',
      message: 'Consider adopting a balanced diet and regular exercise routine.'
    }
    else return { 
      name: 'Obese', 
      color: '#EF908B', 
      bgColor: '#fdedec',
      message: 'Consult with a healthcare provider about a personalized weight management plan.'
    }
  }

  const calculateIdealWeightRange = (heightCm) => {
    const heightM = heightCm / 100
    const minBMI = 18.5
    const maxBMI = 24.9
    const minWeight = (minBMI * heightM * heightM).toFixed(1)
    const maxWeight = (maxBMI * heightM * heightM).toFixed(1)
    return { min: minWeight, max: maxWeight }
  }

  const getBMIGaugeAngle = (bmi) => {
    // Semi-circle gauge: 0-40 BMI maps to 0-180 degrees
    // Normal range is roughly in the middle (18.5-24.9)
    const clampedBMI = Math.min(Math.max(bmi, 0), 40)
    // Map BMI to angle: 0 BMI = 0°, 40 BMI = 180°
    // Convert to rotation: 0° = left, 90° = center, 180° = right
    return (clampedBMI / 40) * 180
  }

  const getBMIPosition = (bmi) => {
    // BMI ranges mapped to flex values:
    // Underweight: 0-18.5 (flex: 18.5)
    // Normal: 18.5-24.9 (flex: 6.4)
    // Overweight: 25-29.9 (flex: 4.9)
    // Obese: 30-40 (flex: 10)
    // Total flex: 18.5 + 6.4 + 4.9 + 10 = 39.8
    
    const totalFlex = 39.8;
    let position = 0;
    
    if (bmi < 18.5) {
      // Underweight: 0-18.5, flex = 18.5
      position = (bmi / 18.5) * (18.5 / totalFlex) * 100;
    } else if (bmi < 25) {
      // Normal: 18.5-24.9, flex = 6.4
      const underweightFlex = 18.5 / totalFlex * 100;
      const normalRatio = (bmi - 18.5) / 6.4;
      position = underweightFlex + (normalRatio * (6.4 / totalFlex) * 100);
    } else if (bmi < 30) {
      // Overweight: 25-29.9, flex = 4.9
      const underweightFlex = 18.5 / totalFlex * 100;
      const normalFlex = 6.4 / totalFlex * 100;
      const overweightRatio = (bmi - 25) / 4.9;
      position = underweightFlex + normalFlex + (overweightRatio * (4.9 / totalFlex) * 100);
    } else {
      // Obese: 30-40, flex = 10
      const underweightFlex = 18.5 / totalFlex * 100;
      const normalFlex = 6.4 / totalFlex * 100;
      const overweightFlex = 4.9 / totalFlex * 100;
      const obeseRatio = Math.min((bmi - 30) / 10, 1); // Cap at BMI 40
      position = underweightFlex + normalFlex + overweightFlex + (obeseRatio * (10 / totalFlex) * 100);
    }
    
    return Math.min(position, 98); // Cap at 98% to keep indicator visible
  }

  const adjustValue = (name, increment) => {
    const currentValue = name === 'weight' ? weight : name === 'height' ? height : age
    const numValue = parseFloat(currentValue) || 0
    const step = name === 'age' ? 1 : 0.1
    const newValue = Math.max(0, numValue + (increment ? step : -step))
    
    if (name === 'weight') {
      const min = unitSystem === 'metric' ? 20 : 44
      const max = unitSystem === 'metric' ? 300 : 660
      const constrainedValue = Math.min(max, Math.max(min, newValue))
      handleInputChange('weight', constrainedValue.toFixed(1))
    } else if (name === 'height') {
      const min = unitSystem === 'metric' ? 50 : 20
      const max = unitSystem === 'metric' ? 250 : 120
      const constrainedValue = Math.min(max, Math.max(min, newValue))
      handleInputChange('height', constrainedValue.toFixed(1))
    } else if (name === 'age') {
      const constrainedValue = Math.min(120, Math.max(10, newValue))
      handleInputChange('age', Math.round(constrainedValue))
    }
  }

  const calculateBMI = () => {
    // Validate all inputs
    const heightError = validateInput('height', height)
    const weightError = validateInput('weight', weight)
    const ageError = age ? validateInput('age', age) : ''
    
    setValidationErrors({
      height: heightError,
      weight: weightError,
      age: ageError
    })
    
    if (heightError || weightError || ageError) {
      return
    }
    
    const h = parseFloat(height)
    const w = parseFloat(weight)
    
    if (!h || !w || h <= 0 || w <= 0) {
      return
    }

    // Show loading state
    setIsCalculating(true)
    setBmiResult(null)

    // Simulate calculation delay for animation
    setTimeout(() => {
      let bmi
      if (unitSystem === 'metric') {
        // Metric: weight in kg, height in cm
        bmi = (w / ((h / 100) ** 2)).toFixed(1)
      } else {
        // US: weight in lbs, height in inches
        bmi = ((w / (h ** 2)) * 703).toFixed(1)
      }

      const categoryInfo = getBMICategory(parseFloat(bmi))
      const idealRange = unitSystem === 'metric' 
        ? calculateIdealWeightRange(parseFloat(height))
        : (() => {
            const heightCm = parseFloat(height) * 2.54
            const range = calculateIdealWeightRange(heightCm)
            return { 
              min: (parseFloat(range.min) / 2.20462).toFixed(1), 
              max: (parseFloat(range.max) / 2.20462).toFixed(1) 
            }
          })()
      
      // Add transition effect
      setIsTransitioning(true)
      setTimeout(() => {
        setBmiResult({ 
          bmi, 
          category: categoryInfo.name, 
          ...categoryInfo,
          idealRange
        })
        setBmiCalculated(true)
        setIsCalculating(false)
        setIsTransitioning(false)
      }, 300)
    }, 600)
  }

  const clearBMI = () => {
    setHeight('170')
    setWeight('70')
    setAge('')
    setGender('male')
    setBmiCalculated(false)
    setBmiResult(null)
    setIsCalculating(false)
    setValidationErrors({ height: '', weight: '', age: '' })
  }

  const handleEdit = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setBmiCalculated(false)
      setBmiResult(null)
      setIsTransitioning(false)
    }, 300)
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
      <section className={`hero-section ${bmiCalculated ? 'hero-section-result' : ''}`}>
        <div className={`hero-grid ${bmiCalculated ? 'hero-grid-result' : ''}`}>
          {/* LEFT COLUMN */}
          {!bmiCalculated && (
            <div className="hero-copy">
              <h1 className="hero-title">Understand your body,<br/><span>one habit at a time.</span></h1>
              <p className="hero-subtitle">
                Every data point tells a story. Track your body metrics, reflect on patterns, and make informed health decisions—at your own pace.
              </p>
            </div>
          )}

          {/* RIGHT COLUMN - CARD */}
          <div className={`hero-card ${isTransitioning ? 'transitioning' : ''} ${bmiCalculated ? 'hero-card-result' : ''}`}>
            {!bmiCalculated ? (
              <>
                {/* Unit Toggle */}
                <div className="unit-toggle-container">
                  <span className={unitSystem === 'metric' ? 'unit-active' : 'unit-inactive'}>Metric</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={unitSystem === 'us'}
                      onChange={(e) => setUnitSystem(e.target.checked ? 'us' : 'metric')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className={unitSystem === 'us' ? 'unit-active' : 'unit-inactive'}>US</span>
                </div>

                <div className="hero-card-title-container">
                  <h2 className="hero-card-title">
                    Body Metrics Overview
                    <div className="formula-tooltip-container">
                      <button
                        type="button"
                        className="formula-tooltip-trigger"
                        onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                        onMouseEnter={() => setShowFormulaTooltip(true)}
                        onMouseLeave={() => setShowFormulaTooltip(false)}
                        onBlur={() => setTimeout(() => setShowFormulaTooltip(false), 200)}
                        aria-label="How is BMI calculated?"
                      >
                        ?
                      </button>
                      {showFormulaTooltip && (
                        <div className="formula-tooltip" onClick={(e) => e.stopPropagation()}>
                          <p className="tooltip-description">
                            BMI (Body Mass Index) is a measure of body fat based on height and weight. It's a useful indicator of overall health, though it doesn't account for muscle mass or body composition.
                          </p>
                          <strong>BMI Formula:</strong>
                          <p className="formula-main">BMI = weight(kg) / height(m)²</p>
                          <p className="formula-example">Metric: weight (kg) ÷ height (m)²</p>
                          <p className="formula-example">US: (weight (lbs) ÷ height (in)²) × 703</p>
                          <div className="tooltip-categories">
                            <p className="tooltip-category-title">Category Ranges:</p>
                            <ul className="tooltip-category-list">
                              <li><span className="category-color" style={{ backgroundColor: '#60a5fa' }}></span> Underweight: &lt;18.5</li>
                              <li><span className="category-color" style={{ backgroundColor: '#81A388' }}></span> Normal: 18.5-24.9</li>
                              <li><span className="category-color" style={{ backgroundColor: '#facc15' }}></span> Overweight: 25-29.9</li>
                              <li><span className="category-color" style={{ backgroundColor: '#EF908B' }}></span> Obese: ≥30</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </h2>
                </div>

                <p className="bmi-intro-text">
                  Take a moment to understand your body measurements. Jejakra helps you track trends over time and supports informed conversations about your health.
                </p>

                <div className="bmi-form-layout">
                  <div className="form-column form-column-left">
                    <div className="form-group form-group-item">
                      <label htmlFor="hero-weight">Weight</label>
                      <div className="input-with-addon">
                        <input 
                          type="number" 
                          id="hero-weight" 
                          placeholder=""
                          value={weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          onBlur={(e) => {
                            const error = validateInput('weight', e.target.value)
                            setValidationErrors(prev => ({ ...prev, weight: error }))
                          }}
                          min={unitSystem === 'metric' ? 20 : 44}
                          max={unitSystem === 'metric' ? 300 : 660}
                          step="0.1"
                          className={validationErrors.weight ? 'input-error' : ''}
                        />
                        <span className="input-addon">
                          {unitSystem === 'metric' ? 'KG' : 'LBS'}
                        </span>
                      </div>
                      {validationErrors.weight && (
                        <span className="validation-error">{validationErrors.weight}</span>
                      )}
                    </div>

                    <div className="form-group form-group-item">
                      <label>Gender</label>
                      <div className="gender-buttons">
                        <button
                          type="button"
                          className={`gender-button ${gender === 'male' ? 'active' : ''}`}
                          onClick={() => setGender('male')}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`gender-button ${gender === 'female' ? 'active' : ''}`}
                          onClick={() => setGender('female')}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-column form-column-right">
                    <div className="form-group form-group-item">
                      <label htmlFor="hero-height">Height</label>
                      <div className="input-with-addon">
                        <input 
                          type="number" 
                          id="hero-height" 
                          placeholder=""
                          value={height}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          onBlur={(e) => {
                            const error = validateInput('height', e.target.value)
                            setValidationErrors(prev => ({ ...prev, height: error }))
                          }}
                          min={unitSystem === 'metric' ? 50 : 20}
                          max={unitSystem === 'metric' ? 250 : 120}
                          step="0.1"
                          className={validationErrors.height ? 'input-error' : ''}
                        />
                        <span className="input-addon">
                          {unitSystem === 'metric' ? 'CM' : 'IN'}
                        </span>
                      </div>
                      {validationErrors.height && (
                        <span className="validation-error">{validationErrors.height}</span>
                      )}
                    </div>

                    <div className="form-group form-group-item">
                      <label htmlFor="hero-age">Age (optional)</label>
                      <div className="input-with-addon">
                        <input 
                          type="number" 
                          id="hero-age" 
                          placeholder="e.g., 25"
                          value={age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          onBlur={(e) => {
                            const error = validateInput('age', e.target.value)
                            setValidationErrors(prev => ({ ...prev, age: error }))
                          }}
                          min="10"
                          max="120"
                          step="1"
                          className={`age-input ${validationErrors.age ? 'input-error' : ''}`}
                        />
                      </div>
                      {validationErrors.age && (
                        <span className="validation-error">{validationErrors.age}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="button-group">
                  <button 
                    className={`hero-card-button hero-card-button-primary calculate-button ${isCalculating ? 'calculating' : ''}`}
                    onClick={calculateBMI}
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <span className="button-spinner"></span>
                        Calculating...
                      </>
                    ) : (
                      'Calculate BMI'
                    )}
                  </button>
                  <button 
                    className="hero-card-button hero-card-button-secondary"
                    onClick={clearBMI}
                    disabled={isCalculating}
                  >
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <div className="bmi-result-card-sleek animated-result">
                {/* Hero BMI Display */}
                <div className="bmi-hero-section" style={{ background: `linear-gradient(135deg, ${bmiResult.bgColor}22, ${bmiResult.bgColor}08)`, borderColor: `${bmiResult.color}30` }}>
                  <div className="bmi-hero-content">
                    <div className="bmi-hero-label">Your Body Mass Index</div>
                    <div className="bmi-hero-value" style={{ color: bmiResult.color }}>
                      {bmiResult.bmi}
                    </div>
                    <div className="bmi-hero-category" style={{ color: bmiResult.color }}>
                      {bmiResult.category}
                    </div>
                  </div>
                  <div className="bmi-hero-icon" style={{ background: `${bmiResult.bgColor}40` }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: bmiResult.color }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                {/* Health Message */}
                <div className="bmi-message-card" style={{ borderColor: `${bmiResult.color}40`, background: `${bmiResult.bgColor}15` }}>
                  <p className="bmi-message-text" style={{ color: bmiResult.color }}>{bmiResult.message}</p>
                </div>

                {/* Summary Stats Grid */}
                <div className="bmi-stats-section">
                  <h3 className="bmi-stats-title">Your Information</h3>
                  <div className="bmi-stats-grid">
                  <div className="bmi-stat-card">
                    <div className="bmi-stat-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                    </div>
                    <div className="bmi-stat-info">
                      <div className="bmi-stat-label">Weight</div>
                      <div className="bmi-stat-value">{weight} {unitSystem === 'metric' ? 'kg' : 'lbs'}</div>
                    </div>
                  </div>
                  <div className="bmi-stat-card">
                    <div className="bmi-stat-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div className="bmi-stat-info">
                      <div className="bmi-stat-label">Height</div>
                      <div className="bmi-stat-value">{height} {unitSystem === 'metric' ? 'cm' : 'in'}</div>
                    </div>
                  </div>
                  <div className="bmi-stat-card">
                    <div className="bmi-stat-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="bmi-stat-info">
                      <div className="bmi-stat-label">Gender</div>
                      <div className="bmi-stat-value">{gender.charAt(0).toUpperCase() + gender.slice(1)}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* BMI Scale Visualization */}
                <div className="bmi-scale-section">
                  <div className="bmi-scale-header">
                    <span className="bmi-scale-title">BMI Scale</span>
                    <span className="bmi-scale-value">Your BMI: {bmiResult.bmi}</span>
                  </div>
                  <div className="bmi-scale-bar">
                    <div className="bmi-scale-segments">
                      <div className="bmi-scale-segment bmi-scale-under" title="Underweight (<18.5)"></div>
                      <div className="bmi-scale-segment bmi-scale-normal" title="Normal (18.5-24.9)"></div>
                      <div className="bmi-scale-segment bmi-scale-over" title="Overweight (25-29.9)"></div>
                      <div className="bmi-scale-segment bmi-scale-obese" title="Obese (≥30)"></div>
                    </div>
                    <div 
                      className="bmi-scale-indicator" 
                      style={{ 
                        left: `${getBMIPosition(parseFloat(bmiResult.bmi))}%`,
                        backgroundColor: bmiResult.color
                      }}
                    >
                      <div className="bmi-indicator-dot"></div>
                      <div className="bmi-indicator-line"></div>
                    </div>
                  </div>
                  <div className="bmi-scale-labels">
                    <span>0</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bmi-action-buttons">
                  <button 
                    className="bmi-action-btn bmi-action-primary"
                    onClick={handleEdit}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Recalculate
                  </button>
                  <button 
                    className="bmi-action-btn bmi-action-secondary"
                    onClick={() => setCurrentPage('login')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    Read More
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Jejakra</h3>
            <p className="footer-text">Understand your body,one habit at a time</p>
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

