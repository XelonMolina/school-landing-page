CREATE DATABASE IF NOT EXISTS school_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE school_portal;

SET NAMES utf8mb4;

-- 1. USER (Modificado: rut en lugar de username)
CREATE TABLE USER (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE, 
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Teacher', 'Student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. STUDENT (Modificado: se agregaron email y emergency_contact)
CREATE TABLE STUDENT (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(150),
    address VARCHAR(200),
    emergency_contact VARCHAR(50),
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) 
        REFERENCES USER(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. TEACHER
CREATE TABLE TEACHER (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) 
        REFERENCES USER(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. COURSE
CREATE TABLE COURSE (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    academic_year INT NOT NULL
) ENGINE=InnoDB;

-- 5. ENROLLMENT
CREATE TABLE ENROLLMENT (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) 
        REFERENCES STUDENT(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) 
        REFERENCES COURSE(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. GRADE
CREATE TABLE GRADE (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    grade_value DECIMAL(3,1) NOT NULL, 
    description VARCHAR(150),
    evaluation_date DATE NOT NULL,
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES STUDENT(student_id),
    CONSTRAINT fk_grade_course FOREIGN KEY (course_id) REFERENCES COURSE(course_id),
    CONSTRAINT fk_grade_teacher FOREIGN KEY (teacher_id) REFERENCES TEACHER(teacher_id)
) ENGINE=InnoDB;

-- 7. ATTENDANCE
CREATE TABLE ATTENDANCE (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES STUDENT(student_id),
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id) REFERENCES COURSE(course_id)
) ENGINE=InnoDB;

-- 8. NEWS_ACTIVITY
CREATE TABLE NEWS_ACTIVITY (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    post_type ENUM('News', 'Activity') NOT NULL,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(500) NULL,
    attachment_url VARCHAR(500) NULL,
    CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES USER(user_id)
) ENGINE=InnoDB;

-- ============================================================
-- DATOS DE EJEMPLO (password para todos: 123456)
-- ============================================================
INSERT INTO USER (rut, password_hash, role) VALUES
('11111111-1', '$2b$10$oKfOUdGalRnb6i0yVj8oyO7oRIed6Cyf08/a5RwN1p1dFZvoOD1Xe', 'Admin'),
('22222222-2', '$2b$10$oKfOUdGalRnb6i0yVj8oyO7oRIed6Cyf08/a5RwN1p1dFZvoOD1Xe', 'Teacher'),
('33333333-3', '$2b$10$oKfOUdGalRnb6i0yVj8oyO7oRIed6Cyf08/a5RwN1p1dFZvoOD1Xe', 'Student'),
('44444444-4', '$2b$10$oKfOUdGalRnb6i0yVj8oyO7oRIed6Cyf08/a5RwN1p1dFZvoOD1Xe', 'Student'),
('55555555-5', '$2b$10$oKfOUdGalRnb6i0yVj8oyO7oRIed6Cyf08/a5RwN1p1dFZvoOD1Xe', 'Student');

INSERT INTO TEACHER (user_id, first_name, last_name, department) VALUES
(2, 'María', 'González', 'Ciencias');

INSERT INTO STUDENT (user_id, first_name, last_name, date_of_birth, email, address, emergency_contact) VALUES
(3, 'Juan', 'Pérez', '2010-03-15', 'juan.perez@colegio.cl', 'Av. Libertad 1234, Santiago', '+56 9 1111 1111'),
(4, 'Ana', 'López', '2010-07-22', 'ana.lopez@colegio.cl', 'Calle Los Aromos 567, Providencia', '+56 9 2222 2222'),
(5, 'Carlos', 'Muñoz', '2010-11-08', 'carlos.munoz@colegio.cl', 'Pasaje El Roble 89, Maipú', '+56 9 3333 3333');

INSERT INTO COURSE (name, level, academic_year) VALUES
('Lenguaje', '1° Medio', 2026),
('Matemáticas', '1° Medio', 2026),
('Historia', '1° Medio', 2026),
('Educación Física', '1° Medio', 2026),
('Inglés', '1° Medio', 2026),
('Lenguaje', '2° Medio', 2026),
('Matemáticas', '2° Medio', 2026);

INSERT INTO ENROLLMENT (student_id, course_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5);

INSERT INTO GRADE (student_id, course_id, teacher_id, grade_value, description, evaluation_date) VALUES
(1, 1, 1, 6.8, 'Promedio semestral', '2026-06-01'),
(1, 2, 1, 6.2, 'Promedio semestral', '2026-06-01'),
(1, 3, 1, 7.0, 'Promedio semestral', '2026-06-01'),
(2, 1, 1, 5.5, 'Promedio semestral', '2026-06-01'),
(2, 2, 1, 6.9, 'Promedio semestral', '2026-06-01'),
(2, 3, 1, 4.2, 'Promedio semestral', '2026-06-01'),
(3, 1, 1, 3.8, 'Promedio semestral', '2026-06-01'),
(3, 2, 1, 2.4, 'Promedio semestral', '2026-06-01'),
(3, 3, 1, 5.0, 'Promedio semestral', '2026-06-01');

INSERT INTO ATTENDANCE (student_id, course_id, attendance_date, status) VALUES
-- Lenguaje (curso 1)
(1, 1, '2026-06-14', 'Present'), (1, 1, '2026-06-15', 'Present'), (1, 1, '2026-06-16', 'Present'),
(2, 1, '2026-06-14', 'Present'), (2, 1, '2026-06-15', 'Present'), (2, 1, '2026-06-16', 'Absent'),
(3, 1, '2026-06-14', 'Absent'),  (3, 1, '2026-06-15', 'Absent'),  (3, 1, '2026-06-16', 'Present'),
-- Matemáticas (curso 2)
(1, 2, '2026-06-14', 'Present'), (1, 2, '2026-06-15', 'Present'), (1, 2, '2026-06-16', 'Present'),
(2, 2, '2026-06-14', 'Present'), (2, 2, '2026-06-15', 'Absent'),  (2, 2, '2026-06-16', 'Present'),
(3, 2, '2026-06-14', 'Absent'),  (3, 2, '2026-06-15', 'Absent'),  (3, 2, '2026-06-16', 'Absent'),
-- Historia (curso 3)
(1, 3, '2026-06-14', 'Present'), (1, 3, '2026-06-15', 'Present'), (1, 3, '2026-06-16', 'Late'),
(2, 3, '2026-06-14', 'Present'), (2, 3, '2026-06-15', 'Present'), (2, 3, '2026-06-16', 'Present'),
(3, 3, '2026-06-14', 'Present'), (3, 3, '2026-06-15', 'Absent'),  (3, 3, '2026-06-16', 'Present'),
-- Educación Física (curso 4)
(1, 4, '2026-06-14', 'Present'), (1, 4, '2026-06-15', 'Present'), (1, 4, '2026-06-16', 'Present'),
(2, 4, '2026-06-14', 'Absent'),  (2, 4, '2026-06-15', 'Present'), (2, 4, '2026-06-16', 'Present'),
(3, 4, '2026-06-14', 'Present'), (3, 4, '2026-06-15', 'Present'), (3, 4, '2026-06-16', 'Absent'),
-- Inglés (curso 5)
(1, 5, '2026-06-14', 'Present'), (1, 5, '2026-06-15', 'Present'), (1, 5, '2026-06-16', 'Present'),
(2, 5, '2026-06-14', 'Present'), (2, 5, '2026-06-15', 'Present'), (2, 5, '2026-06-16', 'Late'),
(3, 5, '2026-06-14', 'Absent'),  (3, 5, '2026-06-15', 'Absent'),  (3, 5, '2026-06-16', 'Absent');

INSERT INTO NEWS_ACTIVITY (author_id, title, content, post_type, image_url) VALUES
(1, 'Inicio del segundo semestre 2026', 'El colegio da la bienvenida al segundo semestre académico. Les recordamos revisar el calendario de actividades y mantenerse al día con las tareas asignadas.', 'News', NULL),
(2, 'Feria de Ciencias', 'Invitamos a toda la comunidad escolar a participar en la Feria de Ciencias que se realizará el próximo mes en el gimnasio del colegio.', 'Activity', NULL),
(1, 'Actualización protocolo de convivencia', 'Se ha actualizado el protocolo de convivencia escolar. Pueden consultarlo en la sección de documentos de la biblioteca virtual.', 'News', NULL),
(2, 'Taller de matemáticas', 'Se abrirán cupos para el taller de refuerzo de matemáticas los días miércoles después de clases.', 'Activity', NULL),
(1, 'Suspensión de clases por feriado', 'Informamos que no habrá clases el viernes 20 de junio por feriado nacional.', 'News', NULL);