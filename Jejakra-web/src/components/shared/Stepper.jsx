/**
 * Shared Stepper Component
 * Progress stepper with customizable steps
 */

import React from 'react'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Stepper = ({ 
  steps, 
  currentStep, 
  onStepClick,
  className = '' 
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex + 1 < currentStep) return 'completed'
    if (stepIndex + 1 === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className={`patient-modal-stepper ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isLast = index === steps.length - 1
        
        return (
          <React.Fragment key={step.id || index}>
            <div 
              className={`stepper-step ${status === 'completed' ? 'active' : ''} ${status === 'current' ? 'current' : ''}`}
              onClick={() => onStepClick?.(index + 1)}
              style={{ cursor: onStepClick ? 'pointer' : 'default' }}
            >
              <div className="stepper-circle">
                {status === 'completed' ? <CheckIcon /> : index + 1}
              </div>
              <div className="stepper-label">{step.label}</div>
            </div>
            {!isLast && (
              <div className={`stepper-line ${status === 'completed' ? 'active' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Pre-configured stepper for patient modal
export const PatientModalStepper = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 'general', label: 'General Info' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'history', label: 'History' },
    { id: 'medication', label: 'Medication' },
    { id: 'appointments', label: 'Appointments' }
  ]

  return <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
}

export default Stepper

