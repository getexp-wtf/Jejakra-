/**
 * Shared Status Badge Component
 * Displays colored status indicators
 */

import React from 'react'

const StatusBadge = ({ status, variant = 'default', className = '' }) => {
  // Appointment status colors
  const appointmentStatusClasses = {
    'Scheduled': 'appointment-status-scheduled',
    'Ongoing': 'appointment-status-ongoing',
    'Completed': 'appointment-status-completed',
    'Cancelled': 'appointment-status-cancelled',
    'No show': 'appointment-status-noshow',
    'No Show': 'appointment-status-noshow'
  }

  // Patient status colors
  const patientStatusClasses = {
    'Active': 'patient-status-active',
    'Inactive': 'patient-status-inactive',
    'New': 'patient-status-new',
    'Archived': 'patient-status-archived',
    'Pending': 'patient-status-pending'
  }

  const getStatusClass = () => {
    if (variant === 'appointment') {
      return appointmentStatusClasses[status] || ''
    }
    if (variant === 'patient') {
      return patientStatusClasses[status] || ''
    }
    // Try both
    return appointmentStatusClasses[status] || patientStatusClasses[status] || ''
  }

  return (
    <span className={`status-badge ${getStatusClass()} ${className}`}>
      {status}
    </span>
  )
}

// Pre-configured badges
export const AppointmentStatusBadge = ({ status, className }) => (
  <StatusBadge status={status} variant="appointment" className={className} />
)

export const PatientStatusBadge = ({ status, className }) => (
  <StatusBadge status={status} variant="patient" className={className} />
)

export default StatusBadge

