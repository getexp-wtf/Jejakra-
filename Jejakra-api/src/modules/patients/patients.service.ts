import { prisma } from '../../config/index.js';
import { toFrontendPatient } from '../../utils/transform.js';
import type { PatientStatus, PatientGender } from '@prisma/client';

export async function listPatients(params: {
  search?: string;
  gender?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 50));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params.search?.trim()) {
    const q = params.search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { contactNumber: { contains: q } },
      { disease: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (params.gender && params.gender !== 'All') {
    where.gender = params.gender as PatientGender;
  }
  if (params.status && params.status !== 'All') {
    where.status = params.status as PatientStatus;
  }

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: { details: true },
      orderBy: { registeredDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    data: patients.map(toFrontendPatient),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPatientById(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { details: true },
  });
  if (!patient) {
    const err = new Error('Patient not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  return toFrontendPatient(patient);
}

export async function createPatient(data: {
  name: string;
  gender?: string;
  age?: number | string;
  address?: string;
  contactNumber?: string;
  disease?: string;
  status?: string;
  registeredDate?: string;
  details?: Record<string, unknown>;
}, userId?: string) {
  const regDate = data.registeredDate ? new Date(data.registeredDate) : new Date();
  const ageNum = typeof data.age === 'string' ? parseInt(data.age, 10) : data.age;

  const patient = await prisma.patient.create({
    data: {
      name: data.name,
      gender: data.gender && data.gender !== 'All' ? (data.gender as PatientGender) : undefined,
      age: !isNaN(Number(ageNum)) ? ageNum : undefined,
      address: data.address,
      contactNumber: data.contactNumber,
      disease: data.disease,
      status: (data.status as PatientStatus) ?? 'Active',
      registeredDate: regDate,
      createdBy: userId,
      details: data.details
        ? {
            create: {
              weight: data.details.weight != null ? Number(data.details.weight) : undefined,
              height: data.details.height != null ? Number(data.details.height) : undefined,
              bmi: data.details.bmi != null ? Number(data.details.bmi) : undefined,
              bodyTemperature: data.details.bodyTemperature != null ? Number(data.details.bodyTemperature) : undefined,
              heartRate: data.details.heartRate != null ? Number(data.details.heartRate) : undefined,
              chronicConditions: (data.details.chronicConditions as string[]) ?? [],
              pastMajorIllnesses: (data.details.pastMajorIllnesses as string) ?? 'No',
              pastMajorIllnessesDetails: data.details.pastMajorIllnessesDetails as string,
              previousSurgeries: (data.details.previousSurgeries as string) ?? 'No',
              prescriptionDrugs: (data.details.prescriptionDrugs as string[]) ?? [],
              overTheCounterMeds: (data.details.overTheCounterMeds as string[]) ?? [],
              medicationNotes: data.details.medicationNotes as string,
            },
          }
        : undefined,
    },
    include: { details: true },
  });

  return toFrontendPatient(patient);
}

export async function updatePatient(
  id: string,
  data: Partial<{
    name: string;
    gender: string;
    age: number | string;
    address: string;
    contactNumber: string;
    disease: string;
    status: string;
    lastVisit: string | null;
    lastVisitTime: string | null;
    nextAppointment: string | null;
    details: Record<string, unknown>;
  }>
) {
  const existing = await prisma.patient.findUnique({ where: { id }, include: { details: true } });
  if (!existing) {
    const err = new Error('Patient not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const ageNum = data.age != null ? (typeof data.age === 'string' ? parseInt(data.age, 10) : data.age) : undefined;

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.gender && { gender: data.gender as PatientGender }),
      ...(ageNum !== undefined && !isNaN(ageNum) && { age: ageNum }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.contactNumber !== undefined && { contactNumber: data.contactNumber }),
      ...(data.disease !== undefined && { disease: data.disease }),
      ...(data.status && { status: data.status as PatientStatus }),
      ...(data.lastVisit !== undefined && { lastVisit: data.lastVisit ? new Date(data.lastVisit) : null }),
      ...(data.lastVisitTime !== undefined && { lastVisitTime: data.lastVisitTime }),
      ...(data.nextAppointment !== undefined && {
        nextAppointment: data.nextAppointment ? new Date(data.nextAppointment) : null,
      }),
      ...(data.details && {
        details: {
          upsert: {
            create: {
              weight: data.details.weight != null ? Number(data.details.weight) : undefined,
              height: data.details.height != null ? Number(data.details.height) : undefined,
              bmi: data.details.bmi != null ? Number(data.details.bmi) : undefined,
              bodyTemperature: data.details.bodyTemperature != null ? Number(data.details.bodyTemperature) : undefined,
              heartRate: data.details.heartRate != null ? Number(data.details.heartRate) : undefined,
              chronicConditions: (data.details.chronicConditions as string[]) ?? [],
              pastMajorIllnesses: (data.details.pastMajorIllnesses as string) ?? 'No',
              pastMajorIllnessesDetails: data.details.pastMajorIllnessesDetails as string,
              previousSurgeries: (data.details.previousSurgeries as string) ?? 'No',
              prescriptionDrugs: (data.details.prescriptionDrugs as string[]) ?? [],
              overTheCounterMeds: (data.details.overTheCounterMeds as string[]) ?? [],
              medicationNotes: data.details.medicationNotes as string,
            },
            update: {
              weight: data.details.weight != null ? Number(data.details.weight) : undefined,
              height: data.details.height != null ? Number(data.details.height) : undefined,
              bmi: data.details.bmi != null ? Number(data.details.bmi) : undefined,
              bodyTemperature: data.details.bodyTemperature != null ? Number(data.details.bodyTemperature) : undefined,
              heartRate: data.details.heartRate != null ? Number(data.details.heartRate) : undefined,
              chronicConditions: (data.details.chronicConditions as string[]) ?? undefined,
              pastMajorIllnesses: (data.details.pastMajorIllnesses as string) ?? undefined,
              pastMajorIllnessesDetails: (data.details.pastMajorIllnessesDetails as string) ?? undefined,
              previousSurgeries: (data.details.previousSurgeries as string) ?? undefined,
              prescriptionDrugs: (data.details.prescriptionDrugs as string[]) ?? undefined,
              overTheCounterMeds: (data.details.overTheCounterMeds as string[]) ?? undefined,
              medicationNotes: (data.details.medicationNotes as string) ?? undefined,
            },
          },
        },
      }),
    },
    include: { details: true },
  });

  return toFrontendPatient(patient);
}

export async function deletePatient(id: string) {
  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Patient not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  await prisma.patient.delete({ where: { id } });
}
