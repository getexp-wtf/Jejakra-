/**
 * Custom Hook: usePatients
 * Manages patient data, filtering, and actions
 */

import { useState, useMemo, useCallback } from 'react'
import { formatDate } from '../utils/formatters'

// Initial mock patient data
const initialPatientsData = {
  1: { name: 'Ahmad bin Abdullah', gender: 'Male', age: '45', address: 'No. 12, Jalan Ampang, 50450 Kuala Lumpur', registeredDate: '2020-01-15', lastVisit: '2024-01-08', lastVisitTime: '10:30 AM', nextAppointment: '2024-02-15', disease: 'Hypertension', contactNumber: '012-345-6701', status: 'Active' },
  2: { name: 'Siti Nurhaliza', gender: 'Female', age: '38', address: 'No. 45, Taman Tun Dr Ismail, 60000 Kuala Lumpur', registeredDate: '2019-11-20', lastVisit: '2024-01-05', lastVisitTime: '2:00 PM', nextAppointment: '2024-02-10', disease: 'Diabetes Type 2', contactNumber: '012-345-6702', status: 'Active' },
  3: { name: 'Muhammad Faiz', gender: 'Male', age: '52', address: 'No. 78, Bangsar South, 59200 Kuala Lumpur', registeredDate: '2020-02-10', lastVisit: '2024-01-02', lastVisitTime: '9:00 AM', nextAppointment: '2024-02-20', disease: 'Anxiety Disorder', contactNumber: '012-345-6703', status: 'Active' },
  4: { name: 'Nurul Ain', gender: 'Female', age: '34', address: 'No. 23, Jalan SS2/55, 47300 Petaling Jaya, Selangor', registeredDate: '2019-12-05', lastVisit: '2023-08-15', lastVisitTime: '11:30 AM', nextAppointment: null, disease: 'Chronic Pain', contactNumber: '012-345-6704', status: 'Inactive' },
  5: { name: 'Amirul Haziq', gender: 'Male', age: '29', address: 'No. 56, Seksyen 7, 40000 Shah Alam, Selangor', registeredDate: '2020-03-01', lastVisit: '2024-01-06', lastVisitTime: '3:30 PM', nextAppointment: '2024-02-08', disease: 'Asthma', contactNumber: '012-345-6705', status: 'Active' },
  6: { name: 'Fatimah Zahra', gender: 'Female', age: '41', address: 'No. 89, USJ 1, 47600 Subang Jaya, Selangor', registeredDate: '2019-10-12', lastVisit: null, lastVisitTime: null, nextAppointment: '2024-02-12', disease: 'Migraine', contactNumber: '012-345-6706', status: 'New' },
  7: { name: 'Hafiz Rahman', gender: 'Male', age: '36', address: 'No. 34, Taman Molek, 81100 Johor Bahru, Johor', registeredDate: '2020-01-25', lastVisit: '2024-01-03', lastVisitTime: '4:00 PM', nextAppointment: '2024-02-18', disease: 'Arthritis', contactNumber: '012-345-6707', status: 'Active' },
  8: { name: 'Aisyah Putri', gender: 'Female', age: '42', address: 'No. 67, Jalan Penang, 10050 George Town, Penang', registeredDate: '2019-09-18', lastVisit: null, lastVisitTime: null, nextAppointment: null, disease: 'Gastritis', contactNumber: '012-345-6708', status: 'Pending' },
  9: { name: 'Rizal bin Hassan', gender: 'Male', age: '39', address: 'No. 90, Jalan Ipoh, 51200 Kuala Lumpur', registeredDate: '2020-02-28', lastVisit: '2024-01-07', lastVisitTime: '10:00 AM', nextAppointment: '2024-02-25', disease: 'Insomnia', contactNumber: '012-345-6709', status: 'Active' },
  10: { name: 'Nadia Tan', gender: 'Female', age: '48', address: 'No. 15, Damansara Heights, 50490 Kuala Lumpur', registeredDate: '2019-08-22', lastVisit: '2023-06-20', lastVisitTime: '1:30 PM', nextAppointment: null, disease: 'Obesity', contactNumber: '012-345-6710', status: 'Inactive' },
  11: { name: 'Kelvin Wong', gender: 'Male', age: '55', address: 'No. 28, Bukit Bintang, 55100 Kuala Lumpur', registeredDate: '2019-07-14', lastVisit: '2024-01-04', lastVisitTime: '11:00 AM', nextAppointment: '2024-02-22', disease: 'Heart Disease', contactNumber: '012-345-6711', status: 'Active' },
  12: { name: 'Michelle Lee', gender: 'Female', age: '50', address: 'No. 41, Mont Kiara, 50480 Kuala Lumpur', registeredDate: '2020-01-08', lastVisit: '2022-12-10', lastVisitTime: '9:30 AM', nextAppointment: null, disease: 'Fibromyalgia', contactNumber: '012-345-6712', status: 'Archived' },
  13: { name: 'Priya Kumari', gender: 'Female', age: '40', address: 'No. 54, Brickfields, 50470 Kuala Lumpur', registeredDate: '2019-06-30', lastVisit: '2024-01-01', lastVisitTime: '2:30 PM', nextAppointment: '2024-02-05', disease: 'Allergies', contactNumber: '012-345-6713', status: 'Active' },
  14: { name: 'Ravi Kumar', gender: 'Male', age: '31', address: 'No. 77, Klang, 41150 Selangor', registeredDate: '2020-03-10', lastVisit: null, lastVisitTime: null, nextAppointment: '2024-02-14', disease: 'GERD', contactNumber: '012-345-6714', status: 'New' },
  15: { name: 'Sarah Abdullah', gender: 'Female', age: '33', address: 'No. 100, Cyberjaya, 63000 Selangor', registeredDate: '2019-11-05', lastVisit: '2023-12-28', lastVisitTime: '4:30 PM', nextAppointment: '2024-02-28', disease: 'Stress Disorder', contactNumber: '012-345-6715', status: 'Active' }
}

