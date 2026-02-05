/**
 * Custom Hook: useAppointments
 * Manages appointment data, filtering, and actions with live API calls
 */

import { useState, useMemo, useCallback } from 'react'
import { appointmentApi, patientApi } from '../services/api'
import { formatDate } from '../utils/formatters'

// Available time slots
const TIME_SLOTS = ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '3:00 PM', '4:30 PM']

const ITEMS_PER_PAGE = 5

export const useAppointments = () => {
  // Data & loading states
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination & filtering
  const [todayPage, setTodayPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [totalTodayCount, setTotalTodayCount] = useState(0)
  const [totalUpcomingCount, setTotalUpcomingCount] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterOptions, setFilterOptions] = useState({
    appointmentType: '',
    visitType: ''
  })
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Helpers
  const isToday = (dt) => {
    const t = new Date(dt)
    const n = new Date()
    return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth() && t.getDate() === n.getDate()
  }

  // Fetch both today & upcoming from API
  const fetchAppointments = useCallback(async (date, page = 1, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        date,
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })
      if (filters.appointmentType) params.set('appointmentType', filters.appointmentType)
      if (filters.visitType) params.set('visitType', filters.visitType)

      const data = await appointmentApi.getAll(`?${params.toString()}`)

      if (Array.isArray(data)) {
        // Simple array fallback
        return data
      } else if (data && data.data) {
        // Paginated structure
        return data.data
      }
      return []
    } catch (err) {
      console.error('Appointment fetch error:', err)
      setError(err.message || 'Could not fetch appointments')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch today and upcoming separately
  const loadAppointments = useCallback(async () => {
    const todayStr = (new Date()).toISOString().slice(0,10) // 'YYYY-MM-DD'

    const todayList = await fetchAppointments(todayStr, todayPage, filterOptions)
    const upcomingList = await fetchAppointments('future', upcomingPage, filterOptions)

    setAppointments([...todayList, ...upcomingList])
    setTotalTodayCount(todayList.length)
    setTotalUpcomingCount(upcomingList.length)
  }, [todayPage, upcomingPage, filterOptions, fetchAppointments])

  // CRUD helpers
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      const newAppt = await appointmentApi.create(appointmentData)
      await loadAppointments()
      return newAppt
    } catch (err) {
      setError(err.message || 'Could not create appointment')
      throw err
    }
  }, [loadAppointments])

  const updateAppointment = useCallback(async (id, updates) => {
    try {
      await appointmentApi.update(id, updates)
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
      )
    } catch (err) {
      setError(err.message || 'Could not update appointment')
      throw err
    }
  }, [])

  const deleteAppointment = useCallback(async (id) => {
    try {
      await appointmentApi.delete(id)
      setAppointments(prev => prev.filter(apt => apt.id !== id))
      setTotalTodayCount(prev => prev - 1)
      setTotalUpcomingCount(prev => prev - 1)
    } catch (err) {
      setError(err.message || 'Could not delete appointment')
      throw err
    }
  }, [])

  const updateStatus = useCallback(async (id, newStatus) => {
    await updateAppointment(id, { status: newStatus })
  }, [updateAppointment])

  const getAppointmentById = useCallback((id) => {
    return appointments.find(apt => apt.id === id) || null
  }, [appointments])

  const getAppointmentsByPatientName = useCallback((patientName) => {
    return appointments.filter(apt =>
      apt.patientName && apt.patientName.toLowerCase() === patientName.toLowerCase()
    )
  }, [appointments])

  const getAvailableTimeSlots = useCallback((date) => {
    // If backend offers /appointments/conflicts?date=... use it; otherwise fall back to client-side calc
    const booked = appointments.filter(apt => apt.date === date).map(a => a.time)
    return TIME_SLOTS.filter(slot => !booked.includes(slot))
  }, [appointments])

  return {
    loading,
    error,
    appointments: appointments,
    todayCount: totalTodayCount,
    upcomingCount: totalUpcomingCount,
    todayPage,
    setTodayPage,
    upcomingPage,
    setUpcomingPage,
    searchQuery,
    setSearchQuery (query) {
      setSearchQuery(query)
      setTodayPage(1)
      setUpcomingPage(1)
    },
    filterOptions,
    setFilterOptions (opts) {
      setFilterOptions(opts)
      setTodayPage(1)
      setUpcomingPage(1)
    },
    sortConfig,
    setSortConfig,
    // actions
    loadAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    updateStatus,
    getAppointmentById,
    getAppointmentsByPatientName,
    getAvailableTimeSlots,
  }
}

export default useAppointments