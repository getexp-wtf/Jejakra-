/**
 * Custom Hook: useAppointments
 * Manages appointment data, filtering, and actions
 */

import { useState, useMemo, useCallback } from 'react'
import { formatDate } from '../utils/formatters'

// Initial mock appointment data
const initialAppointments = [
  // Today's appointments
  { id: 1, patientName: 'Ahmad bin Abdullah', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-25', time: '8:00 AM', visitType: 'In-person', status: 'No show', notes: 'NOTE', isToday: true },
  { id: 2, patientName: 'Siti Nurhaliza', appointmentType: 'Follow Up', sessionType: 'INTAKE INTERVIEW', date: '2020-03-25', time: '9:30 AM', visitType: 'Virtual', status: 'Ongoing', notes: '', isToday: true },
  { id: 3, patientName: 'Muhammad Faiz', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-25', time: '11:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: true },
  { id: 4, patientName: 'Aisyah Putri', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-25', time: '12:30 PM', visitType: 'In-person', status: 'Completed', notes: 'NOTE', isToday: true },
  { id: 5, patientName: 'Rizal bin Hassan', appointmentType: 'Follow Up', sessionType: 'FOLLOW UP', date: '2020-03-25', time: '3:00 PM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: true },
  { id: 6, patientName: 'Nadia Tan', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-25', time: '4:30 PM', visitType: 'In-person', status: 'Cancelled', notes: 'NOTE', isToday: true },
  // Upcoming appointments
  { id: 7, patientName: 'Nurul Ain', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-27', time: '8:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
  { id: 8, patientName: 'Amirul Haziq', appointmentType: 'Follow Up', sessionType: 'TREATMENT', date: '2020-03-27', time: '9:30 AM', visitType: 'In-person', status: 'Scheduled', notes: 'NOTE', isToday: false },
  { id: 9, patientName: 'Fatimah Zahra', appointmentType: 'Routine Check-up', sessionType: 'FINAL SESSION', date: '2020-03-27', time: '11:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
  { id: 10, patientName: 'Hafiz Rahman', appointmentType: 'Consultation', sessionType: 'FOLLOW UP', date: '2020-03-27', time: '3:00 PM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
  { id: 11, patientName: 'Sarah Abdullah', appointmentType: 'Follow Up', sessionType: 'TREATMENT', date: '2020-03-28', time: '8:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: 'NOTE', isToday: false },
  { id: 12, patientName: 'Zulkifli bin Omar', appointmentType: 'Consultation', sessionType: 'INTAKE INTERVIEW', date: '2020-03-28', time: '11:00 AM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
  { id: 13, patientName: 'Kartini Salleh', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-28', time: '4:30 PM', visitType: 'Virtual', status: 'Scheduled', notes: 'NOTE', isToday: false },
  { id: 14, patientName: 'Ismail bin Yusof', appointmentType: 'Follow Up', sessionType: 'FOLLOW UP', date: '2020-03-29', time: '8:00 AM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
  { id: 15, patientName: 'Nur Izzati', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-29', time: '9:30 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
]

// Available time slots
const TIME_SLOTS = ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '3:00 PM', '4:30 PM']

export const useAppointments = (itemsPerPage = 5) => {
  // State
  const [appointments, setAppointments] = useState(initialAppointments)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOptions, setFilterOptions] = useState({
    appointmentType: '',
    visitType: ''
  })
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [todayPage, setTodayPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)

  // Separate today and upcoming appointments
  const todayAppointments = useMemo(() => {
    return appointments.filter(apt => apt.isToday)
  }, [appointments])

  const upcomingAppointments = useMemo(() => {
    return appointments.filter(apt => !apt.isToday)
  }, [appointments])

  // Filter appointments based on search and filters
  const filterAppointments = useCallback((appointmentList) => {
    return appointmentList.filter(apt => {
      const matchesSearch = !searchQuery || 
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.status.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = !filterOptions.appointmentType || 
        apt.appointmentType === filterOptions.appointmentType
      
      const matchesVisit = !filterOptions.visitType || 
        apt.visitType === filterOptions.visitType

      return matchesSearch && matchesType && matchesVisit
    })
  }, [searchQuery, filterOptions])

  // Sort appointments
  const sortAppointments = useCallback((appointmentList) => {
    if (!sortConfig.key) return appointmentList

    return [...appointmentList].sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      if (sortConfig.key === 'time') {
        // Convert time to comparable format
        const parseTime = (t) => {
          const [time, period] = t.split(' ')
          let [hours, minutes] = time.split(':').map(Number)
          if (period === 'PM' && hours !== 12) hours += 12
          if (period === 'AM' && hours === 12) hours = 0
          return hours * 60 + minutes
        }
        aVal = parseTime(aVal)
        bVal = parseTime(bVal)
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [sortConfig])

  // Filtered and sorted appointments
  const filteredTodayAppointments = useMemo(() => {
    return sortAppointments(filterAppointments(todayAppointments))
  }, [todayAppointments, filterAppointments, sortAppointments])

  const filteredUpcomingAppointments = useMemo(() => {
    return sortAppointments(filterAppointments(upcomingAppointments))
  }, [upcomingAppointments, filterAppointments, sortAppointments])

  // Pagination
  const paginatedTodayAppointments = useMemo(() => {
    const startIndex = (todayPage - 1) * itemsPerPage
    return filteredTodayAppointments.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTodayAppointments, todayPage, itemsPerPage])

  const paginatedUpcomingAppointments = useMemo(() => {
    const startIndex = (upcomingPage - 1) * itemsPerPage
    return filteredUpcomingAppointments.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUpcomingAppointments, upcomingPage, itemsPerPage])

  const todayTotalPages = Math.ceil(filteredTodayAppointments.length / itemsPerPage)
  const upcomingTotalPages = Math.ceil(filteredUpcomingAppointments.length / itemsPerPage)

  // Actions
  const addAppointment = useCallback((appointmentData) => {
    const newId = Math.max(...appointments.map(a => a.id)) + 1
    setAppointments(prev => [...prev, { ...appointmentData, id: newId }])
    return newId
  }, [appointments])

  const updateAppointment = useCallback((id, updates) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    )
  }, [])

  const deleteAppointment = useCallback((id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id))
  }, [])

  const updateStatus = useCallback((id, newStatus) => {
    updateAppointment(id, { status: newStatus })
  }, [updateAppointment])

  const getAppointmentById = useCallback((id) => {
    return appointments.find(apt => apt.id === id) || null
  }, [appointments])

  const getAppointmentsByPatientName = useCallback((patientName) => {
    return appointments.filter(apt => 
      apt.patientName.toLowerCase() === patientName.toLowerCase()
    )
  }, [appointments])

  // Get available time slots for a given date
  const getAvailableTimeSlots = useCallback((date) => {
    const bookedSlots = appointments
      .filter(apt => apt.date === date)
      .map(apt => apt.time)
    return TIME_SLOTS.filter(slot => !bookedSlots.includes(slot))
  }, [appointments])

  // Handle search with pagination reset
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    setTodayPage(1)
    setUpcomingPage(1)
  }, [])

  // Handle filter with pagination reset
  const handleFilter = useCallback((options) => {
    setFilterOptions(options)
    setTodayPage(1)
    setUpcomingPage(1)
  }, [])

  // Handle sort
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  // Generate CSV data
  const generateCSV = useCallback((appointmentList) => {
    const headers = ['Patient Name', 'Contact Number', 'Appointment Type', 'Date', 'Time', 'Visit Type', 'Status']
    const rows = appointmentList.map(apt => [
      apt.patientName,
      apt.contactNumber || 'N/A',
      apt.appointmentType,
      apt.date,
      apt.time,
      apt.visitType,
      apt.status
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
    
    return csvContent
  }, [])

  return {
    // Data
    todayAppointments: paginatedTodayAppointments,
    upcomingAppointments: paginatedUpcomingAppointments,
    allTodayAppointments: filteredTodayAppointments,
    allUpcomingAppointments: filteredUpcomingAppointments,
    allAppointments: appointments,
    
    // Pagination - Today
    todayPage,
    todayTotalPages,
    todayCount: filteredTodayAppointments.length,
    setTodayPage,
    
    // Pagination - Upcoming
    upcomingPage,
    upcomingTotalPages,
    upcomingCount: filteredUpcomingAppointments.length,
    setUpcomingPage,
    
    // Filters & Sort
    searchQuery,
    filterOptions,
    sortConfig,
    setSearchQuery: handleSearch,
    setFilterOptions: handleFilter,
    handleSort,
    
    // Actions
    addAppointment,
    updateAppointment,
    deleteAppointment,
    updateStatus,
    getAppointmentById,
    getAppointmentsByPatientName,
    getAvailableTimeSlots,
    generateCSV,
    
    // Constants
    timeSlots: TIME_SLOTS,
  }
}

export default useAppointments

