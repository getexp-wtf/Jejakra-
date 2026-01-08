/**
 * Appointments Table Component
 * Displays appointments in a table format
 */

import React from 'react'
import { formatDate } from '../../utils/formatters'

const AppointmentsTable = ({ 
  appointments, 
  showDateColumn = false,
  onStatusChange,
  onViewPatient,
  onMenuToggle,
  openMenuId,
  editingStatusId,
  onStatusEdit,
  onCancelStatusEdit
}) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'Scheduled': 'appointment-status-scheduled',
      'Ongoing': 'appointment-status-ongoing',
      'Completed': 'appointment-status-completed',
      'Cancelled': 'appointment-status-cancelled',
      'No show': 'appointment-status-noshow',
      'No Show': 'appointment-status-noshow'
    }
    return statusMap[status] || ''
  }

  const statusOptions = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled', 'No show']

  return (
    <div className="appointment-table-container">
      <table className="appointment-data-table">
        <thead>
          <tr className="appointment-table-header">
            <th>Patient name</th>
            {showDateColumn && <th className="appointment-th-date">Appointment date</th>}
            <th className="appointment-th-type">Type of Appointments</th>
            <th className="appointment-th-session">Session type</th>
            <th className="appointment-th-visit">Consultation type</th>
            <th className="appointment-th-time">Appointment time</th>
            <th>Status</th>
            <th className="appointment-th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.id}>
              <td className="appointment-patient-cell">
                <span className="appointment-patient-name">{appointment.patientName}</span>
              </td>
              {showDateColumn && (
                <td className="appointment-td-date">{formatDate(appointment.date)}</td>
              )}
              <td className="appointment-td-type">{appointment.appointmentType}</td>
              <td className="appointment-td-session">{appointment.sessionType}</td>
              <td className="appointment-td-visit">{appointment.visitType}</td>
              <td className="appointment-td-time">{appointment.time}</td>
              <td>
                {editingStatusId === appointment.id ? (
                  <select
                    className="appointment-status-select"
                    value={appointment.status}
                    onChange={(e) => onStatusChange(appointment.id, e.target.value)}
                    onBlur={() => onCancelStatusEdit?.()}
                    autoFocus
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <span 
                    className={`appointment-status-pill ${getStatusClass(appointment.status)}`}
                    onClick={() => onStatusEdit?.(appointment.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {appointment.status}
                  </span>
                )}
              </td>
              <td className="appointment-actions-cell">
                <button 
                  className="appointment-action-btn"
                  onClick={() => onMenuToggle(appointment.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                {openMenuId === appointment.id && (
                  <div className="appointment-action-dropdown">
                    <button onClick={() => onViewPatient?.(appointment)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Patient
                    </button>
                    <button onClick={() => onStatusEdit?.(appointment.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Change Status
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AppointmentsTable

