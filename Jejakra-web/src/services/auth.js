/**
 * Authentication Service
 * Handles user authentication and session management
 */

import * as storage from './storage'

const AUTH_TOKEN_KEY = 'auth_token'
const USER_KEY = 'user'

/**
 * Login user with credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  // Mock authentication - replace with actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation
      if (email && password) {
        const user = {
          id: 1,
          email,
          name: 'Dr. Sarah Chen',
          role: 'doctor',
          avatar: null
        }
        const token = 'mock_jwt_token_' + Date.now()
        
        storage.setItem(AUTH_TOKEN_KEY, token)
        storage.setItem(USER_KEY, user)
        
        resolve({ user, token })
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 500)
  })
}

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data and token
 */
export const register = async (userData) => {
  // Mock registration - replace with actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password) {
        const user = {
          id: Date.now(),
          email: userData.email,
          name: userData.name || 'New User',
          role: userData.role || 'user',
          avatar: null
        }
        const token = 'mock_jwt_token_' + Date.now()
        
        storage.setItem(AUTH_TOKEN_KEY, token)
        storage.setItem(USER_KEY, user)
        
        resolve({ user, token })
      } else {
        reject(new Error('Invalid registration data'))
      }
    }, 500)
  })
}

/**
 * Logout current user
 */
export const logout = () => {
  storage.removeItem(AUTH_TOKEN_KEY)
  storage.removeItem(USER_KEY)
}

/**
 * Get current user from storage
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return storage.getItem(USER_KEY)
}

/**
 * Get auth token from storage
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
  return storage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Check if user is authenticated
 * @returns {boolean} Is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken()
}

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated user
 */
export const updateProfile = async (updates) => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error('No user logged in')
  }
  
  const updatedUser = { ...currentUser, ...updates }
  storage.setItem(USER_KEY, updatedUser)
  return updatedUser
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  updateProfile
}

