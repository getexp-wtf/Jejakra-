/**
 * Appointment History Modal Component
 * Displays patient's appointment history
 */

import React, { useState } from 'react'
import { formatDate } from '../../utils/formatters'

const AppointmentHistoryModal = ({ 
  isOpen, 
  onClose, 
  patient, 
  appointments = [],
  onCreateAppointment 
}) => {
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState('')

  if (!isOpen || !patient) return null

  // Filter appointments for this patient
  const patientAppointments = appointments.filter(
    apt => apt.patientName?.toLowerCase() === patient.name?.toLowerCase()
  )

  const handleViewNotes = (notes) => {
    setSelectedNotes(notes)
    setShowNotesModal(true)
  }

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

  return (
    <>
      <div className="appointment-modal-overlay">
        <div className="appointment-modal-container appointment-history-modal">
          <div className="appointment-modal-header">
            <h2 className="appointment-modal-title">Appointment History</h2>
            <button className="appointment-modal-close" type="button" onClick={onClose}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="appointment-modal-body">
            <div className="patient-name-header">
              <strong>Patient:</strong> {patient.name}
            </div>

            {patientAppointments.length > 0 ? (
              <div className="patient-appointments-history">
                <table className="patient-appointments-table">
                  <thead>
                    <tr className="patient-appointments-header">
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Mode</th>
                      <th>Outcome</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientAppointments.map(apt => (
                      <tr key={apt.id} className="patient-appointments-row">
                        <td className="patient-appt-col">
                          <div>{formatDate(apt.date)}</div>
                          <div className="appt-time">{apt.time}</div>
                        </td>
                        <td className="patient-appt-col">
                          <span className={`status-badge ${getStatusClass(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="patient-appt-col">{apt.appointmentType}</td>
                        <td className="patient-appt-col">{apt.visitType}</td>
                        <td className="patient-appt-col">{apt.sessionType || '-'}</td>
                        <td className="patient-appt-col">
                          {apt.notes ? (
                            <button 
                              className="view-notes-btn"
                              onClick={() => handleViewNotes(apt.notes)}
                            >
                              View notes
                            </button>
                          ) : (
                            <span className="no-notes">-</span>
                          )}
                        </td>
                        <td className="patient-appt-col">
                          <button className="appt-action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="patient-appointments-empty">
                <p>No appointments found for this patient.</p>
              </div>
            )}

            <div className="appointment-form-actions">
              <button type="button" className="appointment-cancel-btn" onClick={onClose}>
                Close
              </button>
              <button 
                type="button" 
                className="appointment-next-btn"
                onClick={() => onCreateAppointment?.(patient)}
              >
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="notes-modal-container">
          <div className="notes-modal-content">
            <div className="notes-modal-header">
              <h3 className="notes-modal-title">Appointment Notes</h3>
              <button 
                className="appointment-modal-close" 
                onClick={() => setShowNotesModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="notes-modal-body">
              <p className="notes-modal-text">{selectedNotes}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AppointmentHistoryModal

