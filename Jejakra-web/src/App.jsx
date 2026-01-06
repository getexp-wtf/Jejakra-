import { useState, useEffect, useCallback } from 'react'
import './App.css'

// Constants
const BMI_CATEGORIES = {
  UNDERWEIGHT: { threshold: 18.5, name: 'Underweight', color: '#60a5fa', bgColor: '#dbeafe' },
  NORMAL: { threshold: 25, name: 'Normal', color: '#81A388', bgColor: '#e8f0ea' },
  OVERWEIGHT: { threshold: 30, name: 'Overweight', color: '#facc15', bgColor: '#fef9c3' },
  OBESE: { name: 'Obese', color: '#EF908B', bgColor: '#fdedec' }
}

const BMI_MESSAGES = {
  UNDERWEIGHT: 'Consider consulting with a healthcare provider about healthy weight gain strategies.',
  NORMAL: 'Great! You\'re within a healthy weight range. Keep up the good work!',
  OVERWEIGHT: 'Consider adopting a balanced diet and regular exercise routine.',
  OBESE: 'Consult with a healthcare provider about a personalized weight management plan.'
}

const VALIDATION_LIMITS = {
  metric: {
    height: { min: 50, max: 250 },
    weight: { min: 20, max: 300 }
  },
  us: {
    height: { min: 20, max: 120 },
    weight: { min: 44, max: 660 }
  },
  age: { min: 10, max: 120 }
}

const DEFAULT_BMI_VALUES = {
  height: '170',
  weight: '70',
  age: '',
  gender: 'male'
}

const CALCULATION_DELAY = 600
const TRANSITION_DELAY = 300

