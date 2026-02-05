import { prisma } from '../../config/index.js';
import { toFrontendAppointment } from '../../utils/transform.js';
import {
  mapAppointmentTypeToPrisma,
  mapSessionTypeToPrisma,
  mapVisitTypeToPrisma,
  mapAppointmentStatusToPrisma,
} from '../../utils/transform.js';

const ALLOWED_TIME_SLOTS = ['8:00 AM', '9:30 AM', '11:00 AM', '12:30 PM', '3:00 PM', '4:30 PM'];

export async function listAppointments(params: {
  date?: string;
  patientId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 50));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params.date) {
    const d = new Date(params.date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    where.date = { gte: d, lt: next };
  }
  if (params.patientId) {
    where.patientId = params.patientId;
  }
  if (params.status) {
    where.status = mapAppointmentStatusToPrisma(params.status);
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { patient: { select: { id: true, name: true, contactNumber: true } } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      skip,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    data: appointments.map(toFrontendAppointment),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAppointmentById(id: string) {
  const apt = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: { select: { id: true, name: true, contactNumber: true } } },
  });
  if (!apt) {
    const err = new Error('Appointment not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  return toFrontendAppointment(apt);
}

export async function getAppointmentsByPatientId(patientId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    include: { patient: { select: { id: true, name: true, contactNumber: true } } },
    orderBy: [{ date: 'desc' }, { time: 'desc' }],
  });
  return appointments.map(toFrontendAppointment);
}

export async function createAppointment(
  data: {
    patient_id?: string;
    patientName?: string;
    appointment_type: string;
    session_type?: string;
    date: string;
    time: string;
    visit_type: string;
    reason?: string;
    notes?: string;
  },
  userId?: string
) {
  let patientId = data.patient_id;
  if (!patientId && data.patientName) {
    const p = await prisma.patient.findFirst({
      where: { name: { equals: data.patientName, mode: 'insensitive' } },
    });
    if (p) patientId = p.id;
  }
  if (!patientId) {
    const err = new Error('Patient not found. Provide patient_id or patientName.') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  if (!ALLOWED_TIME_SLOTS.includes(data.time)) {
    const err = new Error(`Invalid time slot. Allowed: ${ALLOWED_TIME_SLOTS.join(', ')}`) as Error & { status: number };
    err.status = 400;
    throw err;
  }

  const patient = await prisma.patient.findUnique({ where: { id: data.patient_id } });
  if (!patient) {
    const err = new Error('Patient not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  // Check slot availability
  const aptDate = new Date(data.date);
  const existing = await prisma.appointment.findFirst({
    where: {
      date: aptDate,
      time: data.time,
      status: { in: ['Scheduled', 'Ongoing'] },
    },
  });
  if (existing) {
    const err = new Error('Time slot already booked') as Error & { status: number };
    err.status = 409;
    throw err;
  }

  const apt = await prisma.appointment.create({
    data: {
      patientId,
      appointmentType: mapAppointmentTypeToPrisma(data.appointment_type),
      sessionType: data.session_type ? mapSessionTypeToPrisma(data.session_type) : undefined,
      date: aptDate,
      time: data.time,
      visitType: mapVisitTypeToPrisma(data.visit_type),
      reason: data.reason,
      notes: data.notes,
      createdBy: userId,
    },
    include: { patient: { select: { id: true, name: true, contactNumber: true } } },
  });

  return toFrontendAppointment(apt);
}

export async function updateAppointment(
  id: string,
  data: Partial<{
    appointment_type: string;
    session_type: string;
    date: string;
    time: string;
    visit_type: string;
    status: string;
    reason: string;
    notes: string;
  }>
) {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Appointment not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const updateData: Record<string, unknown> = {};
  if (data.appointment_type) updateData.appointmentType = mapAppointmentTypeToPrisma(data.appointment_type);
  if (data.session_type) updateData.sessionType = mapSessionTypeToPrisma(data.session_type);
  if (data.date) updateData.date = new Date(data.date);
  if (data.time) {
    if (!ALLOWED_TIME_SLOTS.includes(data.time)) {
      const err = new Error(`Invalid time slot`) as Error & { status: number };
      err.status = 400;
      throw err;
    }
    updateData.time = data.time;
  }
  if (data.visit_type) updateData.visitType = mapVisitTypeToPrisma(data.visit_type);
  if (data.status) updateData.status = mapAppointmentStatusToPrisma(data.status);
  if (data.reason !== undefined) updateData.reason = data.reason;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const apt = await prisma.appointment.update({
    where: { id },
    data: updateData,
    include: { patient: { select: { id: true, name: true, contactNumber: true } } },
  });

  return toFrontendAppointment(apt);
}

export async function deleteAppointment(id: string) {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Appointment not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  await prisma.appointment.delete({ where: { id } });
}
