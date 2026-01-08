/**
 * App.jsx - Refactored Example
 * 
 * This file demonstrates how to use the new modular architecture.
 * The original App.jsx can be gradually migrated to this structure.
 */

import { useState, useCallback } from 'react'
import './App.css'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'

// Hooks
import { usePatients, useAppointments } from './hooks'

// Components
import { 
  // Shared
  Modal, 
  Pagination, 
  SearchInput,
  
  // Dashboard
  Sidebar, 
  DashboardHeader, 
  StatCard,
  
  // Patients
  PatientsTable, 
  PatientViewModal, 
  AppointmentHistoryModal,
  
  // Appointments
  AppointmentsTable, 
  AppointmentModal 
} from './components'

// Utils
import { formatDate, formatPatientId } from './utils'

// Constants
const ITEMS_PER_PAGE = 5
const PATIENTS_PER_PAGE = 10

/**
 * Main Dashboard Component
 * Uses hooks and components from the modular architecture
 */
const Dashboard = () => {
  // Navigation state
  const [dashboardView, setDashboardView] = useState('home')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Auth
  const { logout } = useAuth()
  
  // Patients hook
  const {
    patients,
    filteredPatients,
    currentPage: patientsPage,
    totalPages: patientsTotalPages,
    searchQuery: patientSearch,
    setSearchQuery: setPatientSearch,
    setCurrentPage: setPatientsPage,
    selectedPatient,
    setSelectedPatient,
    deletePatient
  } = usePatients(PATIENTS_PER_PAGE)
  
  // Appointments hook
  const {
    todayAppointments,
    upcomingAppointments,
    todayPage,
    upcomingPage,
    todayTotalPages,
    upcomingTotalPages,
    setTodayPage,
    setUpcomingPage,
    searchQuery: appointmentSearch,
    setSearchQuery: setAppointmentSearch,
    updateStatus
  } = useAppointments(ITEMS_PER_PAGE)
  
  // Modal states
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showAppointmentHistoryModal, setShowAppointmentHistoryModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  
  // Handlers
  const handleViewPatient = useCallback((patient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }, [setSelectedPatient])
  
  const handleViewAppointments = useCallback((patient) => {
    setSelectedPatient(patient)
    setShowAppointmentHistoryModal(true)
  }, [setSelectedPatient])
  
  const handleDeletePatient = useCallback((patient) => {
    if (window.confirm(`Delete patient ${patient.name}?`)) {
      deletePatient(patient.id)
    }
  }, [deletePatient])

  // Render based on current view
  const renderContent = () => {
    switch(dashboardView) {
      case 'home':
        return <DashboardHome />
      case 'appointment':
        return (
          <AppointmentsView 
            todayAppointments={todayAppointments}
            upcomingAppointments={upcomingAppointments}
            todayPage={todayPage}
            upcomingPage={upcomingPage}
            todayTotalPages={todayTotalPages}
            upcomingTotalPages={upcomingTotalPages}
            setTodayPage={setTodayPage}
            setUpcomingPage={setUpcomingPage}
            searchQuery={appointmentSearch}
            onSearchChange={setAppointmentSearch}
            onStatusChange={updateStatus}
          />
        )
      case 'patients':
        return (
          <PatientsView 
            patients={patients}
            currentPage={patientsPage}
            totalPages={patientsTotalPages}
            totalCount={filteredPatients.length}
            searchQuery={patientSearch}
            onSearchChange={setPatientSearch}
            onPageChange={setPatientsPage}
            onView={handleViewPatient}
            onViewAppointments={handleViewAppointments}
            onDelete={handleDeletePatient}
          />
        )
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar 
        currentView={dashboardView}
        onViewChange={setDashboardView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={logout}
      />
      
      <main className="dashboard-main">
        <DashboardHeader 
          userName="Dr. Sarah Chen"
          userRole="Administrator"
        />
        
        {renderContent()}
      </main>
      
      {/* Modals */}
      <PatientViewModal 
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        patient={selectedPatient}
      />
      
      <AppointmentHistoryModal 
        isOpen={showAppointmentHistoryModal}
        onClose={() => setShowAppointmentHistoryModal(false)}
        patient={selectedPatient}
        appointments={[...todayAppointments, ...upcomingAppointments]}
      />
      
      <AppointmentModal 
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />
    </div>
  )
}

// Sub-components for different views
const DashboardHome = () => (
  <div className="dashboard-page-container">
    <h1>Dashboard</h1>
    <div className="dashboard-stats-grid">
      <StatCard title="Total Patients" value="156" />
      <StatCard title="Appointments Today" value="12" />
      <StatCard title="Pending" value="5" />
      <StatCard title="Completed" value="7" />
    </div>
  </div>
)

const AppointmentsView = ({ 
  todayAppointments, 
  upcomingAppointments,
  todayPage,
  upcomingPage,
  todayTotalPages,
  upcomingTotalPages,
  setTodayPage,
  setUpcomingPage,
  searchQuery,
  onSearchChange,
  onStatusChange
}) => (
  <div className="appointment-page-container">
    <div className="appointment-top-bar">
      <SearchInput 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by patient name, time, or status"
      />
    </div>
    
    <section className="appointment-section">
      <div className="appointment-section-header">
        <h2>Today's Appointments ({todayAppointments.length})</h2>
      </div>
      <AppointmentsTable 
        appointments={todayAppointments}
        onStatusChange={onStatusChange}
      />
      <Pagination 
        currentPage={todayPage}
        totalPages={todayTotalPages}
        onPageChange={setTodayPage}
      />
    </section>
    
    <section className="appointment-section">
      <div className="appointment-section-header">
        <h2>Upcoming Appointments ({upcomingAppointments.length})</h2>
      </div>
      <AppointmentsTable 
        appointments={upcomingAppointments}
        showDateColumn
        onStatusChange={onStatusChange}
      />
      <Pagination 
        currentPage={upcomingPage}
        totalPages={upcomingTotalPages}
        onPageChange={setUpcomingPage}
      />
    </section>
  </div>
)

const PatientsView = ({ 
  patients, 
  currentPage, 
  totalPages, 
  totalCount,
  searchQuery,
  onSearchChange,
  onPageChange,
  onView,
  onViewAppointments,
  onDelete
}) => (
  <div className="patients-page-container">
    <div className="patients-top-bar">
      <SearchInput 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by name, ID, or status"
      />
    </div>
    
    <section className="patients-section">
      <div className="patients-section-header">
        <h2>Patients ({totalCount})</h2>
      </div>
      <PatientsTable 
        patients={patients}
        onView={onView}
        onAppointments={onViewAppointments}
        onDelete={onDelete}
      />
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  </div>
)

/**
 * Root App Component
 * Wraps everything with providers
 */
function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}

export default App

