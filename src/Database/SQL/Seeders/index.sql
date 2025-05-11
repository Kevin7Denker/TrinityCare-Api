INSERT INTO
  users (id, email, password, name, role, created_at)
VALUES
  (
    gen_random_uuid (),
    'admin@trinitycare.com',
    'hashed_admin_pass',
    'Admin Master',
    'admin',
    NOW ()
  ),
  (
    gen_random_uuid (),
    'dr.julia@trinitycare.com',
    'hashed_doc_pass',
    'Dra. Julia Santos',
    'medico',
    NOW ()
  ),
  (
    gen_random_uuid (),
    'recepcao@trinitycare.com',
    'hashed_recep_pass',
    'Carlos Silva',
    'recepcionista',
    NOW ()
  ),
  (
    gen_random_uuid (),
    'paciente.maria@trinitycare.com',
    'hashed_pac_pass',
    'Maria Oliveira',
    'paciente',
    NOW ()
  );

INSERT INTO
  doctors (id, user_id, specialty, license_number, bio)
SELECT
  gen_random_uuid (),
  u.id,
  'Cardiologia',
  'CRM123456',
  'Especialista em saúde do coração'
FROM
  users u
WHERE
  u.email = 'dr.julia@trinitycare.com';

INSERT INTO
  receptionists (id, user_id, work_shift)
SELECT
  gen_random_uuid (),
  u.id,
  'manhã'
FROM
  users u
WHERE
  u.email = 'recepcao@trinitycare.com';

INSERT INTO
  patients (id, user_id, date_of_birth, gender, medical_info)
SELECT
  gen_random_uuid (),
  u.id,
  '1990-08-15',
  'Feminino',
  '{"alergias": "penicilina"}'
FROM
  users u
WHERE
  u.email = 'paciente.maria@trinitycare.com';

INSERT INTO
  schedules (id, doctor_id, day_of_week, start_time, end_time)
SELECT
  gen_random_uuid (),
  d.id,
  1,
  '08:00',
  '12:00'
FROM
  doctors d;

INSERT INTO
  appointments (
    id,
    patient_id,
    doctor_id,
    receptionist_id,
    scheduled_time,
    status,
    notes
  )
SELECT
  gen_random_uuid (),
  p.id,
  d.id,
  r.id,
  NOW () + interval '2 days',
  'agendada',
  'Consulta de rotina'
FROM
  patients p,
  doctors d,
  receptionists r;

INSERT INTO
  medical_records (
    id,
    appointment_id,
    doctor_id,
    patient_id,
    description,
    prescriptions,
    created_at
  )
SELECT
  gen_random_uuid (),
  a.id,
  a.doctor_id,
  a.patient_id,
  'Paciente apresentou dor no peito.',
  '{"medicamentos": ["AAS", "Losartana"]}',
  NOW ()
FROM
  appointments a;

INSERT INTO
  "Permissions" (id, role, resource)
VALUES
  (gen_random_uuid (), 'admin', '*'),
  (gen_random_uuid (), 'medico', 'appointments'),
  (gen_random_uuid (), 'recepcionista', 'schedules'),
  (gen_random_uuid (), 'paciente', 'medical_records');