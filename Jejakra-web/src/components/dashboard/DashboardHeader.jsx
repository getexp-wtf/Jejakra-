/**
 * Dashboard Header Component
 * Top bar with search and user info
 */

import React from 'react'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
)

const DashboardHeader = ({ 
  userName = 'User',
  userRole = 'Admin',
  searchValue = '',
  onSearchChange,
  notificationCount = 0
}) => {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header-left">
        <div className="dashboard-search-container">
          <span className="dashboard-search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="dashboard-search-input"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>
      
      <div className="dashboard-header-right">
        <button className="dashboard-notification-btn">
          <BellIcon />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>
        
        <div className="dashboard-user-info">
          <div className="dashboard-user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="dashboard-user-details">
            <span className="dashboard-user-name">{userName}</span>
            <span className="dashboard-user-role">{userRole}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader

