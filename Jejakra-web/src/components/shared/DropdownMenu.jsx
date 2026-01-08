/**
 * Shared Dropdown Menu Component
 * Reusable dropdown with action items
 */

import React, { useRef, useEffect } from 'react'

const DropdownMenu = ({ 
  isOpen, 
  onClose, 
  items, 
  position = 'bottom-right',
  className = '' 
}) => {
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const positionClasses = {
    'bottom-right': 'dropdown-bottom-right',
    'bottom-left': 'dropdown-bottom-left',
    'top-right': 'dropdown-top-right',
    'top-left': 'dropdown-top-left'
  }

  return (
    <div 
      ref={dropdownRef}
      className={`appointment-action-dropdown ${positionClasses[position]} ${className}`}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={index} className="dropdown-separator" />
        }

        return (
          <button
            key={item.key || index}
            className={`dropdown-item ${item.danger ? 'dropdown-item-danger' : ''} ${item.className || ''}`}
            onClick={() => {
              item.onClick?.()
              onClose()
            }}
            disabled={item.disabled}
          >
            {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
            <span className="dropdown-item-text">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default DropdownMenu