function App() {
  // Navigation & Auth State
  const [currentPage, setCurrentPage] = useState('main')
  const [activeTab, setActiveTab] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  
  // Dashboard State
  const [dashboardView, setDashboardView] = useState('home')
  const [appointmentFilter, setAppointmentFilter] = useState('today')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Modal States
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showMealPlanModal, setShowMealPlanModal] = useState(false)
  const [showExercisePlanModal, setShowExercisePlanModal] = useState(false)
  
  // Appointment Form States
  const [patientName, setPatientName] = useState('')
  const [appointmentType, setAppointmentType] = useState('Consultation')
  const [selectedDate, setSelectedDate] = useState('2020-03-25')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('8:00 AM')
  const [visitType, setVisitType] = useState('In-person') // 'In-person' or 'Virtual'
  const [reasonText, setReasonText] = useState('I need to see a doctor to get my annual physical checkup.')

  // Appointment Page States
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    appointmentType: '',
    visitType: ''
  })
  const [tempFilterOptions, setTempFilterOptions] = useState({
    appointmentType: '',
    visitType: ''
  })
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc' // 'asc' or 'desc'
  })
  const [openMenuId, setOpenMenuId] = useState(null) // Track which appointment's menu is open
  const [showViewPatientModal, setShowViewPatientModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editingStatusId, setEditingStatusId] = useState(null) // Track which appointment status is being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)
  
  // View Patient Modal states
  const [patientModalStep, setPatientModalStep] = useState(1) // 1: General Info, 2: Clinical Measurements, 3: Medical History, 4: Medication
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Patient form data states
  const [patientFormData, setPatientFormData] = useState({
    // General Information
    name: '',
    gender: '',
    age: '',
    address: '',
    registeredDate: '',
    disease: '',
    // Clinical Measurements
    weight: '',
    height: '',
    bmi: '',
    bodyTemperature: '',
    heartRate: '',
    // Medical History
    chronicConditions: [],
    pastMajorIllnesses: 'No',
    pastMajorIllnessesDetails: '',
    previousSurgeries: 'No',
    // Current Medication
    prescriptionDrugs: [],
    overTheCounterMeds: [],
    medicationNotes: ''
  })
  
  // Dropdown options
  const chronicConditionsOptions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Heart Disease',
    'Chronic Kidney Disease', 'COPD', 'Osteoporosis', 'Depression', 'Anxiety'
  ]
  
  const prescriptionDrugsOptions = [
    'Metformin', 'Lisinopril', 'Albuterol', 'Atorvastatin', 'Levothyroxine',
    'Amlodipine', 'Omeprazole', 'Losartan', 'Gabapentin', 'Sertraline'
  ]
  
  const overTheCounterMedsOptions = [
    'Ibuprofen', 'Acetaminophen', 'Aspirin', 'Loratadine', 'Diphenhydramine',
    'Calcium Carbonate', 'Vitamin D', 'Multivitamin', 'Probiotics', 'Melatonin'
  ]
  
  // Patient data (extended from appointments)
  const [patientsData, setPatientsData] = useState({
    1: { name: 'Jimmy Buffey', gender: 'Male', age: '45', address: '123 Main St, City, State 12345', registeredDate: '2020-01-15', disease: 'Hypertension' },
    2: { name: 'Mike Scott', gender: 'Male', age: '38', address: '456 Oak Ave, City, State 12345', registeredDate: '2019-11-20', disease: 'Diabetes Type 2' },
    3: { name: 'Pam Beasly', gender: 'Female', age: '52', address: '789 Pine Rd, City, State 12345', registeredDate: '2020-02-10', disease: 'Anxiety Disorder' },
    4: { name: 'Peter Kanvinsky', gender: 'Male', age: '34', address: '321 Elm St, City, State 12345', registeredDate: '2019-12-05', disease: 'Chronic Pain' },
    5: { name: 'Hannah Montana', gender: 'Female', age: '29', address: '654 Maple Dr, City, State 12345', registeredDate: '2020-03-01', disease: 'Asthma' },
    6: { name: 'Raven Baxter', gender: 'Female', age: '41', address: '987 Cedar Ln, City, State 12345', registeredDate: '2019-10-12', disease: 'Migraine' },
    7: { name: 'Bloom Bekkar', gender: 'Female', age: '36', address: '147 Birch Way, City, State 12345', registeredDate: '2020-01-25', disease: 'Arthritis' }
  })
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Jimmy Buffey',
      appointmentType: 'Consultation',
      sessionType: 'TREATMENT',
      date: '2020-03-25',
      time: '8:00 AM',
      visitType: 'In-person',
      status: 'No show',
      notes: 'NOTE',
      isToday: true
    },
    {
      id: 2,
      patientName: 'Mike Scott',
      appointmentType: 'Follow Up',
      sessionType: 'INTAKE INTERVIEW',
      date: '2020-03-25',
      time: '9:30 AM',
      visitType: 'Virtual',
      status: 'Ongoing',
      notes: '',
      isToday: true
    },
    {
      id: 3,
      patientName: 'Pam Beasly',
      appointmentType: 'Routine Check-up',
      sessionType: 'TREATMENT',
      date: '2020-03-25',
      time: '11:00 AM',
      visitType: 'Virtual',
      status: 'Scheduled',
      notes: '',
      isToday: true
    },
    {
      id: 4,
      patientName: 'Peter Kanvinsky',
      appointmentType: 'Consultation',
      sessionType: 'TREATMENT',
      date: '2020-03-26',
      time: '12:30 PM',
      visitType: 'Virtual',
      status: 'Scheduled',
      notes: '',
      isToday: false
    },
    {
      id: 5,
      patientName: 'Hannah Montana',
      appointmentType: 'Follow Up',
      sessionType: 'TREATMENT',
      date: '2020-03-26',
      time: '3:00 PM',
      visitType: 'In-person',
      status: 'Scheduled',
      notes: 'NOTE',
      isToday: false
    },
    {
      id: 6,
      patientName: 'Raven Baxter',
      appointmentType: 'Routine Check-up',
      sessionType: 'FINAL SESSION',
      date: '2020-03-26',
      time: '4:30 PM',
      visitType: 'Virtual',
      status: 'Scheduled',
      notes: '',
      isToday: false
    },
    {
      id: 7,
      patientName: 'Bloom Bekkar',
      appointmentType: 'Consultation',
      sessionType: 'FOLLOW UP',
      date: '2020-03-26',
      time: '8:00 AM',
      visitType: 'In-person',
      status: 'Scheduled',
      notes: '',
      isToday: false
    }
  ])

  const appointmentTypes = ['Consultation', 'Follow Up', 'Routine Check-up']
  const availableTimes = ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '3:00 PM', '4:30 PM']

  // Reset appointment form
  const resetAppointmentForm = () => {
    setPatientName('')
    setAppointmentType('Consultation')
    setSelectedDate('2020-03-25')
    setSelectedTimeSlot('8:00 AM')
    setVisitType('In-person')
    setReasonText('I need to see a doctor to get my annual physical checkup.')
  }

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false)
    resetAppointmentForm()
  }

  const handleAppointmentSubmit = (e) => {
    e.preventDefault()
    const newAppointment = {
      id: appointments.length + 1,
      patientName: patientName,
      appointmentType: appointmentType,
      sessionType: 'TREATMENT',
      date: selectedDate,
      time: selectedTimeSlot,
      visitType: visitType, // Keep as 'In-person' or 'Virtual'
      status: 'Scheduled',
      notes: reasonText ? 'NOTE' : '',
      isToday: selectedDate === '2020-03-25'
    }
    
    setAppointments([...appointments, newAppointment])
    setShowAppointmentModal(false)
    resetAppointmentForm()
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Ongoing': return 'appointment-status-scheduled'
      case 'Scheduled': return 'appointment-status-scheduled'
      case 'No show': return 'appointment-status-noshow'
      default: return 'appointment-status-scheduled'
    }
  }


  const getTextColor = (status) => {
    return 'appointment-text-dark'
  }

  const getDotColor = (apt) => {
    if (apt.status === 'No show') return 'appointment-dot-pink'
    if (apt.status === 'Ongoing') return 'appointment-dot-white'
    return 'appointment-dot-yellow'
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortAppointments = (appointmentsList) => {
    if (!sortConfig.key) return appointmentsList
    
    const sorted = [...appointmentsList].sort((a, b) => {
      let aValue, bValue
      
      switch(sortConfig.key) {
        case 'patientName':
          aValue = a.patientName.toLowerCase()
          bValue = b.patientName.toLowerCase()
          break
        case 'appointmentType':
          aValue = a.appointmentType.toLowerCase()
          bValue = b.appointmentType.toLowerCase()
          break
        case 'visitType':
          aValue = a.visitType.toLowerCase()
          bValue = b.visitType.toLowerCase()
          break
        case 'status':
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case 'time':
          // Convert time to comparable format (e.g., "09:45 AM" -> 945)
          const timeToNumber = (time) => {
            const [timePart, period] = time.split(' ')
            const [hours, minutes] = timePart.split(':')
            let hour = parseInt(hours)
            if (period === 'PM' && hour !== 12) hour += 12
            if (period === 'AM' && hour === 12) hour = 0
            return hour * 100 + parseInt(minutes)
          }
          aValue = timeToNumber(a.time)
          bValue = timeToNumber(b.time)
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  }

  const getFilteredAppointments = (appointmentsList) => {
    let filtered = appointmentsList
    
    // Filter by appointment type
    if (filterOptions.appointmentType) {
      filtered = filtered.filter(apt => apt.appointmentType === filterOptions.appointmentType)
    }
    
    // Filter by consultation type (visit type)
    if (filterOptions.visitType) {
      filtered = filtered.filter(apt => apt.visitType === filterOptions.visitType)
    }
    
    return filtered
  }

  const handleViewPatient = (appointment) => {
    const patientData = patientsData[appointment.id]
    if (patientData) {
      const fullPatientData = { ...appointment, ...patientData }
      setSelectedPatient(fullPatientData)
      // Initialize form data
      setPatientFormData({
        name: fullPatientData.name || '',
        gender: fullPatientData.gender || '',
        age: fullPatientData.age || '',
        address: fullPatientData.address || '',
        registeredDate: fullPatientData.registeredDate || '',
        disease: fullPatientData.disease || '',
        weight: fullPatientData.weight || '',
        height: fullPatientData.height || '',
        bmi: fullPatientData.bmi || '',
        bodyTemperature: fullPatientData.bodyTemperature || '',
        heartRate: fullPatientData.heartRate || '',
        chronicConditions: fullPatientData.chronicConditions || [],
        pastMajorIllnesses: fullPatientData.pastMajorIllnesses || 'No',
        pastMajorIllnessesDetails: fullPatientData.pastMajorIllnessesDetails || '',
        previousSurgeries: fullPatientData.previousSurgeries || 'No',
        prescriptionDrugs: fullPatientData.prescriptionDrugs || [],
        overTheCounterMeds: fullPatientData.overTheCounterMeds || [],
        medicationNotes: fullPatientData.medicationNotes || ''
      })
      setPatientModalStep(1)
      setIsEditMode(false)
      setShowViewPatientModal(true)
      setOpenMenuId(null)
    }
  }
  
  const handleAddChronicCondition = (condition) => {
    if (patientFormData.chronicConditions.length < 5 && !patientFormData.chronicConditions.includes(condition)) {
      setPatientFormData(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, condition]
      }))
    }
  }
  
  const handleRemoveChronicCondition = (condition) => {
    setPatientFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter(c => c !== condition)
    }))
  }
  
  const handleAddPrescriptionDrug = (drug) => {
    if (patientFormData.prescriptionDrugs.length < 5 && !patientFormData.prescriptionDrugs.includes(drug)) {
      setPatientFormData(prev => ({
        ...prev,
        prescriptionDrugs: [...prev.prescriptionDrugs, drug]
      }))
    }
  }
  
  const handleRemovePrescriptionDrug = (drug) => {
    setPatientFormData(prev => ({
      ...prev,
      prescriptionDrugs: prev.prescriptionDrugs.filter(d => d !== drug)
    }))
  }
  
  const handleAddOverTheCounterMed = (med) => {
    if (patientFormData.overTheCounterMeds.length < 5 && !patientFormData.overTheCounterMeds.includes(med)) {
      setPatientFormData(prev => ({
        ...prev,
        overTheCounterMeds: [...prev.overTheCounterMeds, med]
      }))
    }
  }
  
  const handleRemoveOverTheCounterMed = (med) => {
    setPatientFormData(prev => ({
      ...prev,
      overTheCounterMeds: prev.overTheCounterMeds.filter(m => m !== med)
    }))
  }
  
  const handleNextStep = () => {
    if (patientModalStep < 4) {
      setPatientModalStep(patientModalStep + 1)
    }
  }
  
  const handlePreviousStep = () => {
    if (patientModalStep > 1) {
      setPatientModalStep(patientModalStep - 1)
    }
  }
  
  const handleClosePatientModal = () => {
    setShowViewPatientModal(false)
    setPatientModalStep(1)
    setIsEditMode(false)
    setSelectedPatient(null)
  }
  
  const handleSavePatientData = () => {
    if (selectedPatient && selectedPatient.id) {
      // Update patientsData with new form data
      setPatientsData(prev => ({
        ...prev,
        [selectedPatient.id]: {
          ...prev[selectedPatient.id],
          ...patientFormData
        }
      }))
      // Update selectedPatient to reflect changes
      setSelectedPatient(prev => ({
        ...prev,
        ...patientFormData
      }))
    }
    setIsEditMode(false)
  }

  const handleUpdateStatus = (appointmentId) => {
    setEditingStatusId(appointmentId)
    setOpenMenuId(null)
  }

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ))
    setEditingStatusId(null)
  }

  const handleDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment)
    setShowDeleteModal(true)
    setOpenMenuId(null)
  }

  const confirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentToDelete.id))
      setShowDeleteModal(false)
      setAppointmentToDelete(null)
    }
  }

  const todayAppointments = sortAppointments(getFilteredAppointments(appointments.filter(apt => apt.isToday)))
  const tomorrowAppointments = sortAppointments(getFilteredAppointments(appointments.filter(apt => !apt.isToday)))
  
  // Meal Plan State
  const [activeMealTab, setActiveMealTab] = useState('breakfast') // 'breakfast', 'lunch', 'snack', 'dinner'
  
  // Login/Register State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // BMI Calculator State
  const [height, setHeight] = useState(DEFAULT_BMI_VALUES.height)
  const [weight, setWeight] = useState(DEFAULT_BMI_VALUES.weight)
  const [age, setAge] = useState(DEFAULT_BMI_VALUES.age)
  const [gender, setGender] = useState(DEFAULT_BMI_VALUES.gender)
  const [unitSystem, setUnitSystem] = useState('metric')
  const [bmiCalculated, setBmiCalculated] = useState(false)
  const [bmiResult, setBmiResult] = useState(null)
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Validation State
  const [validationErrors, setValidationErrors] = useState({
    height: '',
    weight: '',
    age: ''
  })

  // Common login handler
  const handleLogin = useCallback((loginType, credentials = {}) => {
    console.log(`${loginType} login:`, credentials)
    setIsLoggedIn(true)
    setUserRole('Super Admin')
    setCurrentPage('dashboard')
  }, [])

  // Auth Handlers
  const handleEmailLogin = (e) => {
    e.preventDefault()
    handleLogin('Email', { email, password })
  }

  const handleEmailRegister = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    handleLogin('Email Register', { email, password })
  }

  const handleGithubLogin = () => {
    handleLogin('GitHub SSO')
  }

  const handleGoogleLogin = () => {
    handleLogin('Google SSO')
  }

  // Validation Functions
  const validateInput = useCallback((name, value) => {
    if (value === '' || value === null || value === undefined) {
      return '' // Empty is okay, show error only on blur or submit
    }
    
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      return `Please enter a valid ${name}`
    }
    
    const limits = VALIDATION_LIMITS[unitSystem]?.[name] || VALIDATION_LIMITS[name]
    if (!limits) return ''
    
    const { min, max } = limits
    const unit = name === 'height' 
      ? (unitSystem === 'metric' ? 'cm' : 'inches')
      : name === 'weight'
      ? (unitSystem === 'metric' ? 'kg' : 'lbs')
      : 'years'
    
    if (numValue < min || numValue > max) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} should be between ${min}-${max} ${unit}`
    }
    
    return ''
  }, [unitSystem])

  const handleInputChange = (name, value) => {
    // Update the value
    if (name === 'height') setHeight(value)
    else if (name === 'weight') setWeight(value)
    else if (name === 'age') setAge(value)
    
    // Validate in real-time
    const error = validateInput(name, value)
    setValidationErrors(prev => ({ ...prev, [name]: error }))
  }

  // BMI Calculation Helpers
  const getBMICategory = useCallback((bmi) => {
    if (bmi < BMI_CATEGORIES.UNDERWEIGHT.threshold) {
      return {
        name: BMI_CATEGORIES.UNDERWEIGHT.name,
        color: BMI_CATEGORIES.UNDERWEIGHT.color,
        bgColor: BMI_CATEGORIES.UNDERWEIGHT.bgColor,
        message: BMI_MESSAGES.UNDERWEIGHT
      }
    }
    if (bmi < BMI_CATEGORIES.NORMAL.threshold) {
      return {
        name: BMI_CATEGORIES.NORMAL.name,
        color: BMI_CATEGORIES.NORMAL.color,
        bgColor: BMI_CATEGORIES.NORMAL.bgColor,
        message: BMI_MESSAGES.NORMAL
      }
    }
    if (bmi < BMI_CATEGORIES.OVERWEIGHT.threshold) {
      return {
        name: BMI_CATEGORIES.OVERWEIGHT.name,
        color: BMI_CATEGORIES.OVERWEIGHT.color,
        bgColor: BMI_CATEGORIES.OVERWEIGHT.bgColor,
        message: BMI_MESSAGES.OVERWEIGHT
      }
    }
    return {
      name: BMI_CATEGORIES.OBESE.name,
      color: BMI_CATEGORIES.OBESE.color,
      bgColor: BMI_CATEGORIES.OBESE.bgColor,
      message: BMI_MESSAGES.OBESE
    }
  }, [])

  const calculateIdealWeightRange = useCallback((heightCm) => {
    const heightM = heightCm / 100
    const minBMI = 18.5
    const maxBMI = 24.9
    const minWeight = (minBMI * heightM * heightM).toFixed(1)
    const maxWeight = (maxBMI * heightM * heightM).toFixed(1)
    return { min: minWeight, max: maxWeight }
  }, [])

  const getBMIPosition = useCallback((bmi) => {
    // BMI ranges mapped to flex values for scale visualization
    const BMI_RANGES = {
      UNDERWEIGHT: { max: 18.5, flex: 18.5 },
      NORMAL: { max: 25, flex: 6.4 },
      OVERWEIGHT: { max: 30, flex: 4.9 },
      OBESE: { max: 40, flex: 10 }
    }
    
    const totalFlex = 39.8
    let position = 0
    
    if (bmi < BMI_RANGES.UNDERWEIGHT.max) {
      position = (bmi / BMI_RANGES.UNDERWEIGHT.max) * (BMI_RANGES.UNDERWEIGHT.flex / totalFlex) * 100
    } else if (bmi < BMI_RANGES.NORMAL.max) {
      const underweightFlex = BMI_RANGES.UNDERWEIGHT.flex / totalFlex * 100
      const normalRatio = (bmi - BMI_RANGES.UNDERWEIGHT.max) / BMI_RANGES.NORMAL.flex
      position = underweightFlex + (normalRatio * (BMI_RANGES.NORMAL.flex / totalFlex) * 100)
    } else if (bmi < BMI_RANGES.OVERWEIGHT.max) {
      const underweightFlex = BMI_RANGES.UNDERWEIGHT.flex / totalFlex * 100
      const normalFlex = BMI_RANGES.NORMAL.flex / totalFlex * 100
      const overweightRatio = (bmi - BMI_RANGES.NORMAL.max) / BMI_RANGES.OVERWEIGHT.flex
      position = underweightFlex + normalFlex + (overweightRatio * (BMI_RANGES.OVERWEIGHT.flex / totalFlex) * 100)
    } else {
      const underweightFlex = BMI_RANGES.UNDERWEIGHT.flex / totalFlex * 100
      const normalFlex = BMI_RANGES.NORMAL.flex / totalFlex * 100
      const overweightFlex = BMI_RANGES.OVERWEIGHT.flex / totalFlex * 100
      const obeseRatio = Math.min((bmi - BMI_RANGES.OVERWEIGHT.max) / BMI_RANGES.OBESE.flex, 1)
      position = underweightFlex + normalFlex + overweightFlex + (obeseRatio * (BMI_RANGES.OBESE.flex / totalFlex) * 100)
    }
    
    return Math.min(position, 98) // Cap at 98% to keep indicator visible
  }, [])

  const calculateBMI = useCallback(() => {
    // Validate all inputs
    const heightError = validateInput('height', height)
    const weightError = validateInput('weight', weight)
    const ageError = age ? validateInput('age', age) : ''
    
    setValidationErrors({
      height: heightError,
      weight: weightError,
      age: ageError
    })
    
    if (heightError || weightError || ageError) {
      return
    }
    
    const h = parseFloat(height)
    const w = parseFloat(weight)
    
    if (!h || !w || h <= 0 || w <= 0) {
      return
    }

    setIsCalculating(true)
    setBmiResult(null)

    setTimeout(() => {
      const bmi = unitSystem === 'metric'
        ? (w / ((h / 100) ** 2)).toFixed(1)
        : ((w / (h ** 2)) * 703).toFixed(1)

      const categoryInfo = getBMICategory(parseFloat(bmi))
      const idealRange = unitSystem === 'metric'
        ? calculateIdealWeightRange(h)
        : (() => {
            const heightCm = h * 2.54
            const range = calculateIdealWeightRange(heightCm)
            return {
              min: (parseFloat(range.min) / 2.20462).toFixed(1),
              max: (parseFloat(range.max) / 2.20462).toFixed(1)
            }
          })()
      
      setIsTransitioning(true)
      setTimeout(() => {
        setBmiResult({
          bmi,
          category: categoryInfo.name,
          ...categoryInfo,
          idealRange
        })
        setBmiCalculated(true)
        setIsCalculating(false)
        setIsTransitioning(false)
      }, TRANSITION_DELAY)
    }, CALCULATION_DELAY)
  }, [height, weight, age, unitSystem, validateInput, getBMICategory, calculateIdealWeightRange])

  const clearBMI = useCallback(() => {
    setHeight(DEFAULT_BMI_VALUES.height)
    setWeight(DEFAULT_BMI_VALUES.weight)
    setAge(DEFAULT_BMI_VALUES.age)
    setGender(DEFAULT_BMI_VALUES.gender)
    setBmiCalculated(false)
    setBmiResult(null)
    setIsCalculating(false)
    setValidationErrors({ height: '', weight: '', age: '' })
  }, [])

  // Navigation Handler
  const handleNavigation = useCallback((targetPage) => {
    if (bmiCalculated && targetPage === 'main') {
      clearBMI()
    }
    setCurrentPage(targetPage)
  }, [bmiCalculated, clearBMI])

  // Logout Handler
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false)
    setUserRole(null)
    handleNavigation('main')
  }, [handleNavigation])

  // BMI Result Handlers
  const handleEdit = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setBmiCalculated(false)
      setBmiResult(null)
      setIsTransitioning(false)
    }, TRANSITION_DELAY)
  }, [])

  // Reset BMI when navigating away from main page
  useEffect(() => {
    if (currentPage !== 'main' && bmiCalculated) {
      setBmiCalculated(false)
      setBmiResult(null)
      setIsTransitioning(false)
    }
  }, [currentPage, bmiCalculated])

  // Close appointment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null && !event.target.closest('.appointment-more-wrapper')) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenuId])

  const renderFormContent = () => (
    <>
      {/* Card Container */}
      <div className="login-card">
        {/* Welcome Section - Centered */}
        <div className="welcome-section">
          <h1 className="login-title">
            {activeTab === 'login' ? 'Welcome back!' : 'Create an account!'}
          </h1>
          <p className="login-subtitle">
            {activeTab === 'login' 
              ? 'Enter your credentials to jump back in.' 
              : 'Enter your details to create your account.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="tab-selector">
          <button
            type="button"
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login/Register Form */}
        <form onSubmit={activeTab === 'login' ? handleEmailLogin : handleEmailRegister} className="email-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password Field - Only for Register */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showConfirmPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Remember Me and Forgot Password - Only for Login */}
          {activeTab === 'login' && (
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="submit-button">
            {activeTab === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">Or sign in with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-buttons">
          <button
            type="button"
            onClick={handleGithubLogin}
            className="social-button social-button-github"
            aria-label="Sign in with GitHub"
          >
            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="social-button social-button-google"
            aria-label="Sign in with Google"
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>
    </>
  )

  // Main Page Component
  const renderMainPage = () => (
    <div className="main-page">
      {/* Navigation Bar */}
      <nav className="main-navigation">
        {/* Logo - Left Side */}
        <div 
          className="logo-container"
          onClick={() => handleNavigation('main')}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon">J</div>
          <span className="logo-text">Jejakra.</span>
        </div>
        
        {/* Navigation Links - Right Side */}
        <div className="nav-links">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavigation('main'); }}>
            Home
          </a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); console.log('Pricing clicked'); }}>
            Pricing
          </a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); console.log('Feature clicked'); }}>
            Feature
          </a>
          <button
            type="button"
            className="nav-button"
            onClick={() => handleNavigation('login')}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`hero-section ${bmiCalculated ? 'hero-section-result' : ''}`}>
        <div className={`hero-grid ${bmiCalculated ? 'hero-grid-result' : ''}`}>
          {/* LEFT COLUMN */}
          {!bmiCalculated && (
            <div className="hero-copy">
              <h1 className="hero-title">Understand your body,<br/><span>one habit at a time.</span></h1>
              <p className="hero-subtitle">
                Every data point tells a story. Track your body metrics, reflect on patterns, and make informed health decisions—at your own pace.
              </p>
            </div>
          )}

          {/* RIGHT COLUMN - CARD */}
          <div className={`hero-card ${isTransitioning ? 'transitioning' : ''} ${bmiCalculated ? 'hero-card-result' : ''}`}>
            {!bmiCalculated ? (
              <>
                {/* Unit Toggle */}
                <div className="unit-toggle-container">
                  <span className={unitSystem === 'metric' ? 'unit-active' : 'unit-inactive'}>Metric</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={unitSystem === 'us'}
                      onChange={(e) => setUnitSystem(e.target.checked ? 'us' : 'metric')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className={unitSystem === 'us' ? 'unit-active' : 'unit-inactive'}>US</span>
                </div>

                <div className="hero-card-title-container">
                  <h2 className="hero-card-title">
                    Body Metrics Overview
                    <div className="formula-tooltip-container">
                      <button
                        type="button"
                        className="formula-tooltip-trigger"
                        onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                        onMouseEnter={() => setShowFormulaTooltip(true)}
                        onMouseLeave={() => setShowFormulaTooltip(false)}
                        onBlur={() => setTimeout(() => setShowFormulaTooltip(false), 200)}
                        aria-label="How is BMI calculated?"
                      >
                        ?
                      </button>
                      {showFormulaTooltip && (
                        <div className="formula-tooltip" onClick={(e) => e.stopPropagation()}>
                          <p className="tooltip-description">
                            BMI (Body Mass Index) is a measure of body fat based on height and weight. It's a useful indicator of overall health, though it doesn't account for muscle mass or body composition.
                          </p>
                          <strong>BMI Formula:</strong>
                          <p className="formula-main">BMI = weight(kg) / height(m)²</p>
                          <p className="formula-example">Metric: weight (kg) ÷ height (m)²</p>
                          <p className="formula-example">US: (weight (lbs) ÷ height (in)²) × 703</p>
                          <div className="tooltip-categories">
                            <p className="tooltip-category-title">Category Ranges:</p>
                            <ul className="tooltip-category-list">
                              <li><span className="category-color" style={{ backgroundColor: '#60a5fa' }}></span> Underweight: &lt;18.5</li>
                              <li><span className="category-color" style={{ backgroundColor: '#81A388' }}></span> Normal: 18.5-24.9</li>
                              <li><span className="category-color" style={{ backgroundColor: '#facc15' }}></span> Overweight: 25-29.9</li>
                              <li><span className="category-color" style={{ backgroundColor: '#EF908B' }}></span> Obese: ≥30</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </h2>
                </div>

                <p className="bmi-intro-text">
                  Take a moment to understand your body measurements. Jejakra helps you track trends over time and supports informed conversations about your health.
                </p>

                <div className="bmi-form-layout">
                  <div className="form-column form-column-left">
                    <div className="form-group form-group-item">
                      <label htmlFor="hero-weight">Weight</label>
                      <div className="input-with-addon">
                        <input 
                          type="number" 
                          id="hero-weight" 
                          placeholder=""
                          value={weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          onBlur={(e) => {
                            const error = validateInput('weight', e.target.value)
                            setValidationErrors(prev => ({ ...prev, weight: error }))
                          }}
                          min={unitSystem === 'metric' ? 20 : 44}
                          max={unitSystem === 'metric' ? 300 : 660}
                          step="0.1"
                          className={validationErrors.weight ? 'input-error' : ''}
                        />
                        <span className="input-addon">
                          {unitSystem === 'metric' ? 'KG' : 'LBS'}
                        </span>
                      </div>
                      {validationErrors.weight && (
                        <span className="validation-error">{validationErrors.weight}</span>
                      )}
                    </div>

                    <div className="form-group form-group-item">
                      <label>Gender</label>
                      <div className="gender-buttons">
                        <button
                          type="button"
                          className={`gender-button ${gender === 'male' ? 'active' : ''}`}
                          onClick={() => setGender('male')}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`gender-button ${gender === 'female' ? 'active' : ''}`}
                          onClick={() => setGender('female')}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-column form-column-right">
                    <div className="form-group form-group-item">
                      <label htmlFor="hero-height">Height</label>
                      <div className="input-with-addon">
                        <input 
                          type="number" 
                          id="hero-height" 
                          placeholder=""
                          value={height}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          onBlur={(e) => {
                            const error = validateInput('height', e.target.value)
                            setValidationErrors(prev => ({ ...prev, height: error }))
                          }}
                          min={unitSystem === 'metric' ? 50 : 20}
                          max={unitSystem === 'metric' ? 250 : 120}
                          step="0.1"
                          className={validationErrors.height ? 'input-error' : ''}
                        />
                        <span className="input-addon">
                          {unitSystem === 'metric' ? 'CM' : 'IN'}
                        </span>
                      </div>
                      {validationErrors.height && (
                        <span className="validation-error">{validationErrors.height}</span>
                      )}
                    </div>

                    <div className="form-group form-group-item">
                      <label htmlFor="hero-age">Age (optional)</label>
                      <div className="input-with-addon">
                        <input 
                          type="number" 
                          id="hero-age" 
                          placeholder="e.g., 25"
                          value={age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          onBlur={(e) => {
                            const error = validateInput('age', e.target.value)
                            setValidationErrors(prev => ({ ...prev, age: error }))
                          }}
                          min="10"
                          max="120"
                          step="1"
                          className={`age-input ${validationErrors.age ? 'input-error' : ''}`}
                        />
                      </div>
                      {validationErrors.age && (
                        <span className="validation-error">{validationErrors.age}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="button-group">
                  <button 
                    className={`hero-card-button hero-card-button-primary calculate-button ${isCalculating ? 'calculating' : ''}`}
                    onClick={calculateBMI}
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <span className="button-spinner"></span>
                        Calculating...
                      </>
                    ) : (
                      'Calculate BMI'
                    )}
                  </button>
                  <button 
                    className="hero-card-button hero-card-button-secondary"
                    onClick={clearBMI}
                    disabled={isCalculating}
                  >
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <div className="bmi-result-card-sleek animated-result">
                {/* Hero BMI Display */}
                <div className="bmi-hero-section" style={{ background: `linear-gradient(135deg, ${bmiResult.bgColor}22, ${bmiResult.bgColor}08)`, borderColor: `${bmiResult.color}30` }}>
                  <div className="bmi-hero-content">
                    <div className="bmi-hero-label">Your Body Mass Index</div>
                    <div className="bmi-hero-value" style={{ color: bmiResult.color }}>
                      {bmiResult.bmi}
                    </div>
                    <div className="bmi-hero-category" style={{ color: bmiResult.color }}>
                      {bmiResult.category}
                    </div>
                  </div>
                  <div className="bmi-hero-icon" style={{ background: `${bmiResult.bgColor}40` }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: bmiResult.color }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                {/* Health Message */}
                <div className="bmi-message-card" style={{ borderColor: `${bmiResult.color}40`, background: `${bmiResult.bgColor}15` }}>
                  <p className="bmi-message-text" style={{ color: bmiResult.color }}>{bmiResult.message}</p>
                </div>

                {/* Summary Stats Grid */}
                <div className="bmi-stats-section">
                  <h3 className="bmi-stats-title">Your Information</h3>
                  <div className="bmi-stats-grid">
                  <div className="bmi-stat-card">
                    <div className="bmi-stat-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                    </div>
                    <div className="bmi-stat-info">
                      <div className="bmi-stat-label">Weight</div>
                      <div className="bmi-stat-value">{weight} {unitSystem === 'metric' ? 'kg' : 'lbs'}</div>
                    </div>
                  </div>
                  <div className="bmi-stat-card">
                    <div className="bmi-stat-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div className="bmi-stat-info">
                      <div className="bmi-stat-label">Height</div>
                      <div className="bmi-stat-value">{height} {unitSystem === 'metric' ? 'cm' : 'in'}</div>
                    </div>
                  </div>
                  <div className="bmi-stat-card">
                    <div className="bmi-stat-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="bmi-stat-info">
                      <div className="bmi-stat-label">Gender</div>
                      <div className="bmi-stat-value">{gender.charAt(0).toUpperCase() + gender.slice(1)}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* BMI Scale Visualization */}
                <div className="bmi-scale-section">
                  <div className="bmi-scale-header">
                    <span className="bmi-scale-title">BMI Scale</span>
                    <span className="bmi-scale-value">Your BMI: {bmiResult.bmi}</span>
                  </div>
                  <div className="bmi-scale-bar">
                    <div className="bmi-scale-segments">
                      <div className="bmi-scale-segment bmi-scale-under" title="Underweight (<18.5)"></div>
                      <div className="bmi-scale-segment bmi-scale-normal" title="Normal (18.5-24.9)"></div>
                      <div className="bmi-scale-segment bmi-scale-over" title="Overweight (25-29.9)"></div>
                      <div className="bmi-scale-segment bmi-scale-obese" title="Obese (≥30)"></div>
                    </div>
                    <div 
                      className="bmi-scale-indicator" 
                      style={{ 
                        left: `${getBMIPosition(parseFloat(bmiResult.bmi))}%`,
                        backgroundColor: bmiResult.color
                      }}
                    >
                      <div className="bmi-indicator-dot"></div>
                      <div className="bmi-indicator-line"></div>
                    </div>
                  </div>
                  <div className="bmi-scale-labels">
                    <span>0</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bmi-action-buttons">
                  <button 
                    className="bmi-action-btn bmi-action-primary"
                    onClick={handleEdit}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Recalculate
                  </button>
                  <button 
                    className="bmi-action-btn bmi-action-secondary"
                    onClick={() => {
                      if (isLoggedIn) {
                        // If already logged in, redirect to dashboard
                        setCurrentPage('dashboard')
                      } else {
                        // If not logged in, redirect to login page
                        handleNavigation('login')
                      }
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    Read More
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Jejakra</h3>
            <p className="footer-text">Understand your body,one habit at a time</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Pricing clicked'); }}>Pricing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Feature clicked'); }}>Feature</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('login'); }}>Login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('main'); }}>Home</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:contact@jejakra.com">contact@jejakra.com</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 Jejakra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )

  // Login Page Component
  const renderLoginPage = () => (
    <div className={`app-container ${activeTab === 'register' ? 'inverted' : ''}`}>
      {/* Pattern Section - Left for Register, Right for Login */}
      {activeTab === 'register' && (
        <div className="pattern-section">
          <div className="pattern-container"></div>
        </div>
      )}

      {/* Form Section */}
      <div className="login-section">
        {/* Logo - Top Left */}
        <div 
          className="logo-container logo-top-left"
          onClick={() => handleNavigation('main')}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon">J</div>
          <span className="logo-text">Jejakra.</span>
        </div>
        <div className="login-content">
          {renderFormContent()}
        </div>
      </div>

      {/* Pattern Section - Right for Login, Left for Register */}
      {activeTab === 'login' && (
        <div className="pattern-section">
          <div className="pattern-container"></div>
        </div>
      )}
    </div>
  )

  // Dashboard Page Component
  const renderDashboard = () => (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <button 
              className="sidebar-menu-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isSidebarCollapsed ? (
                  <path d="M9 18l6-6-6-6"/>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
            {!isSidebarCollapsed && (
              <input 
                type="text" 
                className="sidebar-search" 
                placeholder="Search..."
              />
            )}
          </div>
          
          <nav className="sidebar-nav">
            {/* Navigation 1: Home */}
            <a 
              href="#" 
              className={`sidebar-nav-item ${dashboardView === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setDashboardView('home'); }}
              title="Home"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {!isSidebarCollapsed && <span>Home</span>}
            </a>

            {/* Navigation 2: Appointments */}
            <a 
              href="#" 
              className={`sidebar-nav-item ${dashboardView === 'appointment' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setDashboardView('appointment'); }}
              title="Appointments"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {!isSidebarCollapsed && <span>Appointments</span>}
            </a>

            {/* Navigation 3: Meal Plan */}
            <a 
              href="#" 
              className={`sidebar-nav-item ${dashboardView === 'meal-plan' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setDashboardView('meal-plan'); }}
              title="Meal Plan"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {!isSidebarCollapsed && <span>Meal Plan</span>}
            </a>

            {/* Navigation 4: Exercise Plan */}
            <a 
              href="#" 
              className={`sidebar-nav-item ${dashboardView === 'exercise-plan' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setDashboardView('exercise-plan'); }}
              title="Exercise Plan"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
              </svg>
              {!isSidebarCollapsed && <span>Exercise Plan</span>}
            </a>

            {/* Navigation 5: Patients */}
            <a 
              href="#" 
              className={`sidebar-nav-item ${dashboardView === 'patients' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setDashboardView('patients'); }}
              title="Patients"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {!isSidebarCollapsed && <span>Patients</span>}
            </a>
          </nav>
          
          {/* Navigation 5: Settings */}
          <div 
            className={`sidebar-profile ${dashboardView === 'settings' ? 'active' : ''}`}
            onClick={() => setDashboardView('settings')}
            style={{ cursor: 'pointer' }}
            title="Settings"
          >
            <div className="profile-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.875rem', textAlign: 'center', color: dashboardView === 'settings' ? '#4caf50' : '#666', fontWeight: dashboardView === 'settings' ? '600' : 'normal' }}>Settings</span>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {dashboardView === 'home' && (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-greeting">Hello, {userRole || 'User'}!</h1>
                <select className="dashboard-filter">
                  <option>This month</option>
                  <option>This week</option>
                  <option>This year</option>
                </select>
              </div>

              {/* KPI Cards */}
              <div className="dashboard-kpis">
                <div className="kpi-card kpi-purple">
                  <div className="kpi-icon kpi-icon-purple">
                    <div className="kpi-dot"></div>
                  </div>
                  <div className="kpi-content">
                    <h3 className="kpi-title">placeholder#8</h3>
                    <p className="kpi-value">120</p>
                    <p className="kpi-subtitle">4 not confirmed</p>
                  </div>
                </div>
                
                <div className="kpi-card kpi-green">
                  <div className="kpi-icon kpi-icon-green">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="kpi-content">
                    <h3 className="kpi-title">placeholder#9</h3>
                    <p className="kpi-value">72</p>
                    <p className="kpi-subtitle">▲ 3.4% vs last month</p>
                  </div>
                </div>
                
                <div className="kpi-card kpi-orange">
                  <div className="kpi-icon kpi-icon-orange">
                    <div className="kpi-dot"></div>
                  </div>
                  <div className="kpi-content">
                    <h3 className="kpi-title">placeholder#10</h3>
                    <p className="kpi-value">3,450 $</p>
                    <p className="kpi-subtitle">▲ 5.5% vs last month</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="dashboard-bottom">
                <div className="dashboard-card sales-card">
                  <h2 className="card-title">placeholder#11</h2>
                  <p className="sales-text">You have sold <strong>48 products</strong> this month.</p>
                  <div className="sales-chart">
                    <svg width="100%" height="120" viewBox="0 0 300 120" className="chart-svg">
                      <polyline
                        points="0,100 50,90 100,70 150,50 200,40 250,35 300,32"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="3"
                      />
                      <text x="250" y="30" fontSize="12" fill="#34d399" fontWeight="600">32</text>
                      <text x="240" y="115" fontSize="10" fill="#666">10 Dec</text>
                    </svg>
                  </div>
                  <button className="chart-arrow-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>

                <div className="quick-actions">
                  <button className="quick-action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>placeholder#12</span>
                  </button>
                  <button className="quick-action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    <span>placeholder#13</span>
                  </button>
                  <button className="quick-action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>placeholder#14</span>
                  </button>
                  <button className="quick-action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>placeholder#15</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {dashboardView === 'appointment' && (
            <div className="appointment-page-container">
              {/* Top Bar with Filters */}
              <div className="appointment-top-bar">
                <div className="appointment-top-bar-content">
                  {/* Search Bar - Moved to left */}
                  <div className="appointment-search-wrapper">
                    <svg className="appointment-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search Appointments"
                      className="appointment-search-input"
                    />
                  </div>

                  <div className="appointment-actions">
                    {/* More filter - Merged with All Appointments */}
                    <div className="appointment-dropdown-wrapper">
                      <button 
                        onClick={() => {
                          setShowFilterDropdown(!showFilterDropdown)
                          if (!showFilterDropdown) {
                            // Initialize temp filters with current filter values when opening
                            setTempFilterOptions({...filterOptions})
                          }
                        }}
                        className="appointment-filter-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                        More filter
                      </button>
                      {showFilterDropdown && (
                        <div className="appointment-filter-menu">
                          <div className="appointment-filter-field">
                            <label className="appointment-filter-label">Type of Appointment</label>
                            <select 
                              value={tempFilterOptions.appointmentType}
                              onChange={(e) => setTempFilterOptions({...tempFilterOptions, appointmentType: e.target.value})}
                              className="appointment-filter-select"
                            >
                              <option value="">All appointments</option>
                              {appointmentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div className="appointment-filter-field">
                            <label className="appointment-filter-label">Consultation Type</label>
                            <div className="appointment-filter-buttons">
                              <button
                                type="button"
                                onClick={() => setTempFilterOptions({...tempFilterOptions, visitType: tempFilterOptions.visitType === 'In-person' ? '' : 'In-person'})}
                                className={`appointment-filter-type-btn ${tempFilterOptions.visitType === 'In-person' ? 'active' : ''}`}
                              >
                                In-person
                              </button>
                              <button
                                type="button"
                                onClick={() => setTempFilterOptions({...tempFilterOptions, visitType: tempFilterOptions.visitType === 'Virtual' ? '' : 'Virtual'})}
                                className={`appointment-filter-type-btn ${tempFilterOptions.visitType === 'Virtual' ? 'active' : ''}`}
                              >
                                Virtual
                              </button>
                            </div>
                          </div>
                          <div className="appointment-filter-actions">
                            <button
                              type="button"
                              onClick={() => {
                                setFilterOptions({...tempFilterOptions})
                                setShowFilterDropdown(false)
                              }}
                              className="appointment-filter-apply-btn"
                            >
                              Filter
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTempFilterOptions({ appointmentType: '', visitType: '' })
                                setFilterOptions({ appointmentType: '', visitType: '' })
                                setShowFilterDropdown(false)
                              }}
                              className="appointment-filter-clear-btn"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      className="create-btn"
                      onClick={() => setShowAppointmentModal(true)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span>Create Appointment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Area - Table View */}
              <div className="appointment-content-area">
                {/* Today's Appointments */}
                <div className="appointment-section">
                  <h2 className="appointment-section-title">
                    Today's appointments ({todayAppointments.length})
                  </h2>
                  
                  <div className="appointment-table">
                    {/* Table Header */}
                    <div className="appointment-table-header">
                      <div 
                        className="appointment-table-col appointment-col-name appointment-sortable" 
                        onClick={() => handleSort('patientName')}
                      >
                        Patient Name
                        {sortConfig.key === 'patientName' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-therapy appointment-sortable" 
                        onClick={() => handleSort('appointmentType')}
                      >
                        Type of appointment
                        {sortConfig.key === 'appointmentType' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-contact appointment-sortable" 
                        onClick={() => handleSort('visitType')}
                      >
                        Consultation Type
                        {sortConfig.key === 'visitType' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-status appointment-sortable" 
                        onClick={() => handleSort('status')}
                      >
                        Status
                        {sortConfig.key === 'status' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-time appointment-sortable" 
                        onClick={() => handleSort('time')}
                      >
                        Appointment time
                        {sortConfig.key === 'time' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div className="appointment-table-col appointment-col-actions"></div>
                    </div>

                    {/* Table Body */}
                    {todayAppointments.map((apt) => (
                      <div 
                        key={apt.id} 
                        className={`appointment-table-row ${apt.status === 'Ongoing' ? 'appointment-row-ongoing' : ''}`}
                      >
                        <div className="appointment-table-col appointment-col-name">
                          <div className="appointment-client-info">
                            <div className={`appointment-dot ${getDotColor(apt)}`}></div>
                            <div>
                              <div className={`appointment-client-name ${getTextColor(apt.status)}`}>
                                {apt.patientName}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`appointment-table-col appointment-col-therapy ${getTextColor(apt.status)}`}>{apt.appointmentType}</div>
                        <div className={`appointment-table-col appointment-col-contact ${getTextColor(apt.status)}`}>{apt.visitType}</div>
                        <div className={`appointment-table-col appointment-col-status ${getStatusColor(apt.status)}`}>
                          {editingStatusId === apt.id ? (
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              onBlur={() => setEditingStatusId(null)}
                              className="appointment-status-select"
                              autoFocus
                            >
                              <option value="Done">Done</option>
                              <option value="Postponed">Postponed</option>
                              <option value="No show">No show</option>
                            </select>
                          ) : (
                            <span>{apt.status}</span>
                          )}
                        </div>
                        <div className={`appointment-table-col appointment-col-time ${getTextColor(apt.status)} appointment-time-bold`}>{apt.time}</div>
                        <div className="appointment-table-col appointment-col-actions">
                          <div className="appointment-more-wrapper">
                            <button 
                              className="appointment-more-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === apt.id ? null : apt.id)
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="12" cy="5" r="1"/>
                                <circle cx="12" cy="19" r="1"/>
                              </svg>
                            </button>
                            {openMenuId === apt.id && (
                              <div className="appointment-action-menu">
                                <button 
                                  className="appointment-action-menu-item"
                                  onClick={() => handleViewPatient(apt)}
                                >
                                  View patient
                                </button>
                                <button 
                                  className="appointment-action-menu-item"
                                  onClick={() => handleUpdateStatus(apt.id)}
                                >
                                  Update status
                                </button>
                                <button 
                                  className="appointment-action-menu-item appointment-action-menu-item-danger"
                                  onClick={() => handleDeleteAppointment(apt)}
                                >
                                  Delete Appointment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tomorrow's Appointments */}
                <div className="appointment-section">
                  <h2 className="appointment-section-title">
                    Tomorrow's appointments ({tomorrowAppointments.length})
                  </h2>
                  
                  <div className="appointment-table">
                    {/* Table Header */}
                    <div className="appointment-table-header">
                      <div 
                        className="appointment-table-col appointment-col-name appointment-sortable" 
                        onClick={() => handleSort('patientName')}
                      >
                        Patient Name
                        {sortConfig.key === 'patientName' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-therapy appointment-sortable" 
                        onClick={() => handleSort('appointmentType')}
                      >
                        Type of appointment
                        {sortConfig.key === 'appointmentType' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-contact appointment-sortable" 
                        onClick={() => handleSort('visitType')}
                      >
                        Consultation Type
                        {sortConfig.key === 'visitType' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-status appointment-sortable" 
                        onClick={() => handleSort('status')}
                      >
                        Status
                        {sortConfig.key === 'status' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div 
                        className="appointment-table-col appointment-col-time appointment-sortable" 
                        onClick={() => handleSort('time')}
                      >
                        Appointment time
                        {sortConfig.key === 'time' && (
                          <svg className="appointment-sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {sortConfig.direction === 'asc' ? (
                              <polyline points="18 15 12 9 6 15"/>
                            ) : (
                              <polyline points="6 9 12 15 18 9"/>
                            )}
                          </svg>
                        )}
                      </div>
                      <div className="appointment-table-col appointment-col-actions"></div>
                    </div>

                    {/* Table Body */}
                    {tomorrowAppointments.map((apt) => (
                      <div 
                        key={apt.id} 
                        className="appointment-table-row"
                      >
                        <div className="appointment-table-col appointment-col-name">
                          <div className="appointment-client-info">
                            <div className="appointment-dot appointment-dot-pink"></div>
                            <div>
                              <div className="appointment-client-name appointment-text-dark">
                                {apt.patientName}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="appointment-table-col appointment-col-therapy appointment-text-dark">{apt.appointmentType}</div>
                        <div className="appointment-table-col appointment-col-contact appointment-text-dark">{apt.visitType}</div>
                        <div className="appointment-table-col appointment-col-status appointment-status-scheduled">
                          {editingStatusId === apt.id ? (
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              onBlur={() => setEditingStatusId(null)}
                              className="appointment-status-select"
                              autoFocus
                            >
                              <option value="Done">Done</option>
                              <option value="Postponed">Postponed</option>
                              <option value="No show">No show</option>
                            </select>
                          ) : (
                            <span>{apt.status}</span>
                          )}
                        </div>
                        <div className="appointment-table-col appointment-col-time appointment-text-dark appointment-time-bold">{apt.time}</div>
                        <div className="appointment-table-col appointment-col-actions">
                          <div className="appointment-more-wrapper">
                            <button 
                              className="appointment-more-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === apt.id ? null : apt.id)
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="12" cy="5" r="1"/>
                                <circle cx="12" cy="19" r="1"/>
                              </svg>
                            </button>
                            {openMenuId === apt.id && (
                              <div className="appointment-action-menu">
                                <button 
                                  className="appointment-action-menu-item"
                                  onClick={() => handleViewPatient(apt)}
                                >
                                  View patient
                                </button>
                                <button 
                                  className="appointment-action-menu-item"
                                  onClick={() => handleUpdateStatus(apt.id)}
                                >
                                  Update status
                                </button>
                                <button 
                                  className="appointment-action-menu-item appointment-action-menu-item-danger"
                                  onClick={() => handleDeleteAppointment(apt)}
                                >
                                  Delete Appointment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Appointment Modal */}
              {showAppointmentModal && (
                <div className="appointment-modal-overlay" onClick={handleCloseAppointmentModal}>
                  <div className="appointment-modal-container" onClick={(e) => e.stopPropagation()}>
                    {/* Header with Close Button */}
                    <div className="appointment-modal-header">
                      <h2 className="appointment-modal-title">Appointment Schedule</h2>
                      <button
                        onClick={handleCloseAppointmentModal}
                        className="appointment-modal-close"
                        type="button"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <div className="appointment-modal-body">
                      <form onSubmit={handleAppointmentSubmit} className="appointment-form-container">
                        {/* Patient Name */}
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">
                            Patient Name
                          </label>
                          <input 
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Enter patient name"
                            className="appointment-form-input"
                            required
                          />
                        </div>

                        {/* Type of Appointment and Date Selection */}
                        <div className="appointment-form-row">
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">
                              Type of Appointment
                            </label>
                            <select 
                              value={appointmentType}
                              onChange={(e) => setAppointmentType(e.target.value)}
                              className="appointment-form-input appointment-form-select"
                            >
                              {appointmentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>

                          {/* Date Selection */}
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">
                              Available Date for Appointment
                            </label>
                            <div className="appointment-date-wrapper">
                              <input 
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="appointment-form-input appointment-date-input"
                                required
                              />
                              <svg className="appointment-calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Time Selection */}
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">
                            Available Time for Appointment
                          </label>
                          <div className="appointment-time-grid">
                            {availableTimes.map(time => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTimeSlot(time)}
                                className={`appointment-time-btn ${selectedTimeSlot === time ? 'active' : ''}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Visit Type */}
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">
                            Consultation Type
                          </label>
                          <div className="appointment-visit-type-group">
                            <button
                              type="button"
                              onClick={() => setVisitType('In-person')}
                              className={`appointment-visit-type-btn ${visitType === 'In-person' ? 'active' : ''}`}
                            >
                              In-person
                            </button>
                            <button
                              type="button"
                              onClick={() => setVisitType('Virtual')}
                              className={`appointment-visit-type-btn ${visitType === 'Virtual' ? 'active' : ''}`}
                            >
                              Virtual
                            </button>
                          </div>
                        </div>

                        {/* Patient Notes */}
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">
                            Patient Notes
                          </label>
                          <textarea 
                            value={reasonText}
                            onChange={(e) => setReasonText(e.target.value)}
                            rows={4}
                            className="appointment-form-textarea"
                            placeholder="Enter patient notes..."
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="appointment-submit-btn"
                        >
                          Confirm appointment
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* View Patient Modal */}
              {showViewPatientModal && selectedPatient && (
                <div className="appointment-modal-overlay" onClick={handleClosePatientModal}>
                  <div className="appointment-modal-container patient-view-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="appointment-modal-header">
                      <h2 className="appointment-modal-title">
                        {patientModalStep === 1 && 'General Information'}
                        {patientModalStep === 2 && 'Clinical Measurements'}
                        {patientModalStep === 3 && 'Medical History'}
                        {patientModalStep === 4 && 'Current Medication'}
                      </h2>
                      <button
                        onClick={handleClosePatientModal}
                        className="appointment-modal-close"
                        type="button"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Stepper */}
                    <div className="patient-modal-stepper">
                      <div className={`stepper-step ${patientModalStep >= 1 ? 'active' : ''} ${patientModalStep === 1 ? 'current' : ''}`}>
                        <div className="stepper-circle">1</div>
                        <div className="stepper-label">General Info</div>
                      </div>
                      <div className={`stepper-line ${patientModalStep >= 2 ? 'active' : ''}`}></div>
                      <div className={`stepper-step ${patientModalStep >= 2 ? 'active' : ''} ${patientModalStep === 2 ? 'current' : ''}`}>
                        <div className="stepper-circle">2</div>
                        <div className="stepper-label">Measurements</div>
                      </div>
                      <div className={`stepper-line ${patientModalStep >= 3 ? 'active' : ''}`}></div>
                      <div className={`stepper-step ${patientModalStep >= 3 ? 'active' : ''} ${patientModalStep === 3 ? 'current' : ''}`}>
                        <div className="stepper-circle">3</div>
                        <div className="stepper-label">History</div>
                      </div>
                      <div className={`stepper-line ${patientModalStep >= 4 ? 'active' : ''}`}></div>
                      <div className={`stepper-step ${patientModalStep >= 4 ? 'active' : ''} ${patientModalStep === 4 ? 'current' : ''}`}>
                        <div className="stepper-circle">4</div>
                        <div className="stepper-label">Medication</div>
                      </div>
                    </div>
                    
                    <div className="appointment-modal-body">
                      <div className="appointment-form-container">
                        {/* Step 1: General Information */}
                        {patientModalStep === 1 && (
                          <>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Patient Name</label>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  className="appointment-form-input"
                                  value={patientFormData.name}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.name}
                                </div>
                              )}
                            </div>
                            <div className="appointment-form-row">
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Gender</label>
                                {isEditMode ? (
                                  <select
                                    className="appointment-form-input"
                                    value={patientFormData.gender}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, gender: e.target.value }))}
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                ) : (
                                  <div className="appointment-form-input appointment-form-readonly">
                                    {patientFormData.gender}
                                  </div>
                                )}
                              </div>
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Age</label>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    className="appointment-form-input"
                                    value={patientFormData.age}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, age: e.target.value }))}
                                    placeholder="Enter age"
                                  />
                                ) : (
                                  <div className="appointment-form-input appointment-form-readonly">
                                    {patientFormData.age}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Address</label>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  className="appointment-form-input"
                                  value={patientFormData.address}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, address: e.target.value }))}
                                />
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.address}
                                </div>
                              )}
                            </div>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Registered Date</label>
                              {isEditMode ? (
                                <input
                                  type="date"
                                  className="appointment-form-input"
                                  value={patientFormData.registeredDate}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, registeredDate: e.target.value }))}
                                />
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.registeredDate ? new Date(patientFormData.registeredDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  }) : ''}
                                </div>
                              )}
                            </div>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Disease</label>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  className="appointment-form-input"
                                  value={patientFormData.disease}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, disease: e.target.value }))}
                                />
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.disease}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        
                        {/* Step 2: Clinical Measurements */}
                        {patientModalStep === 2 && (
                          <>
                            <div className="appointment-form-row">
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Weight</label>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    className="appointment-form-input"
                                    value={patientFormData.weight}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, weight: e.target.value }))}
                                    placeholder="Enter weight (kg)"
                                  />
                                ) : (
                                  <div className="appointment-form-input appointment-form-readonly">
                                    {patientFormData.weight || '-'}
                                  </div>
                                )}
                              </div>
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Height</label>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    className="appointment-form-input"
                                    value={patientFormData.height}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, height: e.target.value }))}
                                    placeholder="Enter height (cm)"
                                  />
                                ) : (
                                  <div className="appointment-form-input appointment-form-readonly">
                                    {patientFormData.height || '-'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="appointment-form-row">
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">BMI</label>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    className="appointment-form-input"
                                    value={patientFormData.bmi}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, bmi: e.target.value }))}
                                    placeholder="Enter BMI"
                                  />
                                ) : (
                                  <div className="appointment-form-input appointment-form-readonly">
                                    {patientFormData.bmi || '-'}
                                  </div>
                                )}
                              </div>
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Body Temperature</label>
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    className="appointment-form-input"
                                    value={patientFormData.bodyTemperature}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, bodyTemperature: e.target.value }))}
                                    placeholder="Enter temperature (°C)"
                                  />
                                ) : (
                                  <div className="appointment-form-input appointment-form-readonly">
                                    {patientFormData.bodyTemperature || '-'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Heart Rate</label>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  className="appointment-form-input"
                                  value={patientFormData.heartRate}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                                  placeholder="Enter heart rate (bpm)"
                                />
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.heartRate || '-'}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        
                        {/* Step 3: Medical History */}
                        {patientModalStep === 3 && (
                          <>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Chronic Conditions</label>
                              {isEditMode ? (
                                <>
                                  <select
                                    className="appointment-form-input"
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddChronicCondition(e.target.value)
                                        e.target.value = ''
                                      }
                                    }}
                                    disabled={patientFormData.chronicConditions.length >= 5}
                                  >
                                    <option value="">Select condition (Max 5)</option>
                                    {chronicConditionsOptions
                                      .filter(opt => !patientFormData.chronicConditions.includes(opt))
                                      .map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                  </select>
                                  {patientFormData.chronicConditions.length > 0 && (
                                    <div className="badge-container">
                                      {patientFormData.chronicConditions.map(condition => (
                                        <span key={condition} className="badge-item">
                                          {condition}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveChronicCondition(condition)}
                                            className="badge-remove"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.chronicConditions.length > 0 
                                    ? patientFormData.chronicConditions.join(', ')
                                    : '-'}
                                </div>
                              )}
                            </div>
                            
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Past Major Illnesses</label>
                              {isEditMode ? (
                                <>
                                  <div className="radio-group">
                                    <label className="radio-label">
                                      <input
                                        type="radio"
                                        name="pastMajorIllnesses"
                                        value="Yes"
                                        checked={patientFormData.pastMajorIllnesses === 'Yes'}
                                        onChange={(e) => setPatientFormData(prev => ({ ...prev, pastMajorIllnesses: e.target.value }))}
                                      />
                                      <span>Yes</span>
                                    </label>
                                    <label className="radio-label">
                                      <input
                                        type="radio"
                                        name="pastMajorIllnesses"
                                        value="No"
                                        checked={patientFormData.pastMajorIllnesses === 'No'}
                                        onChange={(e) => setPatientFormData(prev => ({ ...prev, pastMajorIllnesses: e.target.value, pastMajorIllnessesDetails: '' }))}
                                      />
                                      <span>No</span>
                                    </label>
                                  </div>
                                  {patientFormData.pastMajorIllnesses === 'Yes' && (
                                    <input
                                      type="text"
                                      className="appointment-form-input"
                                      style={{ marginTop: '12px' }}
                                      value={patientFormData.pastMajorIllnessesDetails}
                                      onChange={(e) => setPatientFormData(prev => ({ ...prev, pastMajorIllnessesDetails: e.target.value }))}
                                      placeholder="Please specify"
                                    />
                                  )}
                                </>
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.pastMajorIllnesses === 'Yes' 
                                    ? (patientFormData.pastMajorIllnessesDetails || 'Yes')
                                    : 'No'}
                                </div>
                              )}
                            </div>
                            
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Previous Surgeries or Procedures</label>
                              {isEditMode ? (
                                <div className="radio-group">
                                  <label className="radio-label">
                                    <input
                                      type="radio"
                                      name="previousSurgeries"
                                      value="Yes"
                                      checked={patientFormData.previousSurgeries === 'Yes'}
                                      onChange={(e) => setPatientFormData(prev => ({ ...prev, previousSurgeries: e.target.value }))}
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="radio-label">
                                    <input
                                      type="radio"
                                      name="previousSurgeries"
                                      value="No"
                                      checked={patientFormData.previousSurgeries === 'No'}
                                      onChange={(e) => setPatientFormData(prev => ({ ...prev, previousSurgeries: e.target.value }))}
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.previousSurgeries}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        
                        {/* Step 4: Current Medication */}
                        {patientModalStep === 4 && (
                          <>
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Prescription Drugs</label>
                              {isEditMode ? (
                                <>
                                  <select
                                    className="appointment-form-input"
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddPrescriptionDrug(e.target.value)
                                        e.target.value = ''
                                      }
                                    }}
                                    disabled={patientFormData.prescriptionDrugs.length >= 5}
                                  >
                                    <option value="">Select drug (Max 5)</option>
                                    {prescriptionDrugsOptions
                                      .filter(opt => !patientFormData.prescriptionDrugs.includes(opt))
                                      .map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                  </select>
                                  {patientFormData.prescriptionDrugs.length > 0 && (
                                    <div className="badge-container">
                                      {patientFormData.prescriptionDrugs.map(drug => (
                                        <span key={drug} className="badge-item">
                                          {drug}
                                          <button
                                            type="button"
                                            onClick={() => handleRemovePrescriptionDrug(drug)}
                                            className="badge-remove"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.prescriptionDrugs.length > 0 
                                    ? patientFormData.prescriptionDrugs.join(', ')
                                    : '-'}
                                </div>
                              )}
                            </div>
                            
                            <div className="appointment-form-field">
                              <label className="appointment-form-label">Over-the-counter Meds</label>
                              {isEditMode ? (
                                <>
                                  <select
                                    className="appointment-form-input"
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddOverTheCounterMed(e.target.value)
                                        e.target.value = ''
                                      }
                                    }}
                                    disabled={patientFormData.overTheCounterMeds.length >= 5}
                                  >
                                    <option value="">Select medication (Max 5)</option>
                                    {overTheCounterMedsOptions
                                      .filter(opt => !patientFormData.overTheCounterMeds.includes(opt))
                                      .map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                  </select>
                                  {patientFormData.overTheCounterMeds.length > 0 && (
                                    <div className="badge-container">
                                      {patientFormData.overTheCounterMeds.map(med => (
                                        <span key={med} className="badge-item">
                                          {med}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveOverTheCounterMed(med)}
                                            className="badge-remove"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.overTheCounterMeds.length > 0 
                                    ? patientFormData.overTheCounterMeds.join(', ')
                                    : '-'}
                                </div>
                              )}
                            </div>
                            
                            {isEditMode && (
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Notes</label>
                                <textarea
                                  className="appointment-form-input"
                                  rows="4"
                                  value={patientFormData.medicationNotes}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, medicationNotes: e.target.value }))}
                                  placeholder="Add any additional notes about medications..."
                                />
                              </div>
                            )}
                            
                            {!isEditMode && patientFormData.medicationNotes && (
                              <div className="appointment-form-field">
                                <label className="appointment-form-label">Notes</label>
                                <div className="appointment-form-input appointment-form-readonly">
                                  {patientFormData.medicationNotes}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="appointment-form-actions">
                          {patientModalStep === 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => isEditMode ? handleSavePatientData() : setIsEditMode(true)}
                                className="appointment-edit-btn"
                              >
                                {isEditMode ? 'Save Changes' : 'Edit Information'}
                              </button>
                              <button
                                type="button"
                                onClick={handleNextStep}
                                className="appointment-next-btn"
                              >
                                Next
                              </button>
                            </>
                          )}
                          {patientModalStep === 2 && (
                            <>
                              <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="appointment-prev-btn"
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                onClick={() => isEditMode ? handleSavePatientData() : setIsEditMode(true)}
                                className="appointment-edit-btn"
                              >
                                {isEditMode ? 'Save Changes' : 'Edit Information'}
                              </button>
                              <button
                                type="button"
                                onClick={handleNextStep}
                                className="appointment-next-btn"
                              >
                                Next
                              </button>
                            </>
                          )}
                          {patientModalStep === 3 && (
                            <>
                              <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="appointment-prev-btn"
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                onClick={() => isEditMode ? handleSavePatientData() : setIsEditMode(true)}
                                className="appointment-edit-btn"
                              >
                                {isEditMode ? 'Save Changes' : 'Edit Information'}
                              </button>
                              <button
                                type="button"
                                onClick={handleNextStep}
                                className="appointment-next-btn"
                              >
                                Next
                              </button>
                            </>
                          )}
                          {patientModalStep === 4 && (
                            <>
                              <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="appointment-prev-btn"
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                onClick={() => isEditMode ? handleSavePatientData() : setIsEditMode(true)}
                                className="appointment-edit-btn"
                              >
                                {isEditMode ? 'Save Changes' : 'Edit Information'}
                              </button>
                              <button
                                type="button"
                                onClick={handleClosePatientModal}
                                className="appointment-close-btn"
                              >
                                Close
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteModal && appointmentToDelete && (
                <div className="appointment-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                  <div className="appointment-delete-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="appointment-delete-header">
                      <h3 className="appointment-delete-title">Delete Appointment</h3>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="appointment-modal-close"
                        type="button"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <div className="appointment-delete-body">
                      <p className="appointment-delete-message">
                        Are you sure you want to delete the appointment for <strong>{appointmentToDelete.patientName || appointmentToDelete.name}</strong>?
                      </p>
                      <p className="appointment-delete-warning">This action cannot be undone.</p>
                    </div>
                    <div className="appointment-delete-actions">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(false)}
                        className="appointment-delete-cancel-btn"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmDelete}
                        className="appointment-delete-confirm-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {dashboardView === 'food-classes' && (
            <div className="view-container">
              <div className="food-classes-header">
                <h2 className="view-title">Food Classes</h2>
                <p className="food-classes-subtitle">A balanced approach to healthy eating</p>
              </div>
              
              <div className="food-classes-grid">
                {/* Base Level - Grains */}
                <div className="food-group-card food-group-large" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                  <div className="food-group-icon" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="9" y1="3" x2="9" y2="21"/>
                      <line x1="15" y1="3" x2="15" y2="21"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="3" y1="15" x2="21" y2="15"/>
                    </svg>
                  </div>
                  <div className="food-group-content">
                    <h3 className="food-group-title">Grains & Cereals</h3>
                    <p className="food-group-servings">6-11 servings daily</p>
                    <p className="food-group-description">Bread, Cereal, Rice & Pasta - Foundation of your diet</p>
                  </div>
                </div>

                {/* Second Level - Fruits & Vegetables */}
                <div className="food-group-card food-group-medium" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
                  <div className="food-group-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="food-group-content">
                    <h3 className="food-group-title">Vegetables</h3>
                    <p className="food-group-servings">3-5 servings daily</p>
                    <p className="food-group-description">Essential vitamins and minerals</p>
                  </div>
                </div>

                <div className="food-group-card food-group-medium" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
                  <div className="food-group-icon" style={{ background: 'rgba(236, 72, 153, 0.2)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="food-group-content">
                    <h3 className="food-group-title">Fruits</h3>
                    <p className="food-group-servings">2-4 servings daily</p>
                    <p className="food-group-description">Natural sugars and fiber</p>
                  </div>
                </div>

                {/* Third Level - Protein & Dairy */}
                <div className="food-group-card food-group-small" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
                  <div className="food-group-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div className="food-group-content">
                    <h3 className="food-group-title">Dairy</h3>
                    <p className="food-group-servings">2-3 servings daily</p>
                    <p className="food-group-description">Milk, Yogurt & Cheese</p>
                  </div>
                </div>

                <div className="food-group-card food-group-small" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' }}>
                  <div className="food-group-icon" style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="food-group-content">
                    <h3 className="food-group-title">Protein</h3>
                    <p className="food-group-servings">2-3 servings daily</p>
                    <p className="food-group-description">Meat, Poultry, Fish, Beans & Nuts</p>
                  </div>
                </div>

                {/* Top Level - Fats & Oils */}
                <div className="food-group-card food-group-minimal" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' }}>
                  <div className="food-group-icon" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="6"/>
                      <circle cx="12" cy="12" r="2"/>
                    </svg>
                  </div>
                  <div className="food-group-content">
                    <h3 className="food-group-title">Fats & Oils</h3>
                    <p className="food-group-servings">Use Sparingly</p>
                    <p className="food-group-description">Essential but in moderation</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dashboardView === 'meal-plan' && (
            <div className="view-container">
              <div className="view-header">
                <h2 className="view-title">Meal Plan</h2>
                <button 
                  className="create-btn"
                  onClick={() => setShowMealPlanModal(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Create Meal Plan</span>
                </button>
              </div>

              {/* Recipes Section */}
              <div className="recipes-section">
                <div className="section-header">
                  <h3 className="section-title">Recipes</h3>
                  <a href="#" className="see-all-link">See All →</a>
                </div>
                <div className="recipes-grid">
                  <div className="recipe-card">
                    <div className="recipe-icon breakfast-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <span className="recipe-label">Breakfast</span>
                  </div>
                  <div className="recipe-card">
                    <div className="recipe-icon lunch-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <span className="recipe-label">Lunch</span>
                  </div>
                  <div className="recipe-card">
                    <div className="recipe-icon snack-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="recipe-label">Snack</span>
                  </div>
                  <div className="recipe-card">
                    <div className="recipe-icon dinner-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="3" x2="9" y2="21"/>
                        <line x1="15" y1="3" x2="15" y2="21"/>
                      </svg>
                    </div>
                    <span className="recipe-label">Dinner</span>
                  </div>
                </div>
              </div>

              {/* Meal Plan for Today Section */}
              <div className="meal-plan-section">
                <div className="section-header">
                  <div className="meal-tabs">
                    <button 
                      className={`meal-tab ${activeMealTab === 'breakfast' ? 'active' : ''}`}
                      onClick={() => setActiveMealTab('breakfast')}
                    >
                      Breakfast
                    </button>
                    <button 
                      className={`meal-tab ${activeMealTab === 'lunch' ? 'active' : ''}`}
                      onClick={() => setActiveMealTab('lunch')}
                    >
                      Lunch
                    </button>
                    <button 
                      className={`meal-tab ${activeMealTab === 'snack' ? 'active' : ''}`}
                      onClick={() => setActiveMealTab('snack')}
                    >
                      Snack
                    </button>
                    <button 
                      className={`meal-tab ${activeMealTab === 'dinner' ? 'active' : ''}`}
                      onClick={() => setActiveMealTab('dinner')}
                    >
                      Dinner
                    </button>
                  </div>
                  <a href="#" className="see-all-link">See All →</a>
                </div>

                <div className="meal-detail-card">
                  <div className="meal-image">
                    <div className="meal-image-placeholder">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  <div className="meal-content">
                    <div className="meal-header">
                      <div>
                        <span className="meal-type">{activeMealTab.charAt(0).toUpperCase() + activeMealTab.slice(1)}</span>
                        <h3 className="meal-name">Egg on Toast</h3>
                        <div className="meal-rating">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                    <p className="meal-description">
                      Self-care is an act of taking care of yourself physically, mentally, and emotionally. Research shows that acts of self-care can improve your health, lead to better productivity, and help prevent burnout.
                    </p>
                    <div className="food-rating-bar">
                      <div className="rating-label">
                        <span>Food rating</span>
                        <span className="rating-grade">Very Good</span>
                      </div>
                      <div className="rating-bar">
                        <div className="rating-fill" style={{ width: '85%' }}></div>
                        <span className="rating-letter">A</span>
                      </div>
                    </div>
                    <div className="nutrition-grid">
                      <div className="nutrition-item">
                        <span className="nutrition-label">Protein</span>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{ width: '40%' }}></div>
                        </div>
                        <span className="nutrition-value">40g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Fat</span>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{ width: '25%' }}></div>
                        </div>
                        <span className="nutrition-value">30g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Carbs</span>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{ width: '20%' }}></div>
                        </div>
                        <span className="nutrition-value">25g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Fiber</span>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{ width: '10%' }}></div>
                        </div>
                        <span className="nutrition-value">15g</span>
                      </div>
                    </div>
                    <div className="ingredients-list">
                      <div className="ingredient-item">
                        <div className="ingredient-icon">🥑</div>
                        <span>Avocado 100g</span>
                      </div>
                      <div className="ingredient-item">
                        <div className="ingredient-icon">🍞</div>
                        <span>Sourdough 100g</span>
                      </div>
                      <div className="ingredient-item">
                        <div className="ingredient-icon">🥚</div>
                        <span>Egg 1pcs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Plan Modal */}
              {showMealPlanModal && (
                <div className="modal-overlay" onClick={() => setShowMealPlanModal(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Create Meal Plan</h3>
                      <button className="modal-close" onClick={() => setShowMealPlanModal(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <form className="meal-plan-form modern-form">
                      <div className="form-group modern-form-group">
                        <label className="modern-label">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                          Plan Name
                        </label>
                        <div className="input-wrapper-modern">
                          <input type="text" className="modern-input" placeholder="Enter meal plan name" />
                        </div>
                      </div>
                      <div className="form-group modern-form-group">
                        <label className="modern-label">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          Duration (days)
                        </label>
                        <div className="input-wrapper-modern">
                          <input type="number" className="modern-input" placeholder="Number of days" min="1" />
                        </div>
                      </div>
                      <div className="form-group modern-form-group">
                        <label className="modern-label">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                          </svg>
                          Daily Meals
                        </label>
                        <div className="textarea-wrapper-modern">
                          <textarea rows="6" className="modern-textarea" placeholder="Enter breakfast, lunch, dinner, snacks..."></textarea>
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary modern-btn-secondary" onClick={() => setShowMealPlanModal(false)}>Cancel</button>
                        <button type="submit" className="submit-btn modern-btn-primary" onClick={(e) => { e.preventDefault(); setShowMealPlanModal(false); }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Create Meal Plan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {dashboardView === 'exercise-plan' && (
            <div className="view-container">
              <div className="view-header">
                <h2 className="view-title">Exercise Plan</h2>
                <button 
                  className="create-btn"
                  onClick={() => setShowExercisePlanModal(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Create Exercise Plan</span>
                </button>
              </div>

              {/* Exercise Plan Modal */}
              {showExercisePlanModal && (
                <div className="modal-overlay" onClick={() => setShowExercisePlanModal(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Create Exercise Plan</h3>
                      <button className="modal-close" onClick={() => setShowExercisePlanModal(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <form className="exercise-plan-form modern-form">
                      <div className="form-group modern-form-group">
                        <label className="modern-label">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                          Plan Name
                        </label>
                        <div className="input-wrapper-modern">
                          <input type="text" className="modern-input" placeholder="Enter exercise plan name" />
                        </div>
                      </div>
                      <div className="form-group modern-form-group">
                        <label className="modern-label">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          Duration (weeks)
                        </label>
                        <div className="input-wrapper-modern">
                          <input type="number" className="modern-input" placeholder="Number of weeks" min="1" />
                        </div>
                      </div>
                      <div className="form-group modern-form-group">
                        <label className="modern-label">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
                          </svg>
                          Weekly Schedule
                        </label>
                        <div className="textarea-wrapper-modern">
                          <textarea rows="6" className="modern-textarea" placeholder="Enter daily exercises and routines..."></textarea>
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary modern-btn-secondary" onClick={() => setShowExercisePlanModal(false)}>Cancel</button>
                        <button type="submit" className="submit-btn modern-btn-primary" onClick={(e) => { e.preventDefault(); setShowExercisePlanModal(false); }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Create Exercise Plan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {dashboardView === 'patients' && (
            <div className="view-container">
              <div className="view-header">
                <h2 className="view-title">Patients</h2>
                <button 
                  className="create-btn"
                  onClick={() => alert('Create Patient clicked')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add Patient</span>
                </button>
              </div>
              <div className="patients-list">
                <div className="patient-item">
                  <div className="patient-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="patient-details">
                    <h3>John Doe</h3>
                    <p>Age: 45 | Gender: Male</p>
                    <p className="patient-contact">Email: john.doe@example.com</p>
                  </div>
                  <div className="patient-actions">
                    <button className="patient-action-btn">View</button>
                    <button className="patient-action-btn">Edit</button>
                  </div>
                </div>
                <div className="patient-item">
                  <div className="patient-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="patient-details">
                    <h3>Mary Smith</h3>
                    <p>Age: 38 | Gender: Female</p>
                    <p className="patient-contact">Email: mary.smith@example.com</p>
                  </div>
                  <div className="patient-actions">
                    <button className="patient-action-btn">View</button>
                    <button className="patient-action-btn">Edit</button>
                  </div>
                </div>
                <div className="patient-item">
                  <div className="patient-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="patient-details">
                    <h3>Sarah Johnson</h3>
                    <p>Age: 52 | Gender: Female</p>
                    <p className="patient-contact">Email: sarah.johnson@example.com</p>
                  </div>
                  <div className="patient-actions">
                    <button className="patient-action-btn">View</button>
                    <button className="patient-action-btn">Edit</button>
                  </div>
                </div>
                <div className="patient-item">
                  <div className="patient-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="patient-details">
                    <h3>Michael Brown</h3>
                    <p>Age: 34 | Gender: Male</p>
                    <p className="patient-contact">Email: michael.brown@example.com</p>
                  </div>
                  <div className="patient-actions">
                    <button className="patient-action-btn">View</button>
                    <button className="patient-action-btn">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dashboardView === 'settings' && (
            <div className="view-container">
              <h2 className="view-title">Settings</h2>
              <div className="settings-menu">
                <button className="settings-item" onClick={() => alert('Change Profile clicked')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Change Profile</span>
                </button>
                <button className="settings-item" onClick={() => alert('Change Password clicked')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Change Password</span>
                </button>
                <button className="settings-item" onClick={() => alert('Unbind Email clicked')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>Unbind Email</span>
                </button>
                <button 
                  className="settings-item settings-logout"
                  onClick={handleLogout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )

  return (
    <>
      {currentPage === 'main' ? renderMainPage() : currentPage === 'dashboard' ? renderDashboard() : renderLoginPage()}
    </>
  )
}

export default App

