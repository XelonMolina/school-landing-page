-- Ejecutar si ya tienes la base de datos creada (sin recrear volúmenes):
-- docker exec -i school_mysql mysql -uroot -proot_secure_password school_portal < fix_existing_db.sql

USE school_portal;
SET NAMES utf8mb4;

-- Si la columna ya existe, omitir esta línea:
ALTER TABLE STUDENT ADD COLUMN address VARCHAR(200) NULL;

UPDATE STUDENT SET address = 'Av. Libertad 1234, Santiago' WHERE student_id = 1;
UPDATE STUDENT SET address = 'Calle Los Aromos 567, Providencia' WHERE student_id = 2;
UPDATE STUDENT SET address = 'Pasaje El Roble 89, Maipú' WHERE student_id = 3;

UPDATE NEWS_ACTIVITY SET
  title = 'Inicio del segundo semestre 2026',
  content = 'El colegio da la bienvenida al segundo semestre académico. Les recordamos revisar el calendario de actividades y mantenerse al día con las tareas asignadas.'
WHERE id = 1;

UPDATE NEWS_ACTIVITY SET
  title = 'Feria de Ciencias',
  content = 'Invitamos a toda la comunidad escolar a participar en la Feria de Ciencias que se realizará el próximo mes en el gimnasio del colegio.'
WHERE id = 2;

UPDATE NEWS_ACTIVITY SET
  title = 'Actualización protocolo de convivencia',
  content = 'Se ha actualizado el protocolo de convivencia escolar. Pueden consultarlo en la sección de documentos de la biblioteca virtual.'
WHERE id = 3;

UPDATE NEWS_ACTIVITY SET
  title = 'Taller de matemáticas',
  content = 'Se abrirán cupos para el taller de refuerzo de matemáticas los días miércoles después de clases.'
WHERE id = 4;

UPDATE NEWS_ACTIVITY SET
  title = 'Suspensión de clases por feriado',
  content = 'Informamos que no habrá clases el viernes 20 de junio por feriado nacional.'
WHERE id = 5;

-- Asistencia completa por asignatura (elimina registros previos y reinserta)
DELETE FROM ATTENDANCE;

INSERT INTO ATTENDANCE (student_id, course_id, attendance_date, status) VALUES
(1, 1, '2026-06-14', 'Present'), (1, 1, '2026-06-15', 'Present'), (1, 1, '2026-06-16', 'Present'),
(2, 1, '2026-06-14', 'Present'), (2, 1, '2026-06-15', 'Present'), (2, 1, '2026-06-16', 'Absent'),
(3, 1, '2026-06-14', 'Absent'),  (3, 1, '2026-06-15', 'Absent'),  (3, 1, '2026-06-16', 'Present'),
(1, 2, '2026-06-14', 'Present'), (1, 2, '2026-06-15', 'Present'), (1, 2, '2026-06-16', 'Present'),
(2, 2, '2026-06-14', 'Present'), (2, 2, '2026-06-15', 'Absent'),  (2, 2, '2026-06-16', 'Present'),
(3, 2, '2026-06-14', 'Absent'),  (3, 2, '2026-06-15', 'Absent'),  (3, 2, '2026-06-16', 'Absent'),
(1, 3, '2026-06-14', 'Present'), (1, 3, '2026-06-15', 'Present'), (1, 3, '2026-06-16', 'Late'),
(2, 3, '2026-06-14', 'Present'), (2, 3, '2026-06-15', 'Present'), (2, 3, '2026-06-16', 'Present'),
(3, 3, '2026-06-14', 'Present'), (3, 3, '2026-06-15', 'Absent'),  (3, 3, '2026-06-16', 'Present'),
(1, 4, '2026-06-14', 'Present'), (1, 4, '2026-06-15', 'Present'), (1, 4, '2026-06-16', 'Present'),
(2, 4, '2026-06-14', 'Absent'),  (2, 4, '2026-06-15', 'Present'), (2, 4, '2026-06-16', 'Present'),
(3, 4, '2026-06-14', 'Present'), (3, 4, '2026-06-15', 'Present'), (3, 4, '2026-06-16', 'Absent'),
(1, 5, '2026-06-14', 'Present'), (1, 5, '2026-06-15', 'Present'), (1, 5, '2026-06-16', 'Present'),
(2, 5, '2026-06-14', 'Present'), (2, 5, '2026-06-15', 'Present'), (2, 5, '2026-06-16', 'Late'),
(3, 5, '2026-06-14', 'Absent'),  (3, 5, '2026-06-15', 'Absent'),  (3, 5, '2026-06-16', 'Absent');
