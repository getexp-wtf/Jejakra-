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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState('')
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningModalConfig, setWarningModalConfig] = useState({ message: '', onConfirm: null })
  const [patientToDelete, setPatientToDelete] = useState(null)
  const [showPatientDeleteModal, setShowPatientDeleteModal] = useState(false)
  const [showAppointmentHistoryModal, setShowAppointmentHistoryModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState('')
  
  // Pagination States
  const [todayPage, setTodayPage] = useState(1)
  const [tomorrowPage, setTomorrowPage] = useState(1)
  const [patientsPage, setPatientsPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const PATIENTS_PER_PAGE = 10
  
  // Patients Page States
  const [patientSearch, setPatientSearch] = useState('')
  const [patientGenderFilter, setPatientGenderFilter] = useState('All')
  const [patientStatusFilter, setPatientStatusFilter] = useState('All')
  const [openPatientActionMenu, setOpenPatientActionMenu] = useState(null)
  const [showPatientFilterDropdown, setShowPatientFilterDropdown] = useState(false)
  const [patientAppointmentTypeFilter, setPatientAppointmentTypeFilter] = useState('All')
  const [patientConsultationTypeFilter, setPatientConsultationTypeFilter] = useState('All')
  const [patientDateFilterType, setPatientDateFilterType] = useState('all') // 'all', 'specific', 'range'
  const [patientDateFilterStart, setPatientDateFilterStart] = useState('')
  const [patientDateFilterEnd, setPatientDateFilterEnd] = useState('')
  
  // View Patient Modal states
  const [patientModalStep, setPatientModalStep] = useState(1) // 1: General Info, 2: Clinical Measurements, 3: Medical History, 4: Medication
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Create Patient Modal states
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false)
  const [createPatientStep, setCreatePatientStep] = useState(1)
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    gender: '',
    age: '',
    address: '',
    contactNumber: '',
    disease: '',
    weight: '',
    height: '',
    bmi: '',
    bodyTemperature: '',
    heartRate: '',
    chronicConditions: [],
    pastMajorIllnesses: 'No',
    pastMajorIllnessesDetails: '',
    previousSurgeries: 'No',
    prescriptionDrugs: [],
    overTheCounterMeds: [],
    medicationNotes: ''
  })
  
  // Settings page states
  const [settingsTab, setSettingsTab] = useState('security')
  const [twoStepVerification, setTwoStepVerification] = useState(true)
  const [userEmail, setUserEmail] = useState('alex.assenmacher@gmail.com')
  const [emailVerified, setEmailVerified] = useState(false)
  const [profileEditMode, setProfileEditMode] = useState(false)
  
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
    1: { name: 'Ahmad bin Abdullah', gender: 'Male', age: '45', address: 'No. 12, Jalan Ampang, 50450 Kuala Lumpur', registeredDate: '2020-01-15', lastVisit: '2024-01-08', lastVisitTime: '10:30 AM', nextAppointment: '2024-02-15', disease: 'Hypertension', contactNumber: '012-345-6701', status: 'Active' },
    2: { name: 'Siti Nurhaliza', gender: 'Female', age: '38', address: 'No. 45, Taman Tun Dr Ismail, 60000 Kuala Lumpur', registeredDate: '2019-11-20', lastVisit: '2024-01-05', lastVisitTime: '2:00 PM', nextAppointment: '2024-02-10', disease: 'Diabetes Type 2', contactNumber: '012-345-6702', status: 'Active' },
    3: { name: 'Muhammad Faiz', gender: 'Male', age: '52', address: 'No. 78, Bangsar South, 59200 Kuala Lumpur', registeredDate: '2020-02-10', lastVisit: '2024-01-02', lastVisitTime: '9:00 AM', nextAppointment: '2024-02-20', disease: 'Anxiety Disorder', contactNumber: '012-345-6703', status: 'Active' },
    4: { name: 'Nurul Ain', gender: 'Female', age: '34', address: 'No. 23, Jalan SS2/55, 47300 Petaling Jaya, Selangor', registeredDate: '2019-12-05', lastVisit: '2023-08-15', lastVisitTime: '11:30 AM', nextAppointment: null, disease: 'Chronic Pain', contactNumber: '012-345-6704', status: 'Inactive' },
    5: { name: 'Amirul Haziq', gender: 'Male', age: '29', address: 'No. 56, Seksyen 7, 40000 Shah Alam, Selangor', registeredDate: '2020-03-01', lastVisit: '2024-01-06', lastVisitTime: '3:30 PM', nextAppointment: '2024-02-08', disease: 'Asthma', contactNumber: '012-345-6705', status: 'Active' },
    6: { name: 'Fatimah Zahra', gender: 'Female', age: '41', address: 'No. 89, USJ 1, 47600 Subang Jaya, Selangor', registeredDate: '2019-10-12', lastVisit: null, lastVisitTime: null, nextAppointment: '2024-02-12', disease: 'Migraine', contactNumber: '012-345-6706', status: 'New' },
    7: { name: 'Hafiz Rahman', gender: 'Male', age: '36', address: 'No. 34, Taman Molek, 81100 Johor Bahru, Johor', registeredDate: '2020-01-25', lastVisit: '2024-01-03', lastVisitTime: '4:00 PM', nextAppointment: '2024-02-18', disease: 'Arthritis', contactNumber: '012-345-6707', status: 'Active' },
    8: { name: 'Aisyah Putri', gender: 'Female', age: '42', address: 'No. 67, Jalan Penang, 10050 George Town, Penang', registeredDate: '2019-09-18', lastVisit: null, lastVisitTime: null, nextAppointment: null, disease: 'Gastritis', contactNumber: '012-345-6708', status: 'Pending' },
    9: { name: 'Rizal bin Hassan', gender: 'Male', age: '39', address: 'No. 90, Jalan Ipoh, 51200 Kuala Lumpur', registeredDate: '2020-02-28', lastVisit: '2024-01-07', lastVisitTime: '10:00 AM', nextAppointment: '2024-02-25', disease: 'Insomnia', contactNumber: '012-345-6709', status: 'Active' },
    10: { name: 'Nadia Tan', gender: 'Female', age: '48', address: 'No. 15, Damansara Heights, 50490 Kuala Lumpur', registeredDate: '2019-08-22', lastVisit: '2023-06-20', lastVisitTime: '1:30 PM', nextAppointment: null, disease: 'Obesity', contactNumber: '012-345-6710', status: 'Inactive' },
    11: { name: 'Kelvin Wong', gender: 'Male', age: '55', address: 'No. 28, Bukit Bintang, 55100 Kuala Lumpur', registeredDate: '2019-07-14', lastVisit: '2024-01-04', lastVisitTime: '11:00 AM', nextAppointment: '2024-02-22', disease: 'Heart Disease', contactNumber: '012-345-6711', status: 'Active' },
    12: { name: 'Michelle Lee', gender: 'Female', age: '50', address: 'No. 41, Mont Kiara, 50480 Kuala Lumpur', registeredDate: '2020-01-08', lastVisit: '2022-12-10', lastVisitTime: '9:30 AM', nextAppointment: null, disease: 'Fibromyalgia', contactNumber: '012-345-6712', status: 'Archived' },
    13: { name: 'Priya Kumari', gender: 'Female', age: '40', address: 'No. 54, Brickfields, 50470 Kuala Lumpur', registeredDate: '2019-06-30', lastVisit: '2024-01-01', lastVisitTime: '2:30 PM', nextAppointment: '2024-02-05', disease: 'Allergies', contactNumber: '012-345-6713', status: 'Active' },
    14: { name: 'Ravi Kumar', gender: 'Male', age: '31', address: 'No. 77, Klang, 41150 Selangor', registeredDate: '2020-03-10', lastVisit: null, lastVisitTime: null, nextAppointment: '2024-02-14', disease: 'GERD', contactNumber: '012-345-6714', status: 'New' },
    15: { name: 'Sarah Abdullah', gender: 'Female', age: '33', address: 'No. 100, Cyberjaya, 63000 Selangor', registeredDate: '2019-11-05', lastVisit: '2023-12-28', lastVisitTime: '4:30 PM', nextAppointment: '2024-02-28', disease: 'Stress Disorder', contactNumber: '012-345-6715', status: 'Active' },
    16: { name: 'Zulkifli bin Omar', gender: 'Male', age: '46', address: 'No. 13, Putrajaya, 62000 Wilayah Persekutuan', registeredDate: '2019-10-20', lastVisit: null, lastVisitTime: null, nextAppointment: null, disease: 'Depression', contactNumber: '012-345-6716', status: 'Pending' },
    17: { name: 'Kartini Salleh', gender: 'Female', age: '47', address: 'No. 26, Kota Kinabalu, 88000 Sabah', registeredDate: '2020-02-15', lastVisit: '2024-01-02', lastVisitTime: '10:30 AM', nextAppointment: '2024-02-16', disease: 'Liver Issues', contactNumber: '012-345-6717', status: 'Active' },
    18: { name: 'Ismail bin Yusof', gender: 'Male', age: '62', address: 'No. 39, Kuching, 93000 Sarawak', registeredDate: '2019-05-25', lastVisit: '2021-03-15', lastVisitTime: '3:00 PM', nextAppointment: null, disease: 'Memory Issues', contactNumber: '012-345-6718', status: 'Archived' },
    19: { name: 'Nur Izzati', gender: 'Female', age: '28', address: 'No. 52, Melaka, 75000 Melaka', registeredDate: '2020-03-18', lastVisit: null, lastVisitTime: null, nextAppointment: '2024-02-19', disease: 'Vitamin Deficiency', contactNumber: '012-345-6719', status: 'New' },
    20: { name: 'Azman bin Razak', gender: 'Male', age: '37', address: 'No. 65, Seremban, 70000 Negeri Sembilan', registeredDate: '2019-12-12', lastVisit: '2023-12-20', lastVisitTime: '11:30 AM', nextAppointment: '2024-03-01', disease: 'Anger Management', contactNumber: '012-345-6720', status: 'Active' },
    21: { name: 'Farah Diyana', gender: 'Female', age: '44', address: 'No. 88, Ipoh, 30000 Perak', registeredDate: '2019-04-15', lastVisit: '2023-05-10', lastVisitTime: '9:00 AM', nextAppointment: null, disease: 'Back Pain', contactNumber: '012-345-6721', status: 'Inactive' },
    22: { name: 'Hakim bin Jamaludin', gender: 'Male', age: '43', address: 'No. 101, Alor Setar, 05000 Kedah', registeredDate: '2020-01-20', lastVisit: '2024-01-05', lastVisitTime: '2:00 PM', nextAppointment: '2024-02-26', disease: 'Bipolar Disorder', contactNumber: '012-345-6722', status: 'Active' },
    23: { name: 'Lina Tan', gender: 'Female', age: '35', address: 'No. 114, Kuantan, 25000 Pahang', registeredDate: '2019-08-10', lastVisit: null, lastVisitTime: null, nextAppointment: null, disease: 'Thyroid Issues', contactNumber: '012-345-6723', status: 'Pending' },
    24: { name: 'Daniel Lim', gender: 'Male', age: '38', address: 'No. 127, Kuala Terengganu, 20000 Terengganu', registeredDate: '2020-02-05', lastVisit: '2023-12-15', lastVisitTime: '4:00 PM', nextAppointment: '2024-02-24', disease: 'Anemia', contactNumber: '012-345-6724', status: 'Active' },
    25: { name: 'Yasmin binti Ahmad', gender: 'Female', age: '52', address: 'No. 140, Kota Bharu, 15000 Kelantan', registeredDate: '2019-03-22', lastVisit: '2020-08-22', lastVisitTime: '10:00 AM', nextAppointment: null, disease: 'High Cholesterol', contactNumber: '012-345-6725', status: 'Archived' },
    26: { name: 'Jason Ng', gender: 'Male', age: '58', address: 'No. 153, Butterworth, 13400 Penang', registeredDate: '2019-09-08', lastVisit: '2024-01-06', lastVisitTime: '1:30 PM', nextAppointment: '2024-02-11', disease: 'Sleep Apnea', contactNumber: '012-345-6726', status: 'Active' },
    27: { name: 'Aminah binti Kadir', gender: 'Female', age: '32', address: 'No. 166, Kajang, 43000 Selangor', registeredDate: '2020-03-01', lastVisit: null, lastVisitTime: null, nextAppointment: '2024-02-17', disease: 'Anxiety', contactNumber: '012-345-6727', status: 'New' },
    28: { name: 'Bryan Ong', gender: 'Male', age: '27', address: 'No. 179, Cheras, 56000 Kuala Lumpur', registeredDate: '2020-01-15', lastVisit: '2024-01-03', lastVisitTime: '3:30 PM', nextAppointment: '2024-02-21', disease: 'Carpal Tunnel', contactNumber: '012-345-6728', status: 'Active' },
    29: { name: 'Syafiqah Rosli', gender: 'Female', age: '29', address: 'No. 192, Ampang, 68000 Selangor', registeredDate: '2019-11-28', lastVisit: '2023-04-18', lastVisitTime: '11:00 AM', nextAppointment: null, disease: 'Tendinitis', contactNumber: '012-345-6729', status: 'Inactive' },
    30: { name: 'Ivan Chong', gender: 'Male', age: '45', address: 'No. 205, Puchong, 47100 Selangor', registeredDate: '2019-07-20', lastVisit: '2024-01-07', lastVisitTime: '2:30 PM', nextAppointment: '2024-02-29', disease: 'Vertigo', contactNumber: '012-345-6730', status: 'Active' }
  })
  const [appointments, setAppointments] = useState([
    // Today's appointments (6 rows - one per time slot, no overlapping)
    { id: 1, patientName: 'Ahmad bin Abdullah', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-25', time: '8:00 AM', visitType: 'In-person', status: 'No show', notes: 'NOTE', isToday: true },
    { id: 2, patientName: 'Siti Nurhaliza', appointmentType: 'Follow Up', sessionType: 'INTAKE INTERVIEW', date: '2020-03-25', time: '9:30 AM', visitType: 'Virtual', status: 'Ongoing', notes: '', isToday: true },
    { id: 3, patientName: 'Muhammad Faiz', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-25', time: '11:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: true },
    { id: 4, patientName: 'Aisyah Putri', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-25', time: '12:30 PM', visitType: 'In-person', status: 'Completed', notes: 'NOTE', isToday: true },
    { id: 5, patientName: 'Rizal bin Hassan', appointmentType: 'Follow Up', sessionType: 'FOLLOW UP', date: '2020-03-25', time: '3:00 PM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: true },
    { id: 6, patientName: 'Nadia Tan', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-25', time: '4:30 PM', visitType: 'In-person', status: 'Cancelled', notes: 'NOTE', isToday: true },
    // Upcoming appointments - 4 on 27/03, 3 on 28/03, 6 on 29/03 (13 total, no overlapping times per date)
    { id: 7, patientName: 'Nurul Ain', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-27', time: '8:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
    { id: 8, patientName: 'Amirul Haziq', appointmentType: 'Follow Up', sessionType: 'TREATMENT', date: '2020-03-27', time: '9:30 AM', visitType: 'In-person', status: 'Scheduled', notes: 'NOTE', isToday: false },
    { id: 9, patientName: 'Fatimah Zahra', appointmentType: 'Routine Check-up', sessionType: 'FINAL SESSION', date: '2020-03-27', time: '11:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
    { id: 10, patientName: 'Hafiz Rahman', appointmentType: 'Consultation', sessionType: 'FOLLOW UP', date: '2020-03-27', time: '3:00 PM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
    { id: 11, patientName: 'Sarah Abdullah', appointmentType: 'Follow Up', sessionType: 'TREATMENT', date: '2020-03-28', time: '8:00 AM', visitType: 'Virtual', status: 'Scheduled', notes: 'NOTE', isToday: false },
    { id: 12, patientName: 'Zulkifli bin Omar', appointmentType: 'Consultation', sessionType: 'INTAKE INTERVIEW', date: '2020-03-28', time: '11:00 AM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
    { id: 13, patientName: 'Kartini Salleh', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-28', time: '4:30 PM', visitType: 'Virtual', status: 'Scheduled', notes: 'NOTE', isToday: false },
    { id: 14, patientName: 'Ismail bin Yusof', appointmentType: 'Follow Up', sessionType: 'FOLLOW UP', date: '2020-03-29', time: '8:00 AM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
    { id: 15, patientName: 'Nur Izzati', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-29', time: '9:30 AM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
    { id: 16, patientName: 'Azman bin Razak', appointmentType: 'Routine Check-up', sessionType: 'FINAL SESSION', date: '2020-03-29', time: '11:00 AM', visitType: 'In-person', status: 'Scheduled', notes: 'NOTE', isToday: false },
    { id: 17, patientName: 'Jason Ng', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-03-29', time: '12:30 PM', visitType: 'Virtual', status: 'Scheduled', notes: '', isToday: false },
    { id: 18, patientName: 'Aminah binti Kadir', appointmentType: 'Follow Up', sessionType: 'INTAKE INTERVIEW', date: '2020-03-29', time: '3:00 PM', visitType: 'In-person', status: 'Scheduled', notes: '', isToday: false },
    { id: 19, patientName: 'Bryan Ong', appointmentType: 'Routine Check-up', sessionType: 'TREATMENT', date: '2020-03-29', time: '4:30 PM', visitType: 'Virtual', status: 'Scheduled', notes: 'NOTE', isToday: false },
    // Additional historical appointments for patients
    { id: 20, patientName: 'Ahmad bin Abdullah', appointmentType: 'Follow Up', sessionType: 'TREATMENT', date: '2020-02-15', time: '10:00 AM', visitType: 'In-person', status: 'Completed', notes: 'Regular checkup completed successfully', isToday: false },
    { id: 21, patientName: 'Ahmad bin Abdullah', appointmentType: 'Consultation', sessionType: 'INTAKE INTERVIEW', date: '2020-01-20', time: '2:30 PM', visitType: 'Virtual', status: 'Completed', notes: 'Initial consultation for hypertension management', isToday: false },
    { id: 22, patientName: 'Siti Nurhaliza', appointmentType: 'Consultation', sessionType: 'TREATMENT', date: '2020-02-10', time: '11:00 AM', visitType: 'In-person', status: 'Completed', notes: 'Diabetes follow-up, medication adjusted', isToday: false },
    { id: 23, patientName: 'Siti Nurhaliza', appointmentType: 'Routine Check-up', sessionType: 'FOLLOW UP', date: '2020-01-05', time: '9:00 AM', visitType: 'Virtual', status: 'Completed', notes: '', isToday: false },
    { id: 24, patientName: 'Muhammad Faiz', appointmentType: 'Follow Up', sessionType: 'TREATMENT', date: '2020-02-20', time: '3:00 PM', visitType: 'In-person', status: 'Completed', notes: 'Anxiety symptoms improved', isToday: false },
    { id: 25, patientName: 'Muhammad Faiz', appointmentType: 'Consultation', sessionType: 'INTAKE INTERVIEW', date: '2020-01-10', time: '4:00 PM', visitType: 'Virtual', status: 'Completed', notes: 'Initial assessment for anxiety disorder', isToday: false }
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
    setReturnToHistoryModal(false)
  }

  const [returnToHistoryModal, setReturnToHistoryModal] = useState(false)

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
      notes: reasonText || '',
      isToday: selectedDate === '2020-03-25'
    }
    
    setAppointments([...appointments, newAppointment])
    setShowAppointmentModal(false)
    resetAppointmentForm()
    setSuccessModalMessage('Appointment created successfully!')
    setShowSuccessModal(true)
    
    // If we came from history modal, show it again
    if (returnToHistoryModal) {
      setShowAppointmentHistoryModal(true)
      setReturnToHistoryModal(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Ongoing': return 'appointment-status-ongoing'
      case 'Scheduled': return 'appointment-status-scheduled'
      case 'No show': return 'appointment-status-noshow'
      case 'Completed': return 'appointment-status-completed'
      case 'Cancelled': return 'appointment-status-cancelled'
      default: return 'appointment-status-scheduled'
    }
  }

  const renderStatusBadge = (status) => {
    return (
      <span className="appointment-status-badge">
        {status}
      </span>
    )
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
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
  
  // Create Patient Modal handlers
  const handleOpenCreatePatientModal = () => {
    setNewPatientData({
      name: '',
      gender: '',
      age: '',
      address: '',
      contactNumber: '',
      disease: '',
      weight: '',
      height: '',
      bmi: '',
      bodyTemperature: '',
      heartRate: '',
      chronicConditions: [],
      pastMajorIllnesses: 'No',
      pastMajorIllnessesDetails: '',
      previousSurgeries: 'No',
      prescriptionDrugs: [],
      overTheCounterMeds: [],
      medicationNotes: ''
    })
    setCreatePatientStep(1)
    setShowCreatePatientModal(true)
  }
  
  const handleCloseCreatePatientModal = () => {
    setShowCreatePatientModal(false)
    setCreatePatientStep(1)
  }
  
  const handleCreatePatientNextStep = () => {
    if (createPatientStep < 4) {
      setCreatePatientStep(createPatientStep + 1)
    }
  }
  
  const handleCreatePatientPrevStep = () => {
    if (createPatientStep > 1) {
      setCreatePatientStep(createPatientStep - 1)
    }
  }
  
  const handleCreatePatientSubmit = () => {
    // Generate new patient ID
    const newId = Math.max(...Object.keys(patientsData).map(Number)) + 1
    const today = new Date()
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`
    
    // Add new patient to patientsData
    setPatientsData(prev => ({
      ...prev,
      [newId]: {
        ...newPatientData,
        id: newId,
        status: 'New',
        registeredDate: formattedDate,
        lastVisit: '-'
      }
    }))
    
    setShowCreatePatientModal(false)
    setCreatePatientStep(1)
    setSuccessModalMessage('Patient created successfully!')
    setShowSuccessModal(true)
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
      setSuccessModalMessage('Patient information saved successfully!')
      setShowSuccessModal(true)
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
    setSuccessModalMessage('Appointment status updated successfully!')
    setShowSuccessModal(true)
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
      setSuccessModalMessage('Appointment deleted successfully!')
      setShowSuccessModal(true)
    }
  }

  const handlePatientDelete = (patient) => {
    setPatientToDelete(patient)
    setShowPatientDeleteModal(true)
  }

  const confirmPatientDelete = () => {
    if (patientToDelete) {
      // Remove patient logic here
      setShowPatientDeleteModal(false)
      setPatientToDelete(null)
      setSuccessModalMessage('Patient deleted successfully!')
      setShowSuccessModal(true)
    }
  }

  // Download CSV function
  const handleDownloadCSV = () => {
    const allAppointments = [...todayAppointments, ...tomorrowAppointments]
    
    // CSV Header
    const csvHeader = 'Patient Name,Contact Number,Appointment Type,Consultation Type,Date,Time,Status\n'
    
    // CSV Rows - include contact number from patient data
    const csvRows = allAppointments.map(apt => {
      const patientInfo = patientsData[apt.id] || {}
      const contactNumber = patientInfo.contactNumber || 'N/A'
      return `"${apt.patientName}","${contactNumber}","${apt.appointmentType}","${apt.visitType}","${apt.date}","${apt.time}","${apt.status}"`
    }).join('\n')
    
    const csvContent = csvHeader + csvRows

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const todayAppointments = sortAppointments(getFilteredAppointments(appointments.filter(apt => apt.isToday)))
  const tomorrowAppointments = sortAppointments(getFilteredAppointments(appointments.filter(apt => !apt.isToday)))
  
  // Pagination helper functions
  const getTotalPages = (items) => Math.ceil(items.length / ITEMS_PER_PAGE)
  const getPaginatedItems = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }
  
  // Paginated appointments
  const paginatedTodayAppointments = getPaginatedItems(todayAppointments, todayPage)
  const paginatedTomorrowAppointments = getPaginatedItems(tomorrowAppointments, tomorrowPage)
  const todayTotalPages = getTotalPages(todayAppointments)
  const tomorrowTotalPages = getTotalPages(tomorrowAppointments)
  
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
    setWarningModalConfig({
      message: 'Are you sure you want to logout?',
      onConfirm: () => {
    setIsLoggedIn(false)
    setUserRole(null)
    handleNavigation('main')
      }
    })
    setShowWarningModal(true)
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
          <span className="logo-text">Jejakra.</span>
        </div>
        
        {/* Navigation Links - Right Side */}
        <div className="nav-links">
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
          {/* Logo */}
          <div className="sidebar-logo">
            {!isSidebarCollapsed && (
              <span className="logo-text">Jejakra</span>
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
            <div className="dashboard-page-container">
              {/* Welcome Header */}
              <div className="dashboard-welcome-header">
                <div className="welcome-header-left">
                  <h1 className="welcome-title">Welcome back, Megat Jun</h1>
                  <p className="welcome-subtitle">Here's what's happening in your practice currently</p>
                </div>
                <div className="welcome-header-right">
                  <button className="welcome-export-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {/* Stats Cards Row */}
              <div className="dashboard-stats-row">
                {/* Overall Visitors Card - Featured */}
                <div className="dashboard-stat-card stat-card-featured">
                  <div className="stat-card-header-row">
                    <div className="stat-card-header-left">
                      <div className="stat-card-icon-small">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </div>
                      <span className="stat-card-label">Overall visitors</span>
                    </div>
                  </div>
                  <div className="stat-card-value-row">
                    <span className="stat-card-value-large">{appointments.length.toLocaleString()}</span>
                    <span className="stat-card-badge stat-card-badge-light">+{((appointments.filter(a => a.status === 'Scheduled').length / appointments.length) * 100).toFixed(1)}%</span>
              </div>
                  <p className="stat-card-description-light">Visitors increased from {appointments.filter(a => a.status === 'Completed').length} to {appointments.length}.</p>
                  <div className="stat-card-progress">
                    <div className="stat-card-progress-bar">
                      <div className="stat-card-progress-fill" style={{width: `${(appointments.filter(a => a.status === 'Completed').length / appointments.length) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="stat-card-footer">
                    <span className="stat-card-today">{appointments.filter(a => a.isToday).length} today</span>
                  </div>
                </div>
                
                {/* Total Patient Card */}
                <div className="dashboard-stat-card">
                  <div className="stat-card-header-row">
                    <div className="stat-card-header-left">
                      <div className="stat-card-icon-small stat-icon-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <span className="stat-card-label">Total patient</span>
                    </div>
                  </div>
                  <div className="stat-card-value-row">
                    <span className="stat-card-value-large">{Object.keys(patientsData).length.toLocaleString()}</span>
                    <span className="stat-card-badge stat-card-badge-green">+{((Object.values(patientsData).filter(p => p.status === 'Active').length / Object.keys(patientsData).length) * 100).toFixed(1)}%</span>
                  </div>
                  <p className="stat-card-description">Increase in data by {Object.values(patientsData).filter(p => p.status === 'Active').length} active patients in the last 7 days</p>
                  </div>

                {/* Appointments Card */}
                <div className="dashboard-stat-card">
                  <div className="stat-card-header-row">
                    <div className="stat-card-header-left">
                      <div className="stat-card-icon-small stat-icon-purple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                  </div>
                      <span className="stat-card-label">Appointments</span>
                  </div>
                </div>
                  <div className="stat-card-value-row">
                    <span className="stat-card-value-large">{appointments.filter(a => a.status === 'Scheduled').length}</span>
                    <span className="stat-card-badge stat-card-badge-green">+{appointments.filter(a => !a.isToday && a.status === 'Scheduled').length}</span>
                  </div>
                  <p className="stat-card-description">Scheduled appointments. {appointments.filter(a => a.status === 'Completed').length} completed, {appointments.filter(a => a.status === 'Cancelled').length} cancelled.</p>
                  <div className="stat-card-progress stat-card-progress-dark">
                    <div className="stat-card-progress-bar">
                      <div className="stat-card-progress-fill-blue" style={{width: `${(appointments.filter(a => a.status === 'Scheduled').length / appointments.length) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="stat-card-footer">
                    <span className="stat-card-today-dark">{appointments.filter(a => a.isToday && a.status === 'Scheduled').length} today</span>
                    </div>
                      </div>

                {/* Current Patient Status Card */}
                <div className="dashboard-stat-card">
                  <div className="stat-card-header-row">
                    <div className="stat-card-header-left">
                      <div className="stat-card-icon-small stat-icon-green">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <span className="stat-card-label">Current Patient Status</span>
                      </div>
                      </div>
                  <div className="stat-card-value-row">
                    <span className="stat-card-value-large">{Object.values(patientsData).filter(p => p.status === 'Active').length}</span>
                    <span className="stat-card-badge stat-card-badge-green">+{Object.values(patientsData).filter(p => p.status === 'Active').length}</span>
                      </div>
                  <div className="stat-card-status-list">
                    <div className="stat-card-status-item">
                      <span className="status-dot status-dot-green"></span>
                      <span className="status-label">Active</span>
                      <span className="status-value">{Object.values(patientsData).filter(p => p.status === 'Active').length}</span>
                      </div>
                    <div className="stat-card-status-divider"></div>
                    <div className="stat-card-status-item">
                      <span className="status-dot status-dot-orange"></span>
                      <span className="status-label">Inactive</span>
                      <span className="status-value">{Object.values(patientsData).filter(p => p.status === 'Inactive').length}</span>
                      </div>
                  </div>
                </div>
              </div>

              {/* Middle Row - Chart and Support Card */}
              <div className="dashboard-middle-row">
                {/* Appointment Activity Heatmap */}
                <div className="dashboard-chart-card heatmap-card-compact">
                  <h3 className="heatmap-title">Appointment Activity</h3>
                  
                  {/* Stats Summary */}
                  <div className="heatmap-stats">
                    <div className="heatmap-stat">
                      <span className="heatmap-stat-value">{appointments.length}</span>
                      <span className="heatmap-stat-label">Total Appointments</span>
                  </div>
                    <div className="heatmap-stat">
                      <span className="heatmap-stat-value">{appointments.filter(a => a.isToday).length}</span>
                      <span className="heatmap-stat-label">Today's Sessions</span>
                    </div>
                    <div className="heatmap-stat">
                      <span className="heatmap-stat-value">{((appointments.filter(a => a.status === 'Completed').length / appointments.length) * 100).toFixed(0)}%</span>
                      <span className="heatmap-stat-label">Completion Rate</span>
                    </div>
                    <div className="heatmap-stat">
                      <span className="heatmap-stat-value">{appointments.filter(a => a.status === 'Scheduled').length}</span>
                      <span className="heatmap-stat-label">Upcoming</span>
                </div>
              </div>

                  {/* Heatmap Grid */}
                  <div className="heatmap-container">
                    <div className="heatmap-grid">
                      {/* Time labels row */}
                      <div className="heatmap-row heatmap-time-labels">
                        <div className="heatmap-day-label"></div>
                        <div className="heatmap-time-label">8</div>
                        <div className="heatmap-time-label">9</div>
                        <div className="heatmap-time-label">10</div>
                        <div className="heatmap-time-label">11</div>
                        <div className="heatmap-time-label">12</div>
                        <div className="heatmap-time-label">1</div>
                        <div className="heatmap-time-label">2</div>
                        <div className="heatmap-time-label">3</div>
                        <div className="heatmap-time-label">4</div>
                      </div>
                      
                      {/* Data rows - Weekdays only */}
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dayIndex) => (
                        <div key={day} className="heatmap-row">
                          <div className="heatmap-day-label">{day}</div>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((hour) => {
                            // Generate activity level based on day and time (hourly intervals)
                            const activityLevels = [
                              [1, 2, 2, 3, 2, 2, 2, 1, 1], // MON
                              [2, 2, 3, 3, 4, 3, 2, 2, 2], // TUE
                              [2, 3, 3, 4, 4, 3, 3, 2, 2], // WED
                              [3, 3, 4, 4, 4, 4, 3, 3, 2], // THU
                              [2, 2, 3, 3, 2, 2, 1, 1, 1], // FRI
                            ]
                            const level = activityLevels[dayIndex][hour]
                            const displayHour = hour < 4 ? `${8 + hour} AM` : hour === 4 ? '12 PM' : `${hour - 4} PM`
                            return (
                              <div 
                                key={hour} 
                                className={`heatmap-cell heatmap-level-${level}`}
                                title={`${day} - ${displayHour} - ${level} appointments`}
                              ></div>
                            )
                          })}
                </div>
                      ))}
                    </div>

                    {/* Enhanced Legend */}
                    <div className="heatmap-legend-enhanced">
                      <span className="heatmap-legend-label">Less</span>
                      <div className="heatmap-legend-scale">
                        <div className="heatmap-legend-box heatmap-level-1"></div>
                        <div className="heatmap-legend-box heatmap-level-2"></div>
                        <div className="heatmap-legend-box heatmap-level-3"></div>
                        <div className="heatmap-legend-box heatmap-level-4"></div>
                      </div>
                      <span className="heatmap-legend-label">More</span>
                    </div>
                    </div>
                  </div>

                {/* Recent Patients Card */}
                <div className="dashboard-recent-patients-card">
                  <h3 className="recent-patients-title">Recent Patients</h3>
                  <div className="recent-patients-list">
                    {Object.entries(patientsData)
                      .sort((a, b) => new Date(b[1].lastVisit) - new Date(a[1].lastVisit))
                      .map(([id, patient]) => (
                        <div 
                          key={id} 
                          className="recent-patient-item"
                          onClick={() => {
                            const fullPatientData = { id: parseInt(id), ...patient }
                            setSelectedPatient(fullPatientData)
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
                          }}
                        >
                          <div className="recent-patient-info">
                            <span className="recent-patient-name">{patient.name}</span>
                            <span className="recent-patient-visit">{patient.disease || 'General'}</span>
                </div>
                          <span className={`recent-patient-status status-${patient.status?.toLowerCase()}`}>
                            {patient.status}
                          </span>
              </div>
                      ))
                    }
                      </div>
                    </div>
                    </div>

              {/* Bottom Row - Upcoming Appointments Table */}
              <div className="dashboard-appointments-card">
                <div className="dashboard-appointments-header">
                  <div>
                    <h3 className="dashboard-appointments-title">Upcoming Appointments</h3>
                    <p className="dashboard-appointments-subtitle">Stay connected with your patients — see who's coming in today</p>
                  </div>
                  <button 
                    className="dashboard-see-all-link"
                    onClick={() => setDashboardView('appointment')}
                  >
                    See All
                  </button>
                </div>
                
                <div className="dashboard-appointments-table-container">
                  <table className="dashboard-appointments-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Visit Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((apt) => (
                        <tr key={apt.id}>
                          <td>{apt.patientName || apt.name}</td>
                          <td>{apt.appointmentType || apt.sessionType}</td>
                          <td>{apt.date}</td>
                          <td>{apt.time}</td>
                          <td>
                            <span className={`dashboard-apt-visit-badge ${apt.visitType === 'Virtual' ? 'virtual' : 'in-person'}`}>
                              {apt.visitType}
                            </span>
                          </td>
                          <td>
                            <span className={`dashboard-apt-status-badge status-${apt.status?.toLowerCase().replace(' ', '-')}`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
                      placeholder="Search by patient name, time, or status"
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
                  <div className="appointment-section-header">
                  <h2 className="appointment-section-title">
                    Today's appointments ({todayAppointments.length})
                  </h2>
                    <button 
                      className="appointment-download-csv-btn"
                      onClick={handleDownloadCSV}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download CSV
                    </button>
                  </div>
                  
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
                        className="appointment-table-col appointment-col-therapy appointment-col-center appointment-sortable" 
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
                        className="appointment-table-col appointment-col-contact appointment-col-center appointment-sortable" 
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
                        className="appointment-table-col appointment-col-status appointment-col-center appointment-sortable" 
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
                        className="appointment-table-col appointment-col-time appointment-col-center appointment-sortable" 
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
                    {paginatedTodayAppointments.map((apt) => (
                      <div 
                        key={apt.id} 
                        className={`appointment-table-row ${apt.status === 'Ongoing' ? 'appointment-row-ongoing' : ''}`}
                      >
                        <div className="appointment-table-col appointment-col-name">
                              <div className={`appointment-client-name ${getTextColor(apt.status)}`}>
                                {apt.patientName}
                              </div>
                            </div>
                        <div className={`appointment-table-col appointment-col-therapy appointment-col-center ${getTextColor(apt.status)}`}>{apt.appointmentType}</div>
                        <div className={`appointment-table-col appointment-col-contact appointment-col-center ${getTextColor(apt.status)}`}>
                          <span className={`appointment-visit-badge ${apt.visitType === 'Virtual' ? 'virtual' : 'in-person'}`}>
                            {apt.visitType}
                          </span>
                        </div>
                        <div className={`appointment-table-col appointment-col-status appointment-col-center ${getStatusColor(apt.status)}`}>
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
                            renderStatusBadge(apt.status)
                          )}
                        </div>
                        <div className={`appointment-table-col appointment-col-time appointment-col-center ${getTextColor(apt.status)} appointment-time-bold`}>{apt.time}</div>
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
                  
                  {/* Pagination for Today's Appointments */}
                  {todayTotalPages > 1 && (
                    <div className="appointment-pagination">
                      <button
                        className="appointment-pagination-nav"
                        onClick={() => setTodayPage(prev => Math.max(prev - 1, 1))}
                        disabled={todayPage === 1}
                      >
                        Previous
                      </button>
                      <span className="appointment-pagination-info">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Page {todayPage}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
                      <button
                        className="appointment-pagination-nav"
                        onClick={() => setTodayPage(prev => Math.min(prev + 1, todayTotalPages))}
                        disabled={todayPage === todayTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="appointment-section">
                  <div className="appointment-section-header">
                  <h2 className="appointment-section-title">
                      Upcoming Appointments ({tomorrowAppointments.length})
                  </h2>
                  </div>
                  
                  <div className="appointment-table appointment-table-with-date">
                    {/* Table Header */}
                    <div className="appointment-table-header with-date">
                      <div className="appointment-table-col appointment-col-date">
                        Appointment date
                      </div>
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
                        className="appointment-table-col appointment-col-therapy appointment-col-center appointment-sortable" 
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
                        className="appointment-table-col appointment-col-contact appointment-col-center appointment-sortable" 
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
                        className="appointment-table-col appointment-col-status appointment-col-center appointment-sortable" 
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
                        className="appointment-table-col appointment-col-time appointment-col-center appointment-sortable" 
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
                    {paginatedTomorrowAppointments.map((apt) => (
                      <div 
                        key={apt.id} 
                        className="appointment-table-row with-date"
                      >
                        <div className="appointment-table-col appointment-col-date appointment-text-dark">
                          {formatDate(apt.date)}
                        </div>
                        <div className="appointment-table-col appointment-col-name">
                              <div className="appointment-client-name appointment-text-dark">
                                {apt.patientName}
                              </div>
                            </div>
                        <div className="appointment-table-col appointment-col-therapy appointment-col-center appointment-text-dark">{apt.appointmentType}</div>
                        <div className="appointment-table-col appointment-col-contact appointment-col-center appointment-text-dark">
                          <span className={`appointment-visit-badge ${apt.visitType === 'Virtual' ? 'virtual' : 'in-person'}`}>
                            {apt.visitType}
                          </span>
                        </div>
                        <div className={`appointment-table-col appointment-col-status appointment-col-center ${getStatusColor(apt.status)}`}>
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
                            renderStatusBadge(apt.status)
                          )}
                        </div>
                        <div className="appointment-table-col appointment-col-time appointment-col-center appointment-text-dark appointment-time-bold">{apt.time}</div>
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
                  
                  {/* Pagination for Upcoming Appointments */}
                  {tomorrowTotalPages > 1 && (
                    <div className="appointment-pagination">
                      <button
                        className="appointment-pagination-nav"
                        onClick={() => setTomorrowPage(prev => Math.max(prev - 1, 1))}
                        disabled={tomorrowPage === 1}
                      >
                        Previous
                      </button>
                      <span className="appointment-pagination-info">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Page {tomorrowPage}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
                      <button
                        className="appointment-pagination-nav"
                        onClick={() => setTomorrowPage(prev => Math.min(prev + 1, tomorrowTotalPages))}
                        disabled={tomorrowPage === tomorrowTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>

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

              {/* Delete Appointment Modal */}
              {showDeleteModal && appointmentToDelete && (
                <div className="appointment-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                  <div className="action-modal" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                      className="action-modal-close"
                        type="button"
                      >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    <div className="action-modal-icon action-modal-icon-delete">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </div>
                    <h3 className="action-modal-title">Delete</h3>
                    <p className="action-modal-message">Are you sure you want to delete this appointment?</p>
                    <div className="action-modal-buttons">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(false)}
                        className="action-modal-btn action-modal-btn-cancel"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmDelete}
                        className="action-modal-btn action-modal-btn-delete"
                      >
                        Confirm
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

          {dashboardView === 'patients' && (() => {
            // Convert patientsData object to array
            const patientsArray = Object.entries(patientsData).map(([id, patient]) => ({
              id: parseInt(id),
              ...patient
            }))
            
            // Filter patients
            const filteredPatients = patientsArray.filter(patient => {
              const matchesSearch = patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                patient.address.toLowerCase().includes(patientSearch.toLowerCase()) ||
                patient.disease.toLowerCase().includes(patientSearch.toLowerCase()) ||
                patient.contactNumber.includes(patientSearch)
              const matchesGender = patientGenderFilter === 'All' || patient.gender === patientGenderFilter
              const matchesStatus = patientStatusFilter === 'All' || patient.status === patientStatusFilter
              
              // Date filter
              let matchesDate = true
              if (patientDateFilterType === 'specific' && patientDateFilterStart) {
                const filterDate = new Date(patientDateFilterStart).toDateString()
                const regDate = patient.registeredDate ? new Date(patient.registeredDate).toDateString() : null
                matchesDate = regDate === filterDate
              } else if (patientDateFilterType === 'range' && patientDateFilterStart && patientDateFilterEnd) {
                const startDate = new Date(patientDateFilterStart)
                const endDate = new Date(patientDateFilterEnd)
                const regDate = patient.registeredDate ? new Date(patient.registeredDate) : null
                matchesDate = regDate && regDate >= startDate && regDate <= endDate
              }
              
              return matchesSearch && matchesGender && matchesStatus && matchesDate
            })
            
            // Pagination - 15 items per page for patients
            const patientsTotalPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE)
            const paginatedPatients = filteredPatients.slice(
              (patientsPage - 1) * PATIENTS_PER_PAGE,
              patientsPage * PATIENTS_PER_PAGE
            )
            
            // Download CSV function
            const handleDownloadPatientsCSV = () => {
              const headers = ['Patient ID', 'Patient Name', 'Gender', 'Contact Number', 'Status', 'Registered Date', 'Last Visit']
              const csvContent = [
                headers.join(','),
                ...filteredPatients.map(patient => [
                  `P-${String(patient.id).padStart(4, '0')}`,
                  `"${patient.name}"`,
                  patient.gender,
                  patient.contactNumber,
                  patient.status,
                  patient.registeredDate,
                  patient.lastVisit || 'N/A'
                ].join(','))
              ].join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = `patients_list_${new Date().toISOString().split('T')[0]}.csv`
              link.click()
            }
            
            // Get status badge class
            const getPatientStatusClass = (status) => {
              switch(status) {
                case 'Active': return 'patient-status-active'
                case 'Inactive': return 'patient-status-inactive'
                case 'New': return 'patient-status-new'
                case 'Archived': return 'patient-status-archived'
                case 'Pending': return 'patient-status-pending'
                default: return ''
              }
            }
            
            // Handle action menu
            const handlePatientAction = (action, patient) => {
              setOpenPatientActionMenu(null)
              switch(action) {
                case 'view':
                  // Open patient modal in view mode (same as Appointments page)
                  setSelectedPatient(patient)
                  setPatientFormData({
                    name: patient.name || '',
                    gender: patient.gender || '',
                    age: patient.age || '',
                    address: patient.address || '',
                    registeredDate: patient.registeredDate || '',
                    disease: patient.disease || '',
                    weight: patient.weight || '',
                    height: patient.height || '',
                    bmi: patient.bmi || '',
                    bodyTemperature: patient.bodyTemperature || '',
                    heartRate: patient.heartRate || '',
                    chronicConditions: patient.chronicConditions || [],
                    pastMajorIllnesses: patient.pastMajorIllnesses || 'No',
                    pastMajorIllnessesDetails: patient.pastMajorIllnessesDetails || '',
                    previousSurgeries: patient.previousSurgeries || 'No',
                    prescriptionDrugs: patient.prescriptionDrugs || [],
                    overTheCounterMeds: patient.overTheCounterMeds || [],
                    medicationNotes: patient.medicationNotes || ''
                  })
                  setPatientModalStep(1)
                  setIsEditMode(false)
                  setShowViewPatientModal(true)
                  break
                case 'edit':
                  // Open patient modal in edit mode
                  setSelectedPatient(patient)
                  setPatientFormData({
                    name: patient.name || '',
                    gender: patient.gender || '',
                    age: patient.age || '',
                    address: patient.address || '',
                    registeredDate: patient.registeredDate || '',
                    disease: patient.disease || '',
                    weight: patient.weight || '',
                    height: patient.height || '',
                    bmi: patient.bmi || '',
                    bodyTemperature: patient.bodyTemperature || '',
                    heartRate: patient.heartRate || '',
                    chronicConditions: patient.chronicConditions || [],
                    pastMajorIllnesses: patient.pastMajorIllnesses || 'No',
                    pastMajorIllnessesDetails: patient.pastMajorIllnessesDetails || '',
                    previousSurgeries: patient.previousSurgeries || 'No',
                    prescriptionDrugs: patient.prescriptionDrugs || [],
                    overTheCounterMeds: patient.overTheCounterMeds || [],
                    medicationNotes: patient.medicationNotes || ''
                  })
                  setPatientModalStep(1)
                  setIsEditMode(true)
                  setShowViewPatientModal(true)
                  break
                case 'delete':
                  handlePatientDelete(patient)
                  break
                case 'viewAppointments':
                  alert(`View appointments for: ${patient.name}`)
                  break
                case 'createAppointment':
                  alert(`Create appointment for: ${patient.name}`)
                  break
                case 'archive':
                  alert(`Archive patient: ${patient.name}`)
                  break
                default:
                  break
              }
            }
            
            return (
              <div className="patients-page-container" onClick={() => {
                setOpenPatientActionMenu(null)
                setShowPatientFilterDropdown(false)
              }}>
                {/* Top Bar with Filters */}
                <div className="patient-top-bar">
                  <div className="patient-top-bar-content">
                    {/* Search Bar */}
                    <div className="patient-search-wrapper">
                      <svg className="patient-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by name, ID, or status"
                        className="patient-search-input"
                        value={patientSearch}
                        onChange={(e) => {
                          setPatientSearch(e.target.value)
                          setPatientsPage(1)
                        }}
                      />
                    </div>

                    <div className="patient-actions">
                      {/* More filter button */}
                      <div className="patient-filter-wrapper">
                        <button 
                          className={`patient-filter-btn ${showPatientFilterDropdown ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowPatientFilterDropdown(!showPatientFilterDropdown)
                          }}
                        >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                        More filter
                      </button>
                        
                        {/* Filter Dropdown */}
                        {showPatientFilterDropdown && (
                          <div className="patient-filter-dropdown" onClick={(e) => e.stopPropagation()}>
                            {/* Type of Appointment */}
                            <div className="filter-dropdown-section">
                              <label className="filter-dropdown-label">Type of Appointment</label>
                              <select 
                                className="filter-dropdown-select"
                                value={patientAppointmentTypeFilter}
                                onChange={(e) => setPatientAppointmentTypeFilter(e.target.value)}
                              >
                                <option value="All">All appointments</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Check-up">Check-up</option>
                                <option value="Treatment">Treatment</option>
                              </select>
                            </div>
                            
                            {/* Consultation Type */}
                            <div className="filter-dropdown-section">
                              <label className="filter-dropdown-label">Consultation Type</label>
                              <div className="filter-toggle-group">
                                <button 
                                  className={`filter-toggle-btn ${patientConsultationTypeFilter === 'All' || patientConsultationTypeFilter === 'In-person' ? 'active' : ''}`}
                                  onClick={() => setPatientConsultationTypeFilter(patientConsultationTypeFilter === 'In-person' ? 'All' : 'In-person')}
                                >
                                  In-person
                                </button>
                                <button 
                                  className={`filter-toggle-btn ${patientConsultationTypeFilter === 'Virtual' ? 'active' : ''}`}
                                  onClick={() => setPatientConsultationTypeFilter(patientConsultationTypeFilter === 'Virtual' ? 'All' : 'Virtual')}
                                >
                                  Virtual
                                </button>
                              </div>
                            </div>
                            
                            {/* Status Filter */}
                            <div className="filter-dropdown-section">
                              <label className="filter-dropdown-label">Status</label>
                              <select 
                                className="filter-dropdown-select"
                                value={patientStatusFilter}
                                onChange={(e) => setPatientStatusFilter(e.target.value)}
                              >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="New">New</option>
                                <option value="Pending">Pending</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </div>
                            
                            {/* Date Filter */}
                            <div className="filter-dropdown-section">
                              <label className="filter-dropdown-label">Date Filter</label>
                              <div className="filter-date-type-group">
                                <button 
                                  className={`filter-date-type-btn ${patientDateFilterType === 'all' ? 'active' : ''}`}
                                  onClick={() => {
                                    setPatientDateFilterType('all')
                                    setPatientDateFilterStart('')
                                    setPatientDateFilterEnd('')
                                  }}
                                >
                                  All
                                </button>
                                <button 
                                  className={`filter-date-type-btn ${patientDateFilterType === 'specific' ? 'active' : ''}`}
                                  onClick={() => setPatientDateFilterType('specific')}
                                >
                                  Specific
                                </button>
                                <button 
                                  className={`filter-date-type-btn ${patientDateFilterType === 'range' ? 'active' : ''}`}
                                  onClick={() => setPatientDateFilterType('range')}
                                >
                                  Period
                                </button>
                              </div>
                              {patientDateFilterType === 'specific' && (
                                <input 
                                  type="date"
                                  className="filter-date-input"
                                  value={patientDateFilterStart}
                                  onChange={(e) => setPatientDateFilterStart(e.target.value)}
                                />
                              )}
                              {patientDateFilterType === 'range' && (
                                <div className="filter-date-range">
                                  <input 
                                    type="date"
                                    className="filter-date-input"
                                    placeholder="Start date"
                                    value={patientDateFilterStart}
                                    onChange={(e) => setPatientDateFilterStart(e.target.value)}
                                  />
                                  <span className="filter-date-separator">to</span>
                                  <input 
                                    type="date"
                                    className="filter-date-input"
                                    placeholder="End date"
                                    value={patientDateFilterEnd}
                                    onChange={(e) => setPatientDateFilterEnd(e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                            
                            {/* Filter Actions */}
                            <div className="filter-dropdown-actions">
                              <button 
                                className="filter-apply-btn"
                                onClick={() => {
                                  setPatientsPage(1)
                                  setShowPatientFilterDropdown(false)
                                }}
                              >
                                Filter
                              </button>
                              <button 
                                className="filter-clear-btn"
                                onClick={() => {
                                  setPatientAppointmentTypeFilter('All')
                                  setPatientConsultationTypeFilter('All')
                                  setPatientStatusFilter('All')
                                  setPatientDateFilterType('all')
                                  setPatientDateFilterStart('')
                                  setPatientDateFilterEnd('')
                                  setPatientsPage(1)
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Create Patient button */}
                <button 
                        className="patient-create-btn"
                        onClick={handleOpenCreatePatientModal}
                >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                        Create Patient
                </button>
              </div>
                  </div>
                  </div>

                {/* Patients Section */}
                <div className="patient-section">
                  <div className="patient-section-header">
                    <h2 className="patient-section-title">
                      All Patients ({filteredPatients.length})
                    </h2>
                    <button className="patient-download-csv-btn" onClick={handleDownloadPatientsCSV}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                      Download CSV
                    </button>
                  </div>
                  
                  {/* Table */}
                  <div className="patients-table-container">
                  <table className="patients-data-table">
                    <thead>
                      <tr>
                        <th className="patients-th-id">Patient ID</th>
                        <th className="patients-th-name">Patient Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Last Visit</th>
                        <th>Next Appointment</th>
                        <th>Status</th>
                        <th>Registered</th>
                        <th className="patients-th-action">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPatients.map(patient => {
                        return (
                          <tr key={patient.id}>
                            <td className="patients-td-id">
                              <span className="patients-id-badge">P-{String(patient.id).padStart(4, '0')}</span>
                            </td>
                            <td className="patients-td-name">
                              <span className="patients-name">{patient.name}</span>
                            </td>
                            <td className="patients-td-age">{patient.age}</td>
                            <td className="patients-td-gender">{patient.gender}</td>
                            <td className="patients-td-lastvisit">
                              {patient.lastVisit 
                                ? (
                                  <span className="patients-visit-datetime">
                                    <span className="patients-visit-date">
                                      {(() => {
                                        const d = new Date(patient.lastVisit)
                                        const day = String(d.getDate()).padStart(2, '0')
                                        const month = String(d.getMonth() + 1).padStart(2, '0')
                                        const year = String(d.getFullYear()).slice(-2)
                                        return `${day}/${month}/${year}`
                                      })()}
                                    </span>
                                    <span className="patients-visit-time">{patient.lastVisitTime}</span>
                                  </span>
                                )
                                : <span className="patients-no-visit">No visits yet</span>
                              }
                            </td>
                            <td className="patients-td-nextappt">
                              {patient.nextAppointment 
                                ? (() => {
                                    const d = new Date(patient.nextAppointment)
                                    const day = String(d.getDate()).padStart(2, '0')
                                    const month = String(d.getMonth() + 1).padStart(2, '0')
                                    const year = String(d.getFullYear()).slice(-2)
                                    return `${day}/${month}/${year}`
                                  })()
                                : <span className="patients-no-visit">No upcoming appointment</span>
                              }
                            </td>
                            <td>
                              <span className={`patient-status-badge ${getPatientStatusClass(patient.status)}`}>
                                {patient.status}
                              </span>
                            </td>
                            <td className="patients-td-registered">
                              {(() => {
                                const d = new Date(patient.registeredDate)
                                const day = String(d.getDate()).padStart(2, '0')
                                const month = String(d.getMonth() + 1).padStart(2, '0')
                                const year = String(d.getFullYear()).slice(-2)
                                return `${day}/${month}/${year}`
                              })()}
                            </td>
                            <td className="patients-td-actions">
                              <div className="patients-action-wrapper">
                                <div className="patients-action-buttons">
                                  <button 
                                    className="patients-view-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handlePatientAction('view', patient)
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                                    View
                                  </button>
                                  <button 
                                    className="patients-appointments-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedPatient(patient)
                                      setShowAppointmentHistoryModal(true)
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                      <line x1="16" y1="2" x2="16" y2="6"/>
                                      <line x1="8" y1="2" x2="8" y2="6"/>
                                      <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    Appointments
                                  </button>
                                  <button 
                                    className="patients-delete-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handlePatientAction('delete', patient)
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="3 6 5 6 21 6"/>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                      <line x1="10" y1="11" x2="10" y2="17"/>
                                      <line x1="14" y1="11" x2="14" y2="17"/>
                                    </svg>
                                    Delete
                                  </button>
                  </div>
                  </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  
                  {paginatedPatients.length === 0 && (
                    <div className="patients-table-empty">
                      <p>No patients found matching your search criteria.</p>
                  </div>
                  )}
                </div>
                
                  {/* Pagination */}
                  {patientsTotalPages > 1 && (
                    <div className="patients-pagination">
                      <button
                        className="patients-pagination-btn"
                        onClick={() => setPatientsPage(prev => Math.max(prev - 1, 1))}
                        disabled={patientsPage === 1}
                      >
                        Previous
                      </button>
                      <div className="patients-pagination-numbers">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        <span>Page {patientsPage}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                      <button
                        className="patients-pagination-btn"
                        onClick={() => setPatientsPage(prev => Math.min(prev + 1, patientsTotalPages))}
                        disabled={patientsPage === patientsTotalPages}
                      >
                        Next
                      </button>
                  </div>
                  )}
                  </div>
                </div>
            )
          })()}

          {dashboardView === 'settings' && (
            <div className="view-container settings-page-container">
              <h2 className="view-title">Account Settings</h2>
              
              <div className="settings-layout">
                {/* Settings Sidebar */}
                <div className="settings-sidebar">
                  <button 
                    className={`settings-nav-item ${settingsTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('profile')}
                  >
                    My Profile
                </button>
                  <button 
                    className={`settings-nav-item ${settingsTab === 'security' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('security')}
                  >
                    Security
                  </button>
                  <button 
                    className={`settings-nav-item ${settingsTab === 'teams' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('teams')}
                  >
                    Teams
                  </button>
                  <button 
                    className={`settings-nav-item ${settingsTab === 'members' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('members')}
                  >
                    Team Member
                  </button>
                  <button 
                    className={`settings-nav-item ${settingsTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('notifications')}
                  >
                    Notifications
                  </button>
                  <button 
                    className={`settings-nav-item ${settingsTab === 'billing' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('billing')}
                  >
                    Billing
                  </button>
                  <button 
                    className={`settings-nav-item ${settingsTab === 'export' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('export')}
                  >
                    Data Export
                  </button>
                  <button 
                    className="settings-nav-item settings-nav-danger"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
                
                {/* Settings Content */}
                <div className="settings-content">
                  {/* Security Tab */}
                  {settingsTab === 'security' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title">Security</h3>
                      
                      {/* Email Address */}
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Email address</h4>
                          <p className="settings-row-desc">The email address associated with your account.</p>
                        </div>
                        <div className="settings-row-action">
                          <div className="settings-email-info">
                            <span className="settings-email">{userEmail}</span>
                            <span className={`settings-email-status ${emailVerified ? 'verified' : 'unverified'}`}>
                              {emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                          <button className="settings-btn settings-btn-outline">
                            Edit
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                        </div>
                      </div>
                      
                      {/* Password */}
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Password</h4>
                          <p className="settings-row-desc">Set a unique password to protect your account.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-outline">
                            Change Password
                          </button>
                        </div>
                      </div>
                      
                      {/* 2-Step Verification */}
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">2-step verification</h4>
                          <p className="settings-row-desc">Make your account extra secure. Along with your password, you'll need to enter a code</p>
                        </div>
                        <div className="settings-row-action">
                          <label className="settings-toggle">
                            <input 
                              type="checkbox" 
                              checked={twoStepVerification}
                              onChange={(e) => setTwoStepVerification(e.target.checked)}
                            />
                            <span className="settings-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Restricted Members */}
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Restricted Members</h4>
                          <p className="settings-row-desc">This will shut down your account. Your account will be reactive when you sign in again.</p>
                        </div>
                        <div className="settings-row-action">
                          <span className="settings-row-value">None</span>
                        </div>
                      </div>
                      
                      {/* Deactivate Account */}
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Deactivate my account</h4>
                          <p className="settings-row-desc">This will shut down your account. Your account will be reactive when you sign in again.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-text">Deactivate</button>
                        </div>
                      </div>
                      
                      {/* Delete Account */}
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Delete Account</h4>
                          <p className="settings-row-desc">This will delete your account. Your account will be permanently deleted from Jejakra.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-danger">Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Profile Tab */}
                  {settingsTab === 'profile' && (
                    <div className="settings-section">
                      <div className="settings-section-header">
                        <h3 className="settings-section-title">My Profile</h3>
                        {!profileEditMode && (
                          <button 
                            className="settings-btn settings-btn-primary"
                            onClick={() => setProfileEditMode(true)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                            Edit Profile
                </button>
                        )}
                      </div>
                      
                      {/* View Mode */}
                      {!profileEditMode && (
                        <>
                          {/* Personal Section - View */}
                          <div className="settings-profile-view-section">
                            <h4 className="settings-profile-view-title">Personal</h4>
                            <div className="settings-profile-view-grid">
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">First name</span>
                                <span className="settings-profile-view-value">Megat</span>
                              </div>
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Last name</span>
                                <span className="settings-profile-view-value">Jun</span>
                              </div>
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Role</span>
                                <span className="settings-profile-view-value">Dietitian</span>
                              </div>
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Email</span>
                                <span className="settings-profile-view-value">megat.jun@jejakra.com</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contact Information - View */}
                          <div className="settings-profile-view-section">
                            <h4 className="settings-profile-view-title">Contact Information</h4>
                            <div className="settings-profile-view-grid">
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Email</span>
                                <span className="settings-profile-view-value">megat.jun@jejakra.com</span>
                              </div>
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Mobile Phone</span>
                                <span className="settings-profile-view-value">+60 12-345 6789</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Timezone - View */}
                          <div className="settings-profile-view-section">
                            <h4 className="settings-profile-view-title">Timezone</h4>
                            <div className="settings-profile-view-grid">
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Timezone</span>
                                <span className="settings-profile-view-value">Malaysia Time (UTC+8:00)</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Emergency Contact - View */}
                          <div className="settings-profile-view-section">
                            <h4 className="settings-profile-view-title">Emergency Contact</h4>
                            <div className="settings-profile-view-grid">
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Name</span>
                                <span className="settings-profile-view-value">Ahmad bin Abdullah</span>
                              </div>
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Phone Number</span>
                                <span className="settings-profile-view-value">+60 19-876 5432</span>
                              </div>
                              <div className="settings-profile-view-item">
                                <span className="settings-profile-view-label">Email</span>
                                <span className="settings-profile-view-value">ahmad.abdullah@email.com</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Edit Mode */}
                      {profileEditMode && (
                        <>
                          {/* Personal Section - Edit */}
                          <div className="settings-form-section">
                            <div className="settings-form-header">
                              <h4 className="settings-form-title">Personal</h4>
                              <p className="settings-form-desc">These details can't be changed. Ask your supervisor to make any updates.</p>
                            </div>
                            <div className="settings-form-content">
                              <div className="settings-form-row">
                                <div className="settings-form-field">
                                  <label className="settings-form-label">First name</label>
                                  <input 
                                    type="text" 
                                    className="settings-form-input" 
                                    defaultValue="Megat" 
                                    readOnly
                                  />
                                </div>
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Last name</label>
                                  <input 
                                    type="text" 
                                    className="settings-form-input" 
                                    defaultValue="Jun" 
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="settings-form-row">
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Role</label>
                                  <input 
                                    type="text" 
                                    className="settings-form-input" 
                                    defaultValue="Dietitian" 
                                    readOnly
                                  />
                                </div>
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Email</label>
                                  <input 
                                    type="email" 
                                    className="settings-form-input" 
                                    defaultValue="megat.jun@jejakra.com" 
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contact Information Section - Edit */}
                          <div className="settings-form-section">
                            <div className="settings-form-header">
                              <h4 className="settings-form-title">Contact Information</h4>
                              <p className="settings-form-desc">Your contact details for communication.</p>
                            </div>
                            <div className="settings-form-content">
                              <div className="settings-form-row">
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Email</label>
                                  <input 
                                    type="email" 
                                    className="settings-form-input" 
                                    defaultValue="megat.jun@jejakra.com" 
                                  />
                                </div>
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Mobile Phone</label>
                                  <input 
                                    type="tel" 
                                    className="settings-form-input" 
                                    defaultValue="+60 12-345 6789" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Timezone Section - Edit */}
                          <div className="settings-form-section">
                            <div className="settings-form-header">
                              <h4 className="settings-form-title">Timezone</h4>
                              <p className="settings-form-desc">Set up your working timezone</p>
                            </div>
                            <div className="settings-form-content">
                              <div className="settings-form-field settings-form-field-wide">
                                <label className="settings-form-label">Timezone</label>
                                <select className="settings-form-select">
                                  <option value="UTC+8">Malaysia Time (UTC+8:00)</option>
                                  <option value="UTC+0">Greenwich Mean Time (UTC+0:00)</option>
                                  <option value="UTC-5">Eastern Time (UTC-5:00)</option>
                                  <option value="UTC-8">Pacific Time (UTC-8:00)</option>
                                  <option value="UTC+9">Japan Time (UTC+9:00)</option>
                                  <option value="UTC+5:30">India Time (UTC+5:30)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          
                          {/* Emergency Contact Section - Edit */}
                          <div className="settings-form-section">
                            <div className="settings-form-header">
                              <h4 className="settings-form-title">Emergency Contact</h4>
                              <p className="settings-form-desc">Person to contact in case of emergency.</p>
                            </div>
                            <div className="settings-form-content">
                              <div className="settings-form-field settings-form-field-wide">
                                <label className="settings-form-label">Name</label>
                                <input 
                                  type="text" 
                                  className="settings-form-input" 
                                  defaultValue="Ahmad bin Abdullah" 
                                />
                              </div>
                              <div className="settings-form-row">
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Phone Number</label>
                                  <input 
                                    type="tel" 
                                    className="settings-form-input" 
                                    defaultValue="+60 19-876 5432" 
                                  />
                                </div>
                                <div className="settings-form-field">
                                  <label className="settings-form-label">Email</label>
                                  <input 
                                    type="email" 
                                    className="settings-form-input" 
                                    defaultValue="ahmad.abdullah@email.com" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Edit Actions */}
                          <div className="settings-form-actions">
                <button 
                              className="settings-btn settings-btn-outline"
                              onClick={() => setProfileEditMode(false)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="settings-btn settings-btn-primary"
                              onClick={() => {
                                setProfileEditMode(false)
                                setSuccessModalMessage('Profile updated successfully!')
                                setShowSuccessModal(true)
                              }}
                            >
                              Save Changes
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Teams Tab */}
                  {settingsTab === 'teams' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title">Teams</h3>
                      <div className="settings-empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                        <p>No teams created yet</p>
                        <button className="settings-btn settings-btn-primary">Create Team</button>
                      </div>
                    </div>
                  )}
                  
                  {/* Team Members Tab */}
                  {settingsTab === 'members' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title">Team Members</h3>
                      <div className="settings-empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <line x1="19" y1="8" x2="19" y2="14"/>
                          <line x1="22" y1="11" x2="16" y2="11"/>
                        </svg>
                        <p>No team members added</p>
                        <button className="settings-btn settings-btn-primary">Invite Member</button>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications Tab */}
                  {settingsTab === 'notifications' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title">Notifications</h3>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Email Notifications</h4>
                          <p className="settings-row-desc">Receive email notifications for important updates.</p>
                        </div>
                        <div className="settings-row-action">
                          <label className="settings-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="settings-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Appointment Reminders</h4>
                          <p className="settings-row-desc">Get reminded about upcoming appointments.</p>
                        </div>
                        <div className="settings-row-action">
                          <label className="settings-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="settings-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Patient Updates</h4>
                          <p className="settings-row-desc">Receive notifications when patient information is updated.</p>
                        </div>
                        <div className="settings-row-action">
                          <label className="settings-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="settings-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Marketing Emails</h4>
                          <p className="settings-row-desc">Receive promotional emails and newsletters.</p>
                        </div>
                        <div className="settings-row-action">
                          <label className="settings-toggle">
                            <input type="checkbox" />
                            <span className="settings-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Billing Tab */}
                  {settingsTab === 'billing' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title">Billing</h3>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Current Plan</h4>
                          <p className="settings-row-desc">Your current subscription plan.</p>
                        </div>
                        <div className="settings-row-action">
                          <span className="settings-plan-badge">Professional</span>
                          <button className="settings-btn settings-btn-outline">Upgrade</button>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Payment Method</h4>
                          <p className="settings-row-desc">Manage your payment methods.</p>
                        </div>
                        <div className="settings-row-action">
                          <span className="settings-row-value">•••• •••• •••• 4242</span>
                          <button className="settings-btn settings-btn-outline">Update</button>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Billing History</h4>
                          <p className="settings-row-desc">View your past invoices and payments.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-outline">View History</button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Data Export Tab */}
                  {settingsTab === 'export' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title">Data Export</h3>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Export Patient Data</h4>
                          <p className="settings-row-desc">Download all your patient data in CSV format.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export CSV
                </button>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Export Appointments</h4>
                          <p className="settings-row-desc">Download your appointment history.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export CSV
                          </button>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Full Account Export</h4>
                          <p className="settings-row-desc">Download all your account data including settings.</p>
                        </div>
                        <div className="settings-row-action">
                          <button className="settings-btn settings-btn-outline">Request Export</button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Delete Account Tab */}
                  {settingsTab === 'delete' && (
                    <div className="settings-section">
                      <h3 className="settings-section-title settings-section-danger">Delete Account</h3>
                      
                      <div className="settings-danger-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <div>
                          <h4>This action is irreversible</h4>
                          <p>Once you delete your account, there is no going back. All your data, including patients, appointments, and settings will be permanently removed.</p>
                        </div>
                      </div>
                      
                      <div className="settings-row">
                        <div className="settings-row-info">
                          <h4 className="settings-row-title">Confirm Account Deletion</h4>
                          <p className="settings-row-desc">To delete your account, please type "DELETE" to confirm.</p>
                        </div>
                        <div className="settings-row-action settings-row-action-vertical">
                          <input 
                            type="text" 
                            placeholder='Type "DELETE" to confirm'
                            className="settings-delete-input"
                          />
                          <button className="settings-btn settings-btn-danger">
                            Delete My Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View Patient Modal - Rendered outside dashboard views so it works from any page */}
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
                  <div className={`stepper-step ${patientModalStep > 1 ? 'completed' : ''} ${patientModalStep === 1 ? 'current' : ''}`}>
                    <div className="stepper-circle">
                      {patientModalStep > 1 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : '1'}
                    </div>
                    <div className="stepper-label">General Info</div>
                  </div>
                  <div className={`stepper-line ${patientModalStep >= 2 ? 'active' : ''}`}></div>
                  <div className={`stepper-step ${patientModalStep > 2 ? 'completed' : ''} ${patientModalStep === 2 ? 'current' : ''}`}>
                    <div className="stepper-circle">
                      {patientModalStep > 2 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : '2'}
                    </div>
                    <div className="stepper-label">Measurements</div>
                  </div>
                  <div className={`stepper-line ${patientModalStep >= 3 ? 'active' : ''}`}></div>
                  <div className={`stepper-step ${patientModalStep > 3 ? 'completed' : ''} ${patientModalStep === 3 ? 'current' : ''}`}>
                    <div className="stepper-circle">
                      {patientModalStep > 3 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : '3'}
                    </div>
                    <div className="stepper-label">History</div>
                  </div>
                  <div className={`stepper-line ${patientModalStep >= 4 ? 'active' : ''}`}></div>
                  <div className={`stepper-step ${patientModalStep === 4 ? 'current' : ''}`}>
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
                                    name="pastMajorIllnessesGlobal"
                                    value="Yes"
                                    checked={patientFormData.pastMajorIllnesses === 'Yes'}
                                    onChange={(e) => setPatientFormData(prev => ({ ...prev, pastMajorIllnesses: e.target.value }))}
                                  />
                                  <span>Yes</span>
                                </label>
                                <label className="radio-label">
                                  <input
                                    type="radio"
                                    name="pastMajorIllnessesGlobal"
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
                                  name="previousSurgeriesGlobal"
                                  value="Yes"
                                  checked={patientFormData.previousSurgeries === 'Yes'}
                                  onChange={(e) => setPatientFormData(prev => ({ ...prev, previousSurgeries: e.target.value }))}
                                />
                                <span>Yes</span>
                              </label>
                              <label className="radio-label">
                                <input
                                  type="radio"
                                  name="previousSurgeriesGlobal"
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

          {/* Appointment Schedule Modal - Global so it works from any page */}
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

          {/* Appointment History Modal */}
          {showAppointmentHistoryModal && selectedPatient && (() => {
            const patientAppointments = appointments
              .filter(apt => apt.patientName === selectedPatient?.name)
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, latest first
            const completedCount = patientAppointments.filter(apt => apt.status === 'Completed').length
            const cancelledCount = patientAppointments.filter(apt => apt.status === 'Cancelled').length
            const noShowCount = patientAppointments.filter(apt => apt.status === 'No show').length
            const totalCount = patientAppointments.length
            const attendedCount = completedCount + patientAppointments.filter(apt => apt.status === 'Ongoing' || apt.status === 'Scheduled').length
            const attendanceRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
            
            // Get last visit date
            const lastVisitDate = patientAppointments.length > 0 ? (() => {
              const d = new Date(patientAppointments[0].date)
              return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`
            })() : 'N/A'
            
            return (
              <div className="appointment-modal-overlay" onClick={() => setShowAppointmentHistoryModal(false)}>
                <div className="appointment-modal-container appointment-history-modal" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="appointment-modal-header history-modal-header">
                    <div className="history-header-top">
                      <h2 className="appointment-modal-title">Appointment History</h2>
                      <button
                        onClick={() => setShowAppointmentHistoryModal(false)}
                        className="appointment-modal-close"
                        type="button"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <div className="history-header-bottom">
                      <div className="history-patient-info">
                        <span className="history-patient-name">{selectedPatient.name}</span>
                        <span className="history-divider">•</span>
                        <span className="history-total">{totalCount} Total</span>
                        <span className="history-divider">•</span>
                        <span className="history-last-visit">Last Update: {lastVisitDate}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAppointmentHistoryModal(false)
                          setShowAppointmentModal(true)
                          setPatientName(selectedPatient?.name || '')
                          setReturnToHistoryModal(true)
                        }}
                        className="history-create-btn"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create Appointment
                      </button>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="appointment-modal-body">
                    <div className="appointment-history-table-container">
                      <table className="appointment-history-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th>Mode</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientAppointments.length > 0 ? (
                            patientAppointments.map((apt, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="appt-datetime">
                                    <span className="appt-date">
                                      {(() => {
                                        const d = new Date(apt.date)
                                        const day = String(d.getDate()).padStart(2, '0')
                                        const month = String(d.getMonth() + 1).padStart(2, '0')
                                        const year = String(d.getFullYear()).slice(-2)
                                        return `${day}/${month}/${year}`
                                      })()}
                                    </span>
                                    <span className="appt-time">{apt.time}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`appt-status-badge ${apt.status.toLowerCase().replace(' ', '-')}`}>
                                    {apt.status}
                                  </span>
                                </td>
                                <td>{apt.appointmentType}</td>
                                <td>{apt.visitType}</td>
                                <td>
                                  {apt.notes ? (
                                    <button 
                                      className="view-notes-btn"
                                      onClick={() => {
                                        setSelectedNotes(apt.notes)
                                        setShowNotesModal(true)
                                      }}
                                    >
                                      View notes
                                    </button>
                                  ) : (
                                    <span className="no-notes">No Notes</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="no-appointments">
                                No appointments found for this patient.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Pagination */}
                  <div className="history-pagination-bar">
                    <div className="history-pagination">
                      <button className="history-page-btn" disabled>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Previous
                      </button>
                      <span className="history-page-info">1 of 1</span>
                      <button className="history-page-btn" disabled>
                        Next
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Notes Modal */}
          {showNotesModal && (
            <div className="appointment-modal-overlay" onClick={() => setShowNotesModal(false)}>
              <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
                <div className="notes-modal-header">
                  <h3>Appointment Notes</h3>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="appointment-modal-close"
                    type="button"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div className="notes-modal-body">
                  <p>{selectedNotes || 'No notes available.'}</p>
                </div>
                <div className="notes-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowNotesModal(false)}
                    className="appointment-close-btn"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Patient Delete Modal */}
          {showPatientDeleteModal && patientToDelete && (
            <div className="appointment-modal-overlay" onClick={() => setShowPatientDeleteModal(false)}>
              <div className="action-modal" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowPatientDeleteModal(false)}
                  className="action-modal-close"
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div className="action-modal-icon action-modal-icon-delete">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>
                <h3 className="action-modal-title">Delete</h3>
                <p className="action-modal-message">Are you sure you want to delete this patient?</p>
                <div className="action-modal-buttons">
                  <button
                    type="button"
                    onClick={() => setShowPatientDeleteModal(false)}
                    className="action-modal-btn action-modal-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmPatientDelete}
                    className="action-modal-btn action-modal-btn-delete"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="appointment-modal-overlay" onClick={() => setShowSuccessModal(false)}>
              <div className="action-modal" onClick={(e) => e.stopPropagation()}>
                <div className="action-modal-icon action-modal-icon-success">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="action-modal-title">Success</h3>
                <p className="action-modal-message">{successModalMessage || 'Action is done successfully!'}</p>
                <div className="action-modal-buttons action-modal-buttons-single">
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="action-modal-btn action-modal-btn-success"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warning Modal */}
          {showWarningModal && (
            <div className="appointment-modal-overlay" onClick={() => setShowWarningModal(false)}>
              <div className="action-modal" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="action-modal-close"
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div className="action-modal-icon action-modal-icon-warning">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="action-modal-title">Warning</h3>
                <p className="action-modal-message">{warningModalConfig.message || 'Are you sure about this action?'}</p>
                <div className="action-modal-buttons">
                  <button
                    type="button"
                    onClick={() => setShowWarningModal(false)}
                    className="action-modal-btn action-modal-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (warningModalConfig.onConfirm) warningModalConfig.onConfirm()
                      setShowWarningModal(false)
                    }}
                    className="action-modal-btn action-modal-btn-warning"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Patient Modal */}
          {showCreatePatientModal && (
            <div className="appointment-modal-overlay" onClick={handleCloseCreatePatientModal}>
              <div className="appointment-modal-container patient-view-modal" onClick={(e) => e.stopPropagation()}>
                <div className="appointment-modal-header">
                  <h2 className="appointment-modal-title">
                    {createPatientStep === 1 && 'General Information'}
                    {createPatientStep === 2 && 'Clinical Measurements'}
                    {createPatientStep === 3 && 'Medical History'}
                    {createPatientStep === 4 && 'Current Medication'}
                  </h2>
                  <button
                    onClick={handleCloseCreatePatientModal}
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
                  <div className={`stepper-step ${createPatientStep > 1 ? 'completed' : ''} ${createPatientStep === 1 ? 'current' : ''}`}>
                    <div className="stepper-circle">
                      {createPatientStep > 1 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : '1'}
                    </div>
                    <div className="stepper-label">General Info</div>
                  </div>
                  <div className={`stepper-line ${createPatientStep >= 2 ? 'active' : ''}`}></div>
                  <div className={`stepper-step ${createPatientStep > 2 ? 'completed' : ''} ${createPatientStep === 2 ? 'current' : ''}`}>
                    <div className="stepper-circle">
                      {createPatientStep > 2 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : '2'}
                    </div>
                    <div className="stepper-label">Measurements</div>
                  </div>
                  <div className={`stepper-line ${createPatientStep >= 3 ? 'active' : ''}`}></div>
                  <div className={`stepper-step ${createPatientStep > 3 ? 'completed' : ''} ${createPatientStep === 3 ? 'current' : ''}`}>
                    <div className="stepper-circle">
                      {createPatientStep > 3 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : '3'}
                    </div>
                    <div className="stepper-label">History</div>
                  </div>
                  <div className={`stepper-line ${createPatientStep >= 4 ? 'active' : ''}`}></div>
                  <div className={`stepper-step ${createPatientStep === 4 ? 'current' : ''}`}>
                    <div className="stepper-circle">4</div>
                    <div className="stepper-label">Medication</div>
                  </div>
                </div>
                
                <div className="appointment-modal-body">
                  <div className="appointment-form-container">
                    {/* Step 1: General Information */}
                    {createPatientStep === 1 && (
                      <>
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Patient Name <span className="required">*</span></label>
                          <input
                            type="text"
                            value={newPatientData.name}
                            onChange={(e) => setNewPatientData({...newPatientData, name: e.target.value})}
                            placeholder="Enter patient name"
                            className="appointment-form-input"
                            required
                          />
                        </div>
                        
                        <div className="appointment-form-row">
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">Gender <span className="required">*</span></label>
                            <select
                              value={newPatientData.gender}
                              onChange={(e) => setNewPatientData({...newPatientData, gender: e.target.value})}
                              className="appointment-form-input"
                              required
                            >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">Age <span className="required">*</span></label>
                            <input
                              type="number"
                              value={newPatientData.age}
                              onChange={(e) => setNewPatientData({...newPatientData, age: e.target.value})}
                              placeholder="Enter age"
                              className="appointment-form-input"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Contact Number <span className="required">*</span></label>
                          <input
                            type="tel"
                            value={newPatientData.contactNumber}
                            onChange={(e) => setNewPatientData({...newPatientData, contactNumber: e.target.value})}
                            placeholder="Enter contact number"
                            className="appointment-form-input"
                            required
                          />
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Address</label>
                          <textarea
                            value={newPatientData.address}
                            onChange={(e) => setNewPatientData({...newPatientData, address: e.target.value})}
                            placeholder="Enter address"
                            className="appointment-form-input appointment-form-textarea"
                            rows="2"
                          />
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Primary Condition/Disease</label>
                          <input
                            type="text"
                            value={newPatientData.disease}
                            onChange={(e) => setNewPatientData({...newPatientData, disease: e.target.value})}
                            placeholder="Enter primary condition"
                            className="appointment-form-input"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Step 2: Clinical Measurements */}
                    {createPatientStep === 2 && (
                      <>
                        <div className="appointment-form-row">
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">Weight (kg)</label>
                            <input
                              type="number"
                              value={newPatientData.weight}
                              onChange={(e) => setNewPatientData({...newPatientData, weight: e.target.value})}
                              placeholder="Enter weight"
                              className="appointment-form-input"
                            />
                          </div>
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">Height (cm)</label>
                            <input
                              type="number"
                              value={newPatientData.height}
                              onChange={(e) => setNewPatientData({...newPatientData, height: e.target.value})}
                              placeholder="Enter height"
                              className="appointment-form-input"
                            />
                          </div>
                        </div>
                        
                        <div className="appointment-form-row">
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">BMI</label>
                            <input
                              type="text"
                              value={newPatientData.weight && newPatientData.height ? 
                                (newPatientData.weight / ((newPatientData.height / 100) ** 2)).toFixed(1) : ''}
                              readOnly
                              placeholder="Auto-calculated"
                              className="appointment-form-input"
                              style={{ background: '#f9fafb' }}
                            />
                          </div>
                          <div className="appointment-form-field">
                            <label className="appointment-form-label">Body Temperature (°C)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={newPatientData.bodyTemperature}
                              onChange={(e) => setNewPatientData({...newPatientData, bodyTemperature: e.target.value})}
                              placeholder="Enter temperature"
                              className="appointment-form-input"
                            />
                          </div>
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Heart Rate (bpm)</label>
                          <input
                            type="number"
                            value={newPatientData.heartRate}
                            onChange={(e) => setNewPatientData({...newPatientData, heartRate: e.target.value})}
                            placeholder="Enter heart rate"
                            className="appointment-form-input"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Step 3: Medical History */}
                    {createPatientStep === 3 && (
                      <>
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Chronic Conditions</label>
                          <div className="chronic-conditions-grid">
                            {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'None'].map(condition => (
                              <label key={condition} className="chronic-condition-checkbox">
                                <input
                                  type="checkbox"
                                  checked={newPatientData.chronicConditions.includes(condition)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewPatientData({
                                        ...newPatientData,
                                        chronicConditions: [...newPatientData.chronicConditions, condition]
                                      })
                                    } else {
                                      setNewPatientData({
                                        ...newPatientData,
                                        chronicConditions: newPatientData.chronicConditions.filter(c => c !== condition)
                                      })
                                    }
                                  }}
                                />
                                <span>{condition}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Past Major Illnesses</label>
                          <div className="radio-group">
                            <label className="radio-option">
                              <input
                                type="radio"
                                name="pastIllnesses"
                                value="No"
                                checked={newPatientData.pastMajorIllnesses === 'No'}
                                onChange={(e) => setNewPatientData({...newPatientData, pastMajorIllnesses: e.target.value})}
                              />
                              <span>No</span>
                            </label>
                            <label className="radio-option">
                              <input
                                type="radio"
                                name="pastIllnesses"
                                value="Yes"
                                checked={newPatientData.pastMajorIllnesses === 'Yes'}
                                onChange={(e) => setNewPatientData({...newPatientData, pastMajorIllnesses: e.target.value})}
                              />
                              <span>Yes</span>
                            </label>
                          </div>
                          {newPatientData.pastMajorIllnesses === 'Yes' && (
                            <textarea
                              value={newPatientData.pastMajorIllnessesDetails}
                              onChange={(e) => setNewPatientData({...newPatientData, pastMajorIllnessesDetails: e.target.value})}
                              placeholder="Please describe"
                              className="appointment-form-input appointment-form-textarea"
                              rows="2"
                              style={{ marginTop: '8px' }}
                            />
                          )}
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Previous Surgeries</label>
                          <div className="radio-group">
                            <label className="radio-option">
                              <input
                                type="radio"
                                name="prevSurgeries"
                                value="No"
                                checked={newPatientData.previousSurgeries === 'No'}
                                onChange={(e) => setNewPatientData({...newPatientData, previousSurgeries: e.target.value})}
                              />
                              <span>No</span>
                            </label>
                            <label className="radio-option">
                              <input
                                type="radio"
                                name="prevSurgeries"
                                value="Yes"
                                checked={newPatientData.previousSurgeries === 'Yes'}
                                onChange={(e) => setNewPatientData({...newPatientData, previousSurgeries: e.target.value})}
                              />
                              <span>Yes</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Step 4: Current Medication */}
                    {createPatientStep === 4 && (
                      <>
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Prescription Drugs</label>
                          <input
                            type="text"
                            placeholder="Enter medication and press Enter"
                            className="appointment-form-input"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                e.preventDefault()
                                setNewPatientData({
                                  ...newPatientData,
                                  prescriptionDrugs: [...newPatientData.prescriptionDrugs, e.target.value.trim()]
                                })
                                e.target.value = ''
                              }
                            }}
                          />
                          {newPatientData.prescriptionDrugs.length > 0 && (
                            <div className="medication-tags">
                              {newPatientData.prescriptionDrugs.map((drug, index) => (
                                <span key={index} className="medication-tag">
                                  {drug}
                                  <button
                                    type="button"
                                    onClick={() => setNewPatientData({
                                      ...newPatientData,
                                      prescriptionDrugs: newPatientData.prescriptionDrugs.filter((_, i) => i !== index)
                                    })}
                                  >×</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Over-the-Counter Medications</label>
                          <input
                            type="text"
                            placeholder="Enter medication and press Enter"
                            className="appointment-form-input"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                e.preventDefault()
                                setNewPatientData({
                                  ...newPatientData,
                                  overTheCounterMeds: [...newPatientData.overTheCounterMeds, e.target.value.trim()]
                                })
                                e.target.value = ''
                              }
                            }}
                          />
                          {newPatientData.overTheCounterMeds.length > 0 && (
                            <div className="medication-tags">
                              {newPatientData.overTheCounterMeds.map((med, index) => (
                                <span key={index} className="medication-tag">
                                  {med}
                                  <button
                                    type="button"
                                    onClick={() => setNewPatientData({
                                      ...newPatientData,
                                      overTheCounterMeds: newPatientData.overTheCounterMeds.filter((_, i) => i !== index)
                                    })}
                                  >×</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="appointment-form-field">
                          <label className="appointment-form-label">Additional Notes</label>
                          <textarea
                            value={newPatientData.medicationNotes}
                            onChange={(e) => setNewPatientData({...newPatientData, medicationNotes: e.target.value})}
                            placeholder="Any additional notes about medications"
                            className="appointment-form-input appointment-form-textarea"
                            rows="3"
                          />
                        </div>
                      </>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="appointment-form-actions">
                      {createPatientStep === 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handleCloseCreatePatientModal}
                            className="appointment-cancel-btn"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleCreatePatientNextStep}
                            className="appointment-next-btn"
                            disabled={!newPatientData.name || !newPatientData.gender || !newPatientData.age || !newPatientData.contactNumber}
                          >
                            Next
                          </button>
                        </>
                      )}
                      {createPatientStep === 2 && (
                        <>
                          <button
                            type="button"
                            onClick={handleCreatePatientPrevStep}
                            className="appointment-prev-btn"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleCreatePatientNextStep}
                            className="appointment-next-btn"
                          >
                            Next
                          </button>
                        </>
                      )}
                      {createPatientStep === 3 && (
                        <>
                          <button
                            type="button"
                            onClick={handleCreatePatientPrevStep}
                            className="appointment-prev-btn"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleCreatePatientNextStep}
                            className="appointment-next-btn"
                          >
                            Next
                          </button>
                        </>
                      )}
                      {createPatientStep === 4 && (
                        <>
                          <button
                            type="button"
                            onClick={handleCreatePatientPrevStep}
                            className="appointment-prev-btn"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleCreatePatientSubmit}
                            className="appointment-submit-btn"
                          >
                            Create Patient
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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

