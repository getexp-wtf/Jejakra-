/**
 * Custom Hook: usePatients
 * Manages patient data, filtering, and states with live API calls
 */

import { useState, useEffect, useCallback } from 'react'
import { patientApi } from '../services/api'

const ITEMS_PER_PAGE = 10

export const usePatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination & filtering state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Fetch patients with optional paging / filtering
  const fetchPatients = useCallback(async (pageNumber = 1, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: pageNumber.toString(), limit: ITEMS_PER_PAGE.toString() })
      if (filters.search) params.set('search', filters.search)
      if (filters.gender && filters.gender !== 'All') params.set('gender', filters.gender)
      if (filters.status && filters.status !== 'All') params.set('status', filters.status)

      const response = await patientApi.getAll(`?${params.toString()}`)

      if (Array.isArray(response)) {
        // If array returned (fallback route), set directly
        setPatients(response)
        setTotalPages(Math.ceil(response.length / ITEMS_PER_PAGE))
        setTotalCount(response.length)
      } else if (response && response.data) {
        // Paginated API format
        setPatients(response.data)
        setTotalPages(response.totalPages || Math.ceil(response.total / response.limit))
        setTotalCount(response.total)
      } else if (Array.isArray(response.results)) {
        // Alternate format
        setPatients(response.results)
        setTotalCount(response.total)
        setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE))
      }
    } catch (err) {
      console.error('Could not fetch patients:', err)
      setError(err.message || 'Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }, [])

  // CRUD helpers — call API endpoints & re-load data
  const addPatient = useCallback(async (patientData) => {
    try {
      await patientApi.create(patientData)
      await fetchPatients(1) // refresh to first page
    } catch (err) {
      console.error('Could not create patient:', err)
      setError(err.message || 'Could not create patient')
      throw err
    }
  }, [fetchPatients])

  const updatePatient = useCallback(async (id, updates) => {
    try {
      await patientApi.update(id, updates)
      setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    } catch (err) {
      console.error('Could not update patient:', err)
      setError(err.message || 'Could not update patient')
      throw err
    }
  }, [])

  const deletePatient = useCallback(async (id) => {
    try {
      await patientApi.delete(id)
      setPatients(prev => prev.filter(p => p.id !== id))
      setTotalCount(prev => prev - 1)
    } catch (err) {
      console.error('Could not delete patient:', err)
      setError(err.message || 'Could not delete patient')
      throw err
    }
  }, [])

  const getPatientById = useCallback(async (id) => {
    try {
      return await patientApi.getById(id)
    } catch (err) {
      console.error('Could not get patient:', err)
      return null
    }
  }, [])

  // Handle search / filter resets
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    setPage(1)
    fetchPatients(1, { search: query, gender: genderFilter, status: statusFilter })
  }, [genderFilter, statusFilter, fetchPatients])

  const handleFilter = useCallback((filters) => {
    if ('gender' in filters) setGenderFilter(filters.gender)
    if ('status' in filters) setStatusFilter(filters.status)
    setPage(1)
    fetchPatients(1, { search: searchQuery, gender: filters.gender || genderFilter, status: filters.status || statusFilter })
  }, [searchQuery, genderFilter, statusFilter, fetchPatients])

  const getAvailableTimeSlots = useCallback(async (patientId, date) => {
    // placeholder if backend ever offers /patients/:id/slots?date=... use it here
    return []
  }, [])

  // Load on mount and when page changes
  useEffect(() => {
    fetchPatients(page, { search: searchQuery, gender: genderFilter, status: statusFilter })
  }, [page, searchQuery, genderFilter, statusFilter, fetchPatients])

  return {
    // Data and meta
    patients,
    loading,
    error,
    totalCount,
    // Pagination
    page,
    totalPages,
    setPage,
    // UI handlers
    searchQuery,
    genderFilter,
    statusFilter,
    handleSearch,
    handleFilter,
    // Actions
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    getAvailableTimeSlots,
  }
}

export default usePatients