/**
 * Shared Modal Component
 * Reusable modal with overlay, customizable content
 */

import React from 'react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  showCloseButton = true,
  size = 'medium' // 'small', 'medium', 'large', 'full'
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    full: 'modal-full'
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  return (
    <div className="appointment-modal-overlay" onClick={handleOverlayClick}>
      <div className={`appointment-modal-container ${sizeClasses[size]} ${className}`}>
        {title && (
          <div className="appointment-modal-header">
            <h2 className="appointment-modal-title">{title}</h2>
            {showCloseButton && (
              <button 
                className="appointment-modal-close" 
                type="button" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="appointment-modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

