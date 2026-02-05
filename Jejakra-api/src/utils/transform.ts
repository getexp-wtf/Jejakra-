import type { Patient, PatientDetails, Appointment } from '@prisma/client';

/** Map Prisma enums to frontend format (spaces instead of underscores) */
export function toFrontendPatient(patient: Patient & { details?: PatientDetails | null }) {
  return {
    id: patient.id,
    displayId: `P-${patient.id.slice(0, 8).toUpperCase()}`,
    name: patient.name,
    gender: patient.gender,
    age: patient.age?.toString() ?? '',
    address: patient.address ?? '',
    registeredDate: formatDate(patient.registeredDate),
    lastVisit: patient.lastVisit ? formatDate(patient.lastVisit) : null,
    lastVisitTime: patient.lastVisitTime ?? null,
    nextAppointment: patient.nextAppointment ? formatDate(patient.nextAppointment) : null,
    disease: patient.disease ?? '',
    contactNumber: patient.contactNumber ?? '',
    status: patient.status,
    // Extended details
    weight: patient.details?.weight?.toString(),
    height: patient.details?.height?.toString(),
    bmi: patient.details?.bmi?.toString(),
    bodyTemperature: patient.details?.bodyTemperature?.toString(),
    heartRate: patient.details?.heartRate,
    chronicConditions: (patient.details?.chronicConditions as string[]) ?? [],
    pastMajorIllnesses: patient.details?.pastMajorIllnesses ?? 'No',
    pastMajorIllnessesDetails: patient.details?.pastMajorIllnessesDetails ?? '',
    previousSurgeries: patient.details?.previousSurgeries ?? 'No',
    prescriptionDrugs: (patient.details?.prescriptionDrugs as string[]) ?? [],
    overTheCounterMeds: (patient.details?.overTheCounterMeds as string[]) ?? [],
    medicationNotes: patient.details?.medicationNotes ?? '',
  };
}

export function toFrontendAppointment(
  apt: Appointment & { patient: { id: string; name: string; contactNumber: string | null } }
) {
  const today = new Date().toISOString().slice(0, 10);
  const aptDate = formatDate(apt.date);
  const isToday = apt.date instanceof Date
    ? apt.date.toISOString().slice(0, 10) === today
    : String(apt.date).slice(0, 10) === today;

  return {
    id: apt.id,
    patientId: apt.patientId,
    patientName: apt.patient.name,
    contactNumber: apt.patient.contactNumber ?? undefined,
    appointmentType: mapAppointmentTypeToFrontend(apt.appointmentType),
    sessionType: mapSessionTypeToFrontend(apt.sessionType),
    date: formatDate(apt.date),
    time: apt.time,
    visitType: mapVisitTypeToFrontend(apt.visitType),
    status: mapAppointmentStatusToFrontend(apt.status),
    notes: apt.notes ?? '',
    reason: apt.reason ?? '',
    isToday,
  };
}

function formatDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}

// Frontend uses "Follow Up", "Routine Check-up" - Prisma uses Follow_Up, Routine_Checkup
const APPOINTMENT_TYPE_MAP: Record<string, string> = {
  Consultation: 'Consultation',
  Follow_Up: 'Follow Up',
  Routine_Checkup: 'Routine Check-up',
};

const SESSION_TYPE_MAP: Record<string, string> = {
  TREATMENT: 'TREATMENT',
  INTAKE_INTERVIEW: 'INTAKE INTERVIEW',
  FOLLOW_UP: 'FOLLOW UP',
  FINAL_SESSION: 'FINAL SESSION',
};

const VISIT_TYPE_MAP: Record<string, string> = {
  In_person: 'In-person',
  Virtual: 'Virtual',
};

const APPOINTMENT_STATUS_MAP: Record<string, string> = {
  Scheduled: 'Scheduled',
  Ongoing: 'Ongoing',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  No_show: 'No show',
};

export function mapAppointmentTypeToPrisma(s: string): 'Consultation' | 'Follow_Up' | 'Routine_Checkup' {
  const m: Record<string, 'Consultation' | 'Follow_Up' | 'Routine_Checkup'> = {
    Consultation: 'Consultation',
    'Follow Up': 'Follow_Up',
    'Routine Check-up': 'Routine_Checkup',
  };
  return m[s] ?? 'Consultation';
}

export function mapAppointmentTypeToFrontend(s: string): string {
  return APPOINTMENT_TYPE_MAP[s] ?? s;
}

export function mapSessionTypeToPrisma(s: string): 'TREATMENT' | 'INTAKE_INTERVIEW' | 'FOLLOW_UP' | 'FINAL_SESSION' {
  const m: Record<string, 'TREATMENT' | 'INTAKE_INTERVIEW' | 'FOLLOW_UP' | 'FINAL_SESSION'> = {
    TREATMENT: 'TREATMENT',
    'INTAKE INTERVIEW': 'INTAKE_INTERVIEW',
    FOLLOW_UP: 'FOLLOW UP',
    'FOLLOW UP': 'FOLLOW_UP',
    FINAL_SESSION: 'FINAL_SESSION',
    'FINAL SESSION': 'FINAL_SESSION',
  };
  return m[s] ?? 'TREATMENT';
}

export function mapSessionTypeToFrontend(s: string | null): string {
  if (!s) return 'TREATMENT';
  return SESSION_TYPE_MAP[s] ?? s;
}

export function mapVisitTypeToPrisma(s: string): 'In_person' | 'Virtual' {
  return s === 'Virtual' ? 'Virtual' : 'In_person';
}

export function mapVisitTypeToFrontend(s: string): string {
  return VISIT_TYPE_MAP[s] ?? s;
}

export function mapAppointmentStatusToPrisma(
  s: string
): 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled' | 'No_show' {
  const m: Record<string, 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled' | 'No_show'> = {
    Scheduled: 'Scheduled',
    Ongoing: 'Ongoing',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
    'No show': 'No_show',
    No_show: 'No_show',
  };
  return m[s] ?? 'Scheduled';
}

export function mapAppointmentStatusToFrontend(s: string): string {
  return APPOINTMENT_STATUS_MAP[s] ?? s;
}
