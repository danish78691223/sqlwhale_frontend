import type { LessonModule } from "./types";

const moduleOne: LessonModule = {
  id: 1,
  title: "SQL & Database Foundations",
  difficulty: "Beginner",
  estimatedTime: "45–60 minutes",
  summary: "Understand data, relational databases, SQL, tables, relationships, data types and the commands used to work with a database.",
  outcomes: [
    "Explain data, databases, SQL and the difference between relational and NoSQL systems.",
    "Identify tables, rows, columns, records, primary keys and foreign keys.",
    "Recognize major SQL milestones, standards and popular database engines.",
    "Classify DDL, DML, DQL, DCL and TCL commands.",
    "Read basic SQL syntax and choose suitable data types."
  ],
  analogy: "Imagine a college office. Student details, course details and enrolments are kept in separate registers. Each register is a table, each line is a row, and each labelled field is a column. SQL is the set of instructions you use to ask the office for information.",
  sections: [
    { heading: "1. Data, databases and SQL", body: "Data means recorded facts, such as a student's name or a course fee. A database is an organized collection of related data. SQL stands for Structured Query Language; it is a language for defining, reading and changing data in relational databases. A database management system (DBMS) is software that stores data and runs queries." },
    { heading: "2. Relational databases and NoSQL", body: "An RDBMS stores data in tables with defined columns and relationships. Examples include SQLite, MySQL, PostgreSQL, SQL Server and Oracle. NoSQL is a broad family of systems that may store documents, key-value pairs, graphs or wide-column records. Neither is automatically best for every job; choose based on data shape, consistency needs and workload." },
    { heading: "3. Tables, rows, columns and relationships", body: "A table stores one kind of entity. A row (also called a record) describes one item. A column (also called a field or attribute) describes one property. A primary key uniquely identifies a row. A foreign key points to a key in another table and connects related records." },
    { heading: "4. A short history of SQL", body: "In 1970, computer scientist E. F. Codd published the relational model. At IBM, Donald Chamberlin and Raymond Boyce developed SEQUEL in the 1970s; it later became known as SQL. SQL became an ANSI standard in 1986 and an ISO standard in 1987. It has continued to evolve through standardized features and database-specific extensions." },
    { heading: "5. SQL standards and database engines", body: "SQL standards describe common language features, but engines do not implement every feature identically. MySQL and PostgreSQL are popular server databases; Microsoft SQL Server and Oracle Database are widely used enterprise systems; SQLite is a small embedded database. Check the engine documentation when syntax or behavior differs." },
    { heading: "6. SQL command families", body: "DDL (Data Definition Language) defines structures, for example CREATE TABLE. DML (Data Manipulation Language) changes rows, for example INSERT, UPDATE and DELETE. DQL (Data Query Language) reads data, especially SELECT. DCL (Data Control Language) manages permissions, for example GRANT and REVOKE. TCL (Transaction Control Language) controls transactions, for example COMMIT and ROLLBACK." },
    { heading: "7. Syntax rules and data types", body: "SQL keywords are commonly written in uppercase for readability, but they are generally case-insensitive. Text values use single quotes. A semicolon commonly ends a statement. INT stores whole numbers, VARCHAR(n) stores variable-length text, DATE stores calendar dates, DECIMAL(p,s) stores exact decimal values such as money, and BOOLEAN represents true/false where supported. SQLite uses flexible storage classes, so some type names behave differently than in MySQL or PostgreSQL." },
    { heading: "8. Our shared practice database", body: "All upcoming modules will use the same teaching dataset: students, courses, enrollments, employees, departments, customers and orders. The relationships are: one student can have many enrolments; one course can have many enrolments; one department can have many employees; one customer can place many orders. This starter script is SQLite-compatible, matching SQLWhale's current query sandbox.", examples: [
      { title: "Create the teaching tables", concept: "CREATE TABLE defines a table's columns and constraints. A primary key identifies each row; a foreign key links a row to a related table.", analogy: "Think of this as printing blank registers and deciding which ID connects each register to another.", sql: `PRAGMA foreign_keys = ON;

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
  (1, 'Engineering', 'Pune'), (2, 'People', 'Mumbai');
INSERT OR IGNORE INTO employees VALUES
  (1, 'Aisha', 1), (2, 'Rahul', 2), (3, 'Kabir', 1);
INSERT OR IGNORE INTO students VALUES
  (1, 'Meera Shah', 'meera@example.com', '2026-01-10'),
  (2, 'Arjun Patil', 'arjun@example.com', '2026-01-12'),
  (3, 'Sara Khan', 'sara@example.com', '2026-02-01');
INSERT OR IGNORE INTO courses VALUES
  (1, 'SQL Basics', 999.00), (2, 'Data Analytics', 1499.00);
INSERT OR IGNORE INTO enrollments VALUES
  (1, 1, 1, '2026-01-11'), (2, 1, 2, '2026-01-15'),
  (3, 2, 1, '2026-01-13');
INSERT OR IGNORE INTO customers VALUES
  (1, 'Aarav Stores', 'Pune'), (2, 'Bluebird Cafe', 'Mumbai');
INSERT OR IGNORE INTO orders VALUES
  (1, 1, '2026-03-01', 2500.00), (2, 1, '2026-03-04', 750.00),
  (3, 2, '2026-03-05', 1800.00);`,
        explanation: [
          { line: "PRAGMA foreign_keys = ON;", meaning: "Enables SQLite foreign-key enforcement for this database connection." },
          { line: "CREATE TABLE IF NOT EXISTS ...", meaning: "Creates each table only when it does not already exist." },
          { line: "INTEGER PRIMARY KEY", meaning: "Uses an integer row identifier as the table's primary key in SQLite." },
          { line: "TEXT NOT NULL", meaning: "Stores text and requires a value." },
          { line: "UNIQUE", meaning: "Prevents duplicate non-NULL values in that column." },
          { line: "FOREIGN KEY ... REFERENCES", meaning: "Connects a child row to an existing row in the referenced table." },
          { line: "INSERT OR IGNORE", meaning: "Adds the sample rows while skipping rows that conflict with an existing key." }
        ],
        input: [],
        output: { columns: ["Result"], rows: [["Seven tables created or reused; sample rows inserted when absent."]] },
        note: "This setup script is SQLite-compatible. It creates tables if absent and uses INSERT OR IGNORE so rerunning it does not duplicate sample primary keys. Run it only in a disposable learning database; SQLWhale's existing workspace tables are not automatically replaced."
      },
      { title: "Read the student table", concept: "SELECT lists the information to return, and FROM names the source table.", analogy: "You are asking the college office to show only student names and email addresses from the student register.", sql: "SELECT student_id, full_name, email\nFROM students\nORDER BY student_id;", explanation: [
          { line: "SELECT student_id, full_name, email", meaning: "Returns only these three columns." },
          { line: "FROM students", meaning: "Reads rows from the students table." },
          { line: "ORDER BY student_id", meaning: "Sorts the output by student ID, smallest first by default." }
        ], input: [{ name: "students", columns: ["student_id", "full_name", "email"], rows: [[1, "Meera Shah", "meera@example.com"], [2, "Arjun Patil", "arjun@example.com"], [3, "Sara Khan", "sara@example.com"]] }], output: { columns: ["student_id", "full_name", "email"], rows: [[1, "Meera Shah", "meera@example.com"], [2, "Arjun Patil", "arjun@example.com"], [3, "Sara Khan", "sara@example.com"]] } }
    ] }
  ],
  cheatSheet: [
    { keyword: "SELECT", meaning: "Chooses columns or expressions to return.", example: "SELECT full_name FROM students;" },
    { keyword: "FROM", meaning: "Names the source table or tables.", example: "SELECT * FROM courses;" },
    { keyword: "CREATE TABLE", meaning: "Defines a new table structure.", example: "CREATE TABLE tags (tag_id INTEGER PRIMARY KEY, label TEXT);" },
    { keyword: "PRIMARY KEY", meaning: "Uniquely identifies each row.", example: "student_id INTEGER PRIMARY KEY" },
    { keyword: "FOREIGN KEY", meaning: "Connects rows across related tables.", example: "FOREIGN KEY (student_id) REFERENCES students(student_id)" },
    { keyword: "INSERT", meaning: "Adds a new row.", example: "INSERT INTO customers (customer_id, customer_name, city) VALUES (3, 'Nova Shop', 'Pune');" },
    { keyword: "INT / INTEGER", meaning: "Stores whole numbers.", example: "student_id INTEGER" },
    { keyword: "VARCHAR(n)", meaning: "Stores text up to a declared length in engines that enforce it.", example: "full_name VARCHAR(100)" },
    { keyword: "DATE", meaning: "Represents a calendar date.", example: "enrolled_on DATE" },
    { keyword: "DECIMAL(p,s)", meaning: "Stores exact decimal precision in databases that support fixed precision.", example: "fee DECIMAL(10,2)" },
    { keyword: "BOOLEAN", meaning: "Represents true/false where supported.", example: "is_active BOOLEAN" },
    { keyword: "WHERE", meaning: "Filters rows that meet a condition.", example: "SELECT * FROM students WHERE student_id = 1;" }
  ],
  mistakes: [
    { mistake: "Using = NULL to find missing values.", tip: "Use IS NULL or IS NOT NULL; NULL represents unknown or missing data." },
    { mistake: "Assuming all databases use identical SQL syntax.", tip: "Check the engine. SQLWhale's current sandbox is SQLite, while MySQL and PostgreSQL have differences." },
    { mistake: "Using SELECT * in every query.", tip: "Select the columns you need; this makes output clearer and reduces unnecessary data." },
    { mistake: "Forgetting quotes around text values.", tip: "Use single quotes for text, such as WHERE city = 'Pune'." },
    { mistake: "Confusing a row with a column.", tip: "Rows go across and represent records; columns go down and represent attributes." }
  ],
  exercises: [
    { question: "Return every column from the courses table.", hint: "Use SELECT * and FROM.", answer: "SELECT * FROM courses;", explanation: "The asterisk means all columns; FROM chooses the source table." },
    { question: "Show the names and cities of all customers.", hint: "List two columns after SELECT.", answer: "SELECT customer_name, city FROM customers;", explanation: "Only the two requested columns appear in the result." },
    { question: "Find the student whose ID is 2.", hint: "Filter with WHERE.", answer: "SELECT * FROM students WHERE student_id = 2;", explanation: "WHERE filters rows before returning the result." },
    { question: "List the course name and fee for each course, from highest fee to lowest.", hint: "Add ORDER BY fee DESC.", answer: "SELECT course_name, fee FROM courses ORDER BY fee DESC;", explanation: "DESC sorts the fee values in descending order." }
  ],
  quiz: [
    { question: "What does SQL stand for?", options: ["Simple Question List", "Structured Query Language", "Sequential Queue Logic", "Standard Quick Link"], answer: 1, explanation: "SQL means Structured Query Language and is used to work with relational data." },
    { question: "What does a row in a table represent?", options: ["A field name", "A database engine", "One record", "A SQL keyword"], answer: 2, explanation: "A row contains the values describing one record." },
    { question: "Which key uniquely identifies a row?", options: ["Foreign key", "Primary key", "Sort key", "Alias"], answer: 1, explanation: "A primary key uniquely identifies a row in a table." },
    { question: "Which command family includes CREATE TABLE?", options: ["DDL", "DML", "DCL", "TCL"], answer: 0, explanation: "DDL defines or changes database structures. CREATE TABLE is a DDL command." },
    { question: "Which condition correctly checks a missing value?", options: ["value = NULL", "value IS NULL", "value == NULL", "value EQUALS NULL"], answer: 1, explanation: "SQL uses IS NULL because NULL represents an unknown or missing value." }
  ]
};
export default moduleOne;