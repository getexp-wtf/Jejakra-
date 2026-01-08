/**
 * Validation Utilities
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Malaysian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean} Is not empty
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} Meets minimum length
 */
export const minLength = (value, minLength) => {
  return String(value).length >= minLength
}

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} Within maximum length
 */
export const maxLength = (value, maxLength) => {
  return String(value).length <= maxLength
}

/**
 * Validate age (must be positive number)
 * @param {string|number} age - Age to validate
 * @returns {boolean} Is valid age
 */
export const isValidAge = (age) => {
  const numAge = Number(age)
  return !isNaN(numAge) && numAge > 0 && numAge < 150
}

/**
 * Validate date is not in the past
 * @param {string|Date} date - Date to validate
 * @returns {boolean} Is future date
 */
export const isFutureDate = (date) => {
  const inputDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return inputDate >= today
}

/**
 * Validate form fields
 * @param {Object} fields - Object with field values
 * @param {Object} rules - Object with validation rules for each field
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateForm = (fields, rules) => {
  const errors = {}
  let isValid = true

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName]
    const value = fields[fieldName]

    fieldRules.forEach(rule => {
      if (rule.required && !isRequired(value)) {
        errors[fieldName] = rule.message || `${fieldName} is required`
        isValid = false
      }
      if (rule.minLength && !minLength(value, rule.minLength)) {
        errors[fieldName] = rule.message || `${fieldName} must be at least ${rule.minLength} characters`
        isValid = false
      }
      if (rule.email && !isValidEmail(value)) {
        errors[fieldName] = rule.message || 'Invalid email format'
        isValid = false
      }
      if (rule.phone && !isValidPhone(value)) {
        errors[fieldName] = rule.message || 'Invalid phone number'
        isValid = false
      }
    })
  })

  return { isValid, errors }
}

