<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Create an Account</h1>
      <p class="auth-subtitle">Sign up to get started</p>

      <!-- SSO Buttons -->
      <div class="sso-buttons">
        <button @click="handleGoogleSignUp" class="sso-button google-button">
          <svg class="sso-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <button @click="handleGithubSignUp" class="sso-button github-button">
          <svg class="sso-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          GitHub
        </button>
      </div>

      <div class="divider">
        <span>or</span>
      </div>

      <!-- Email Registration Form -->
      <form @submit.prevent="handleEmailSignUp" class="email-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            required
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <!-- Sign In Link -->
      <div class="auth-footer">
        <p>
          Already have an account?
          <RouterLink to="/signin" class="auth-link">Sign In</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isSubmitting = ref(false)

const handleGoogleSignUp = () => {
  // TODO: Implement Google OAuth
  // For now, bypass OAuth and redirect to dashboard
  router.push('/dashboard')
}

const handleGithubSignUp = () => {
  // TODO: Implement GitHub OAuth
  // For now, bypass OAuth and redirect to dashboard
  router.push('/dashboard')
}

const handleEmailSignUp = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  isSubmitting.value = true

  try {
    // TODO: Implement email registration API call
    console.log('Email registration:', form.value)
    // Example API call:
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name: form.value.name,
    //     email: form.value.email,
    //     password: form.value.password
    //   })
    // })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to dashboard after successful registration
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
    alert('Registration failed. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: var(--color-text);
  margin-bottom: 2rem;
  opacity: 0.7;
}

.sso-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.sso-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.sso-button:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sso-button:active {
  transform: translateY(0);
}

.sso-icon {
  flex-shrink: 0;
}

.google-button:hover {
  border-color: #4285f4;
}

.github-button:hover {
  border-color: #24292e;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: var(--color-text);
  opacity: 0.6;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}

.divider span {
  padding: 0 1rem;
  font-size: 0.875rem;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-heading);
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: hsla(160, 100%, 37%, 1);
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
}

.submit-button {
  margin-top: 0.5rem;
  padding: 0.875rem 1rem;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: hsla(160, 100%, 35%, 1);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(52, 211, 153, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.auth-link {
  color: hsla(160, 100%, 37%, 1);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: hsla(160, 100%, 35%, 1);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .sso-buttons {
    flex-direction: column;
  }

  .sso-button {
    width: 100%;
  }
}
</style>
