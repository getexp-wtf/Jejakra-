/**
 * API Service - Handles all HTTP requests
 * Currently uses mock data, can be extended for real API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithError = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Patient API methods
export const patientApi = {
  getAll: () => fetchWithError('/patients'),
  getById: (id) => fetchWithError(`/patients/${id}`),
  create: (data) => fetchWithError('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithError(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithError(`/patients/${id}`, { method: 'DELETE' }),
}

// Appointment API methods
export const appointmentApi = {
  getAll: () => fetchWithError('/appointments'),
  getById: (id) => fetchWithError(`/appointments/${id}`),
  getByPatientId: (patientId) => fetchWithError(`/appointments/patient/${patientId}`),
  create: (data) => fetchWithError('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithError(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithError(`/appointments/${id}`, { method: 'DELETE' }),
}

// Dashboard API methods
export const dashboardApi = {
  getStats: () => fetchWithError('/dashboard/stats'),
  getRecentActivity: () => fetchWithError('/dashboard/activity'),
}

export default {
  patientApi,
  appointmentApi,
  dashboardApi,
}

