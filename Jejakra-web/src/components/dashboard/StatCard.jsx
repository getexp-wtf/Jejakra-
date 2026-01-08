/**
 * Dashboard Stat Card Component
 * Displays a single stat with icon and value
 */

import React from 'react'

const StatCard = ({ 
  title, 
  value, 
  icon,
  trend,
  trendValue,
  className = '' 
}) => {
  return (
    <div className={`dashboard-stat-card ${className}`}>
      {icon && (
        <div className="dashboard-stat-icon">
          {icon}
        </div>
      )}
      <div className="dashboard-stat-content">
        <h3 className="dashboard-stat-title">{title}</h3>
        <p className="dashboard-stat-value">{value}</p>
        {trend && (
          <span className={`dashboard-stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard

