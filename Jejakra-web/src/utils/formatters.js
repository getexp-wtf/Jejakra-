/**
 * Date and Time Formatting Utilities
 */

/**
 * Format date to dd/mm/yy format
 * @param {string|Date} dateStr - Date string or Date object
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

/**
 * Format date to full format (e.g., "January 15, 2020")
 * @param {string|Date} dateStr - Date string or Date object
 * @returns {string} Formatted date
 */
export const formatDateFull = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Format date to short format (e.g., "Jan 15, 2020")
 * @param {string|Date} dateStr - Date string or Date object
 * @returns {string} Formatted date
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

/**
 * Format patient ID with prefix
 * @param {number|string} id - Patient ID
 * @returns {string} Formatted patient ID (e.g., "P-0001")
 */
export const formatPatientId = (id) => {
  return `P-${String(id).padStart(4, '0')}`
}

/**
 * Get status badge CSS class based on status
 * @param {string} status - Status string
 * @returns {string} CSS class name
 */
export const getStatusClass = (status) => {
  const statusMap = {
    'Active': 'patient-status-active',
    'Inactive': 'patient-status-inactive',
    'New': 'patient-status-new',
    'Archived': 'patient-status-archived',
    'Pending': 'patient-status-pending',
    'Scheduled': 'scheduled',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'Ongoing': 'ongoing',
    'No show': 'no-show',
    'No Show': 'no-show'
  }
  return statusMap[status] || ''
}

/**
 * Get appointment status color class
 * @param {string} status - Appointment status
 * @returns {string} CSS class name
 */
export const getAppointmentStatusColor = (status) => {
  switch(status) {
    case 'Ongoing': return 'appointment-status-ongoing'
    case 'Scheduled': return 'appointment-status-scheduled'
    case 'No show': return 'appointment-status-noshow'
    case 'Completed': return 'appointment-status-completed'
    case 'Cancelled': return 'appointment-status-cancelled'
    default: return 'appointment-status-scheduled'
  }
}

