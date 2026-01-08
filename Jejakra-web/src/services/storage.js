/**
 * Local Storage Service
 * Handles persistent storage for the application
 */

const STORAGE_PREFIX = 'jejakra_'

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @returns {any} Parsed value or null
 */
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Storage getItem error:', error)
    return null
  }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch (error) {
    console.error('Storage setItem error:', error)
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  } catch (error) {
    console.error('Storage removeItem error:', error)
  }
}

/**
 * Clear all app-related items from localStorage
 */
export const clearAll = () => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.error('Storage clearAll error:', error)
  }
}

/**
 * Session Storage helpers
 */
export const session = {
  get: (key) => {
    try {
      const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Session storage get error:', error)
      return null
    }
  },
  set: (key, value) => {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
    } catch (error) {
      console.error('Session storage set error:', error)
    }
  },
  remove: (key) => {
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`)
    } catch (error) {
      console.error('Session storage remove error:', error)
    }
  }
}

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  session
}

