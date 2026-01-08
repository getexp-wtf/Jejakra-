/**
 * Authentication Context
 * Provides auth state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getCurrentUser()
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser)
        setIsLoggedIn(true)
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user: loggedInUser } = await authService.login(email, password)
      setUser(loggedInUser)
      setIsLoggedIn(true)
      return loggedInUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user: newUser } = await authService.register(userData)
      setUser(newUser)
      setIsLoggedIn(true)
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setIsLoggedIn(false)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await authService.updateProfile(updates)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

