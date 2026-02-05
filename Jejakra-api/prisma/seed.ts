import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const seedEmail = process.env.SEED_USER_EMAIL;
  const seedPassword = process.env.SEED_USER_PASSWORD;

  if (!seedEmail || !seedPassword) {
    throw new Error(
      'Seed credentials missing. Set SEED_USER_EMAIL and SEED_USER_PASSWORD in .env (see env.example).'
    );
  }

  const passwordHash = await argon2.hash(seedPassword);
  const user = await prisma.user.upsert({
    where: { email: seedEmail },
    create: {
      email: seedEmail,
      passwordHash,
      name: 'Dr. Sarah Chen',
      role: 'doctor',
    },
    update: {},
  });

    const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'Test Patient 1',
        gender: 'Male',
        age: 45,
        address: 'No. 1, Test Street, 00000 Demo City',
        contactNumber: '000-000-0001',
        disease: 'Hypertension',
        status: 'Active',
        registeredDate: new Date('2020-01-15'),
        lastVisit: new Date('2024-01-08'),
        lastVisitTime: '10:30 AM',
        nextAppointment: new Date('2024-02-15'),
        createdBy: user.id,
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Test Patient 2',
        gender: 'Female',
        age: 38,
        address: 'No. 2, Sample Lane, 00000 Demo City',
        contactNumber: '000-000-0002',
        disease: 'Diabetes Type 2',
        status: 'Active',
        registeredDate: new Date('2019-11-20'),
        lastVisit: new Date('2024-01-05'),
        lastVisitTime: '2:00 PM',
        nextAppointment: new Date('2024-02-10'),
        createdBy: user.id,
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Test Patient 3',
        gender: 'Male',
        age: 52,
        address: 'No. 3, Example Road, 00000 Demo City',
        contactNumber: '000-000-0003',
        disease: 'Anxiety Disorder',
        status: 'Active',
        registeredDate: new Date('2020-02-10'),
        lastVisit: new Date('2024-01-02'),
        lastVisitTime: '9:00 AM',
        nextAppointment: new Date('2024-02-20'),
        createdBy: user.id,
      },
    }),
  ]);

  const [patient1, patient2, patient3] = patients;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.appointment.createMany({
    data: [
      { patientId: patient1.id, appointmentType: 'Consultation', sessionType: 'TREATMENT', date: today, time: '8:00 AM', visitType: 'In_person', status: 'No_show', notes: 'NOTE', createdBy: user.id },
      { patientId: patient2.id, appointmentType: 'Follow_Up', sessionType: 'INTAKE_INTERVIEW', date: today, time: '9:30 AM', visitType: 'Virtual', status: 'Ongoing', createdBy: user.id },
      { patientId: patient3.id, appointmentType: 'Routine_Checkup', sessionType: 'TREATMENT', date: today, time: '11:00 AM', visitType: 'Virtual', status: 'Scheduled', createdBy: user.id },
      { patientId: patient1.id, appointmentType: 'Follow_Up', sessionType: 'TREATMENT', date: tomorrow, time: '8:00 AM', visitType: 'Virtual', status: 'Scheduled', createdBy: user.id },
    ],
  });

  console.log('Seed completed. Created user, patients, and appointments.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
