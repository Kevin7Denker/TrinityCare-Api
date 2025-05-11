CREATE TABLE
  IF NOT EXISTS "Users" (
    "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" UUID REFERENCES "Permissions" ("id"),
    "created_at" TIMESTAMP DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS "Patients" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES "Users" ("id") ON DELETE CASCADE,
    "date_of_birth" DATE,
    "gender" TEXT,
    "medical_info" JSONB DEFAULT '{}'
  );

CREATE TABLE
  IF NOT EXISTS "Doctors" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES "Users" ("id") ON DELETE CASCADE,
    "specialty" TEXT,
    "medical_license_number" TEXT
  );

CREATE TABLE
  IF NOT EXISTS "Receptionists" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES "Users" ("id") ON DELETE CASCADE,
    "work_shift" TEXT
  );

CREATE TABLE
  IF NOT EXISTS "Appointments" (
    "id" UUID PRIMARY KEY,
    "patient_id" UUID REFERENCES "Patients" ("id") ON DELETE SET NULL,
    "doctor_id" UUID REFERENCES "Doctors" ("id") ON DELETE SET NULL,
    "receptionist_id" UUID REFERENCES "Receptionists" ("id") ON DELETE SET NULL,
    "scheduled_time" TIMESTAMP NOT NULL,
    "status" TEXT CHECK (
      "status" IN ('agendada', 'realizada', 'cancelada')
    ),
    "notes" TEXT
  );

CREATE TABLE
  IF NOT EXISTS "Schedules" (
    "id" UUID PRIMARY KEY,
    "doctor_id" UUID REFERENCES "Doctors" ("id") ON DELETE CASCADE,
    "day_of_week" INTEGER CHECK ("day_of_week" BETWEEN 0 AND 6),
    "start_time" TIME,
    "end_time" TIME
  );

CREATE TABLE
  IF NOT EXISTS "Medical_Records" (
    "id" UUID PRIMARY KEY,
    "appointment_id" UUID REFERENCES "Appointments" ("id") ON DELETE CASCADE,
    "doctor_id" UUID REFERENCES "Doctors" ("id") ON DELETE SET NULL,
    "patient_id" UUID REFERENCES "Patients" ("id") ON DELETE SET NULL,
    "description" TEXT,
    "prescriptions" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS "Permissions" (
    "id" UUID PRIMARY KEY,
    "role" TEXT NOT NULL,
    "resource" TEXT
  );