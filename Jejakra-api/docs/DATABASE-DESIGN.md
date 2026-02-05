# Jejakra Database Design

**PostgreSQL schema and database operations for the Jejakra backend.**  
Version 1.0 | Last Updated: February 2026

This document describes the database schema, tables, relationships, and operations used by the Jejakra API. For API endpoints, authentication, and deployment, see [API Documentation](./API-DOCUMENTATION.md).

---

## Table of Contents

1. [Users Table](#1-users-table)
2. [Patients Table](#2-patients-table)
3. [Patient Details Table](#3-patient-details-table)
4. [Appointments Table](#4-appointments-table)
5. [Activity Log Table](#5-activity-log-table)
6. [Entity Relationship Diagram](#6-entity-relationship-diagram)
7. [Prisma Schema (Source)](#7-prisma-schema-source)
8. [Database Operations](#8-database-operations)

---

## 1. Users Table

Stores user accounts with role-based access control. Table name: `users`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login identifier |
| password_hash | VARCHAR(255) | NOT NULL | Argon2 hashed |
| name | VARCHAR(255) | NOT NULL | Display name |
| role | ENUM | NOT NULL | `doctor` \| `user` \| `admin` |
| avatar | VARCHAR(512) | NULL | Profile image URL |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | AUTO UPDATE | |

---

## 2. Patients Table

Core patient demographic and status information. Table name: `patients`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| name | VARCHAR(255) | NOT NULL | |
| gender | ENUM | NULL | `Male` \| `Female` \| `Other` |
| age | INTEGER | NULL | |
| address | TEXT | NULL | |
| contact_number | VARCHAR(20) | NULL | Malaysian format |
| disease | VARCHAR(255) | NULL | Primary diagnosis |
| status | ENUM | NOT NULL | `Active` \| `Inactive` \| `New` \| `Archived` \| `Pending` |
| registered_date | DATE | NOT NULL | |
| last_visit | DATE | NULL | |
| last_visit_time | VARCHAR | NULL | e.g. "10:30 AM" |
| next_appointment | DATE | NULL | |
| created_by | UUID | FK users | Optional audit |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | AUTO UPDATE | |

**Indexes:** `status`, `gender`, `registered_date`

---

## 3. Patient Details Table

Extended clinical and medical information (1:1 with patients). Table name: `patient_details`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| patient_id | UUID | FK patients, UNIQUE | |
| weight | DECIMAL(5,2) | NULL | kg |
| height | DECIMAL(5,2) | NULL | cm |
| bmi | DECIMAL(4,2) | NULL | |
| body_temperature | DECIMAL(4,2) | NULL | Celsius |
| heart_rate | INTEGER | NULL | bpm |
| chronic_conditions | JSONB | NULL | Array of strings |
| past_major_illnesses | VARCHAR(10) | NULL | `Yes` \| `No` |
| past_major_illnesses_details | TEXT | NULL | |
| previous_surgeries | VARCHAR(10) | NULL | `Yes` \| `No` |
| prescription_drugs | JSONB | NULL | Array of strings |
| over_the_counter_meds | JSONB | NULL | Array of strings |
| medication_notes | TEXT | NULL | |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | AUTO UPDATE | |

---

## 4. Appointments Table

Scheduling and appointment tracking. Table name: `appointments`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| patient_id | UUID | FK patients, NOT NULL | |
| appointment_type | ENUM | NOT NULL | Consultation \| Follow_Up \| Routine_Checkup |
| session_type | ENUM | NULL | TREATMENT \| INTAKE_INTERVIEW \| FOLLOW_UP \| FINAL_SESSION |
| date | DATE | NOT NULL | |
| time | VARCHAR | NOT NULL | Fixed slots (see below) |
| visit_type | ENUM | NOT NULL | In_person \| Virtual |
| status | ENUM | NOT NULL | Scheduled \| Ongoing \| Completed \| Cancelled \| No_show |
| notes | TEXT | NULL | |
| reason | TEXT | NULL | |
| created_by | UUID | FK users | Optional |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | AUTO UPDATE | |

**Fixed time slots:** 8:00 AM, 9:30 AM, 11:00 AM, 12:30 PM, 3:00 PM, 4:30 PM

**Indexes:** `patient_id`, `(date, time)`, `status`

---

## 5. Activity Log Table

Tracks system actions for dashboard and audit. Table name: `activity_log`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| entity_type | VARCHAR(50) | NOT NULL | `patient` \| `appointment` |
| entity_id | UUID | NOT NULL | |
| action | VARCHAR(50) | NOT NULL | `created` \| `updated` \| `deleted` |
| user_id | UUID | FK users | Optional |
| metadata | JSONB | NULL | |
| created_at | TIMESTAMP | DEFAULT now() | |

**Index:** `created_at DESC`

---

## 6. Entity Relationship Diagram

```
users (1) ──────────> (0..n) patients [created_by]
users (1) ──────────> (0..n) appointments [created_by]
users (1) ──────────> (0..n) activity_log [user_id]

patients (1) ───────> (0..1) patient_details
patients (1) ───────> (0..n) appointments
```

---

## 7. Prisma Schema (Source)

Exact schema from `prisma/schema.prisma`:

```prisma
// Prisma schema for Jejakra
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  doctor
  user
  admin
}

enum PatientGender {
  Male
  Female
  Other
}

enum PatientStatus {
  Active
  Inactive
  New
  Archived
  Pending
}

enum AppointmentType {
  Consultation
  Follow_Up
  Routine_Checkup
}

enum SessionType {
  TREATMENT
  INTAKE_INTERVIEW
  FOLLOW_UP
  FINAL_SESSION
}

enum VisitType {
  In_person
  Virtual
}

enum AppointmentStatus {
  Scheduled
  Ongoing
  Completed
  Cancelled
  No_show
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  name          String
  role          UserRole  @default(doctor)
  avatar        String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  patients      Patient[]      @relation("CreatedPatients")
  appointments  Appointment[]  @relation("CreatedAppointments")
  activityLogs  ActivityLog[]

  @@map("users")
}

model Patient {
  id               String         @id @default(uuid())
  name             String
  gender           PatientGender?
  age              Int?
  address          String?
  contactNumber    String?        @map("contact_number")
  disease          String?
  status           PatientStatus  @default(Active)
  registeredDate   DateTime       @db.Date @map("registered_date")
  lastVisit        DateTime?      @db.Date @map("last_visit")
  lastVisitTime    String?        @map("last_visit_time")
  nextAppointment  DateTime?      @db.Date @map("next_appointment")
  createdBy        String?        @map("created_by")
  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")

  createdByUser User?          @relation("CreatedPatients", fields: [createdBy], references: [id])
  details       PatientDetails?
  appointments  Appointment[]

  @@index([status])
  @@index([gender])
  @@index([registeredDate])
  @@map("patients")
}

model PatientDetails {
  id                        String   @id @default(uuid())
  patientId                 String   @unique @map("patient_id")
  weight                    Decimal? @db.Decimal(5, 2)
  height                    Decimal? @db.Decimal(5, 2)
  bmi                       Decimal? @db.Decimal(4, 2)
  bodyTemperature           Decimal? @map("body_temperature") @db.Decimal(4, 2)
  heartRate                 Int?
  chronicConditions         Json?    @map("chronic_conditions")
  pastMajorIllnesses        String?  @map("past_major_illnesses")
  pastMajorIllnessesDetails String?  @map("past_major_illnesses_details")
  previousSurgeries         String?  @map("previous_surgeries")
  prescriptionDrugs         Json?    @map("prescription_drugs")
  overTheCounterMeds        Json?    @map("over_the_counter_meds")
  medicationNotes           String?  @map("medication_notes")
  createdAt                 DateTime @default(now()) @map("created_at")
  updatedAt                 DateTime @updatedAt @map("updated_at")

  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("patient_details")
}

model Appointment {
  id              String            @id @default(uuid())
  patientId       String            @map("patient_id")
  appointmentType AppointmentType   @map("appointment_type")
  sessionType     SessionType?      @map("session_type")
  date            DateTime          @db.Date
  time            String
  visitType       VisitType         @map("visit_type")
  status          AppointmentStatus @default(Scheduled)
  notes           String?
  reason          String?
  createdBy       String?           @map("created_by")
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  patient      Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  createdByUser User?   @relation("CreatedAppointments", fields: [createdBy], references: [id])

  @@index([patientId])
  @@index([date, time])
  @@index([status])
  @@map("appointments")
}

model ActivityLog {
  id         String   @id @default(uuid())
  entityType String   @map("entity_type")
  entityId   String   @map("entity_id")
  action     String
  userId     String?  @map("user_id")
  metadata   Json?
  createdAt  DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id])

  @@index([createdAt(sort: Desc)])
  @@map("activity_log")
}
```

---

## 8. Database Operations

```bash
npx prisma generate      # Generate client
npx prisma db push       # Push schema (dev)
npx prisma migrate dev   # Create/apply migrations
npx prisma db seed       # Run seed (user + patients + appointments)
npx prisma studio        # DB GUI
```

---

For API endpoints, authentication, and deployment, see [API Documentation](./API-DOCUMENTATION.md).

*End of Database Design Documentation*
