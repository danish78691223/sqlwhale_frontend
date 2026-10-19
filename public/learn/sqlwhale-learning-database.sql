-- SQLWhale Module 1 learning database setup
-- Dialect: SQLite (matches the current SQLWhale query sandbox)
-- Safe to re-run: creates missing tables and ignores duplicate sample primary keys.
-- Run only in a learning workspace. Existing tables are not dropped or replaced.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS departments (
  department_id INTEGER PRIMARY KEY,
  department_name TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  employee_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS students (
  student_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  enrolled_on TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  course_id INTEGER PRIMARY KEY,
  course_name TEXT NOT NULL,
  fee DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrolled_on TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT OR IGNORE INTO departments VALUES
  (1, 'Engineering', 'Pune'),
  (2, 'People', 'Mumbai');

INSERT OR IGNORE INTO employees VALUES
  (1, 'Aisha', 1),
  (2, 'Rahul', 2),
  (3, 'Kabir', 1);

INSERT OR IGNORE INTO students VALUES
  (1, 'Meera Shah', 'meera@example.com', '2026-01-10'),
  (2, 'Arjun Patil', 'arjun@example.com', '2026-01-12'),
  (3, 'Sara Khan', 'sara@example.com', '2026-02-01');

INSERT OR IGNORE INTO courses VALUES
  (1, 'SQL Basics', 999.00),
  (2, 'Data Analytics', 1499.00);

INSERT OR IGNORE INTO enrollments VALUES
  (1, 1, 1, '2026-01-11'),
  (2, 1, 2, '2026-01-15'),
  (3, 2, 1, '2026-01-13');

INSERT OR IGNORE INTO customers VALUES
  (1, 'Aarav Stores', 'Pune'),
  (2, 'Bluebird Cafe', 'Mumbai');

INSERT OR IGNORE INTO orders VALUES
  (1, 1, '2026-03-01', 2500.00),
  (2, 1, '2026-03-04', 750.00),
  (3, 2, '2026-03-05', 1800.00);
