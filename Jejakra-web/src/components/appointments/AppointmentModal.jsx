/**
 * Appointment Modal Component
 * Modal for creating/editing appointments
 */

import React, { useState } from 'react'

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  patients = [],
  availableTimeSlots = []
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentType: 'Consultation',
    date: '',
    time: '',
    visitType: 'In-person',
    reason: ''
  })

  if (!isOpen) return null

  const appointmentTypes = ['Consultation', 'Follow Up', 'Routine Check-up']
  const visitTypes = ['In-person', 'Virtual']
  const timeSlots = availableTimeSlots.length > 0 
    ? availableTimeSlots 
    : ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '3:00 PM', '4:30 PM']

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(formData)
    onClose()
  }

  return (
    <div className="appointment-modal-overlay">
      <div className="appointment-modal-container">
        <div className="appointment-modal-header">
          <h2 className="appointment-modal-title">Schedule Appointment</h2>
          <button className="appointment-modal-close" type="button" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="appointment-modal-body">
          <form className="appointment-form-container" onSubmit={handleSubmit}>
            <div className="appointment-form-field">
              <label className="appointment-form-label">Patient Name</label>
              <input
                type="text"
                className="appointment-form-input"
                value={formData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
                placeholder="Enter patient name"
                required
              />
            </div>

            <div className="appointment-form-field">
              <label className="appointment-form-label">Type of Appointment</label>
              <select
                className="appointment-form-select"
                value={formData.appointmentType}
                onChange={(e) => handleChange('appointmentType', e.target.value)}
              >
                {appointmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="appointment-form-row">
              <div className="appointment-form-field">
                <label className="appointment-form-label">Date</label>
                <input
                  type="date"
                  className="appointment-form-input"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="appointment-form-field">
                <label className="appointment-form-label">Time</label>
                <select
                  className="appointment-form-select"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="appointment-form-field">
              <label className="appointment-form-label">Visit Type</label>
              <div className="appointment-visit-type-options">
                {visitTypes.map(type => (
                  <label key={type} className="appointment-radio-label">
                    <input
                      type="radio"
                      name="visitType"
                      value={type}
                      checked={formData.visitType === type}
                      onChange={(e) => handleChange('visitType', e.target.value)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="appointment-form-field">
              <label className="appointment-form-label">Reason for Visit</label>
              <textarea
                className="appointment-form-textarea"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="Enter reason for appointment"
                rows={3}
              />
            </div>

            <div className="appointment-form-actions">
              <button type="button" className="appointment-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="appointment-next-btn">
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal

