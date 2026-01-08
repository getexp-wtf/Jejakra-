/**
 * Patient View Modal Component
 * Multi-step modal for viewing/editing patient information
 */

import React, { useState } from 'react'
import { PatientModalStepper } from '../shared/Stepper'
import { formatDateFull } from '../../utils/formatters'

const PatientViewModal = ({ 
  isOpen, 
  onClose, 
  patient, 
  isEditMode = false,
  onSave,
  onViewAppointments
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    gender: patient?.gender || '',
    age: patient?.age || '',
    address: patient?.address || '',
    registeredDate: patient?.registeredDate || '',
    disease: patient?.disease || '',
    weight: patient?.weight || '',
    height: patient?.height || '',
    bmi: patient?.bmi || '',
    bodyTemperature: patient?.bodyTemperature || '',
    heartRate: patient?.heartRate || '',
    chronicConditions: patient?.chronicConditions || [],
    pastMajorIllnesses: patient?.pastMajorIllnesses || 'No',
    pastMajorIllnessesDetails: patient?.pastMajorIllnessesDetails || '',
    previousSurgeries: patient?.previousSurgeries || 'No',
    prescriptionDrugs: patient?.prescriptionDrugs || [],
    overTheCounterMeds: patient?.overTheCounterMeds || [],
    medicationNotes: patient?.medicationNotes || ''
  })

  if (!isOpen || !patient) return null

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getModalTitle = () => {
    const titles = {
      1: 'General Information',
      2: 'Clinical Measurements',
      3: 'Medical History',
      4: 'Current Medication',
      5: 'Appointments'
    }
    return titles[currentStep]
  }

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return <GeneralInfoStep data={formData} isEditMode={isEditMode} onChange={handleInputChange} />
      case 2:
        return <MeasurementsStep data={formData} isEditMode={isEditMode} onChange={handleInputChange} />
      case 3:
        return <HistoryStep data={formData} isEditMode={isEditMode} onChange={handleInputChange} />
      case 4:
        return <MedicationStep data={formData} isEditMode={isEditMode} onChange={handleInputChange} />
      case 5:
        return <AppointmentsStep patient={patient} onViewAppointments={onViewAppointments} />
      default:
        return null
    }
  }

  return (
    <div className="appointment-modal-overlay">
      <div className="appointment-modal-container patient-view-modal">
        <div className="appointment-modal-header">
          <h2 className="appointment-modal-title">{getModalTitle()}</h2>
          <button className="appointment-modal-close" type="button" onClick={handleClose}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <PatientModalStepper currentStep={currentStep} />

        <div className="appointment-modal-body">
          <div className="appointment-form-container">
            {renderStepContent()}

            <div className="appointment-form-actions">
              {currentStep > 1 && (
                <button type="button" className="appointment-cancel-btn" onClick={handlePrevious}>
                  Previous
                </button>
              )}
              {isEditMode && currentStep < 5 && (
                <button type="button" className="appointment-edit-btn">
                  Edit Information
                </button>
              )}
              {currentStep < 5 ? (
                <button type="button" className="appointment-next-btn" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button type="button" className="appointment-next-btn" onClick={handleClose}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Components
const GeneralInfoStep = ({ data, isEditMode, onChange }) => (
  <>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Patient Name</label>
      {isEditMode ? (
        <input 
          type="text" 
          className="appointment-form-input" 
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      ) : (
        <div className="appointment-form-input appointment-form-readonly">{data.name}</div>
      )}
    </div>
    <div className="appointment-form-row">
      <div className="appointment-form-field">
        <label className="appointment-form-label">Gender</label>
        <div className="appointment-form-input appointment-form-readonly">{data.gender}</div>
      </div>
      <div className="appointment-form-field">
        <label className="appointment-form-label">Age</label>
        <div className="appointment-form-input appointment-form-readonly">{data.age}</div>
      </div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Address</label>
      <div className="appointment-form-input appointment-form-readonly">{data.address}</div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Registered Date</label>
      <div className="appointment-form-input appointment-form-readonly">
        {formatDateFull(data.registeredDate)}
      </div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Disease</label>
      <div className="appointment-form-input appointment-form-readonly">{data.disease}</div>
    </div>
  </>
)

const MeasurementsStep = ({ data, isEditMode, onChange }) => (
  <>
    <div className="appointment-form-row">
      <div className="appointment-form-field">
        <label className="appointment-form-label">Weight (kg)</label>
        <div className="appointment-form-input appointment-form-readonly">{data.weight || '-'}</div>
      </div>
      <div className="appointment-form-field">
        <label className="appointment-form-label">Height (cm)</label>
        <div className="appointment-form-input appointment-form-readonly">{data.height || '-'}</div>
      </div>
    </div>
    <div className="appointment-form-row">
      <div className="appointment-form-field">
        <label className="appointment-form-label">BMI</label>
        <div className="appointment-form-input appointment-form-readonly">{data.bmi || '-'}</div>
      </div>
      <div className="appointment-form-field">
        <label className="appointment-form-label">Body Temperature (°C)</label>
        <div className="appointment-form-input appointment-form-readonly">{data.bodyTemperature || '-'}</div>
      </div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Heart Rate (bpm)</label>
      <div className="appointment-form-input appointment-form-readonly">{data.heartRate || '-'}</div>
    </div>
  </>
)

const HistoryStep = ({ data, isEditMode, onChange }) => (
  <>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Chronic Conditions</label>
      <div className="appointment-form-input appointment-form-readonly">
        {data.chronicConditions?.length > 0 ? data.chronicConditions.join(', ') : 'None'}
      </div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Past Major Illnesses</label>
      <div className="appointment-form-input appointment-form-readonly">{data.pastMajorIllnesses}</div>
    </div>
    {data.pastMajorIllnesses === 'Yes' && (
      <div className="appointment-form-field">
        <label className="appointment-form-label">Details</label>
        <div className="appointment-form-input appointment-form-readonly">{data.pastMajorIllnessesDetails || '-'}</div>
      </div>
    )}
    <div className="appointment-form-field">
      <label className="appointment-form-label">Previous Surgeries</label>
      <div className="appointment-form-input appointment-form-readonly">{data.previousSurgeries}</div>
    </div>
  </>
)

const MedicationStep = ({ data, isEditMode, onChange }) => (
  <>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Prescription Drugs</label>
      <div className="appointment-form-input appointment-form-readonly">
        {data.prescriptionDrugs?.length > 0 ? data.prescriptionDrugs.join(', ') : 'None'}
      </div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Over-the-Counter Medications</label>
      <div className="appointment-form-input appointment-form-readonly">
        {data.overTheCounterMeds?.length > 0 ? data.overTheCounterMeds.join(', ') : 'None'}
      </div>
    </div>
    <div className="appointment-form-field">
      <label className="appointment-form-label">Medication Notes</label>
      <div className="appointment-form-input appointment-form-readonly">{data.medicationNotes || '-'}</div>
    </div>
  </>
)

const AppointmentsStep = ({ patient, onViewAppointments }) => (
  <div className="patient-appointments-summary">
    <p>Click below to view the full appointment history for {patient?.name}.</p>
    <button 
      type="button" 
      className="appointment-next-btn"
      onClick={() => onViewAppointments?.(patient)}
    >
      View Appointments
    </button>
  </div>
)

export default PatientViewModal

