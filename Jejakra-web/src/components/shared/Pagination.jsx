/**
 * Shared Pagination Component
 * Reusable pagination with previous/next navigation
 */

import React from 'react'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageNumbers = false,
  className = '' 
}) => {
  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className={`appointment-pagination ${className}`}>
      <button 
        className="pagination-btn pagination-prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      <span className="pagination-info">
        &lt; Page {currentPage} &gt;
      </span>
      
      <button 
        className="pagination-btn pagination-next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination

