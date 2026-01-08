/**
 * Patients Table Component
 * Displays the list of patients in a table format
 */

import React from 'react'
import { formatDate } from '../../utils/formatters'

// Icons
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
)

const PatientsTable = ({ 
  patients, 
  onView, 
  onAppointments, 
  onDelete 
}) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'Active': 'patient-status-active',
      'Inactive': 'patient-status-inactive',
      'New': 'patient-status-new',
      'Archived': 'patient-status-archived',
      'Pending': 'patient-status-pending'
    }
    return statusMap[status] || ''
  }

  const formatPatientId = (id) => `P-${String(id).padStart(4, '0')}`

  const renderLastVisit = (patient) => {
    if (!patient.lastVisit) {
      return <span className="patients-no-visit">No visits yet</span>
    }
    return (
      <span className="patients-visit-datetime">
        <span>{formatDate(patient.lastVisit)}</span>
        {patient.lastVisitTime && <span>{patient.lastVisitTime}</span>}
      </span>
    )
  }

  const renderNextAppointment = (patient) => {
    if (!patient.nextAppointment) {
      return <span className="patients-no-visit">No upcoming appointment</span>
    }
    return formatDate(patient.nextAppointment)
  }

  return (
    <div className="patients-table-container">
      <table className="patients-data-table">
        <thead>
          <tr>
            <th className="patients-th-id">Patient ID</th>
            <th className="patients-th-patient">Patient Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Last Visit</th>
            <th>Next Appointment</th>
            <th>Status</th>
            <th>Registered</th>
            <th className="patients-th-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td className="patients-td-id">{formatPatientId(patient.id)}</td>
              <td className="patients-td-name">{patient.name}</td>
              <td>{patient.age}</td>
              <td className="patients-td-gender">{patient.gender}</td>
              <td className="patients-td-lastvisit">{renderLastVisit(patient)}</td>
              <td className="patients-td-nextappt">{renderNextAppointment(patient)}</td>
              <td>
                <span className={`patients-status-badge ${getStatusClass(patient.status)}`}>
                  {patient.status}
                </span>
              </td>
              <td className="patients-td-registered">{formatDate(patient.registeredDate)}</td>
              <td className="patients-td-action">
                <div className="patients-action-buttons">
                  <button 
                    className="patients-view-btn"
                    onClick={() => onView(patient)}
                  >
                    <EyeIcon /> View
                  </button>
                  <button 
                    className="patients-appointments-btn"
                    onClick={() => onAppointments(patient)}
                  >
                    <CalendarIcon /> Appointments
                  </button>
                  <button 
                    className="patients-delete-btn"
                    onClick={() => onDelete(patient)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PatientsTable