export const usePatients = (itemsPerPage = 10) => {
  // State
  const [patients, setPatients] = useState(initialPatientsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Convert patients object to array with IDs
  const patientsArray = useMemo(() => {
    return Object.entries(patients).map(([id, patient]) => ({
      id: parseInt(id),
      ...patient
    }))
  }, [patients])

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    return patientsArray.filter(patient => {
      const matchesSearch = !searchQuery || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `P-${String(patient.id).padStart(4, '0')}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.status.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesGender = genderFilter === 'All' || patient.gender === genderFilter
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter

      return matchesSearch && matchesGender && matchesStatus
    })
  }, [patientsArray, searchQuery, genderFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPatients.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPatients, currentPage, itemsPerPage])

  // Actions
  const addPatient = useCallback((patientData) => {
    const newId = Math.max(...Object.keys(patients).map(Number)) + 1
    setPatients(prev => ({
      ...prev,
      [newId]: patientData
    }))
    return newId
  }, [patients])

  const updatePatient = useCallback((id, updates) => {
    setPatients(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }))
  }, [])

  const deletePatient = useCallback((id) => {
    setPatients(prev => {
      const { [id]: removed, ...rest } = prev
      return rest
    })
  }, [])

  const getPatientById = useCallback((id) => {
    return patients[id] ? { id: parseInt(id), ...patients[id] } : null
  }, [patients])

  // Reset pagination when filters change
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleGenderFilter = useCallback((gender) => {
    setGenderFilter(gender)
    setCurrentPage(1)
  }, [])

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }, [])

  return {
    // Data
    patients: paginatedPatients,
    allPatients: patientsArray,
    filteredPatients,
    selectedPatient,
    
    // Pagination
    currentPage,
    totalPages,
    totalCount: filteredPatients.length,
    setCurrentPage,
    
    // Filters
    searchQuery,
    genderFilter,
    statusFilter,
    setSearchQuery: handleSearch,
    setGenderFilter: handleGenderFilter,
    setStatusFilter: handleStatusFilter,
    
    // Actions
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    setSelectedPatient,
  }
}

export default usePatients

