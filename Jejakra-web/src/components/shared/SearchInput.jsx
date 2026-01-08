/**
 * Shared Search Input Component
 * Reusable search input with icon
 */

import React from 'react'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  className = '',
  onClear
}) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={`appointment-search-container ${className}`}>
      <span className="appointment-search-icon">
        <SearchIcon />
      </span>
      <input
        type="text"
        className="appointment-search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button 
          className="search-clear-btn" 
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchInput

