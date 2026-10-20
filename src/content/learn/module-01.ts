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
    { heading: "1. Introduction to SQL and databases", body: "A database is an organised place to store information so it can be found, updated and managed reliably. For example, a college may store student details, courses and enrolments in separate but connected tables instead of keeping everything in scattered notebooks. A Database Management System (DBMS) is the software that stores and manages this information.\n\nSQL stands for Structured Query Language. It is used to create database structures, add or change records, retrieve information and manage transactions or permissions. SQL is a language, not a database itself: SQLite, MySQL and PostgreSQL are database systems that understand SQL, with some differences between them.", examples: [
      { title: "Your first SQL statement", concept: "A query is an instruction sent to a database. SELECT asks the database to return information.", analogy: "It is like asking the college clerk to show the student register.", sql: "SELECT 'Hello, SQLWhale!' AS message;", explanation: [
        { line: "SELECT", meaning: "Tells the database to return a result." },
        { line: "'Hello, SQLWhale!'", meaning: "A text value; SQL text is normally written inside single quotes." },
        { line: "AS message", meaning: "Gives the result column the label message." }
      ], input: [], output: { columns: ["message"], rows: [["Hello, SQLWhale!"]] }, tryInLab: true }
    ] },
    { heading: "2. A short history of SQL", body: "In 1970, computer scientist Edgar F. Codd described the relational model, where information is organised into tables connected by relationships. During the 1970s, IBM researchers Donald Chamberlin and Raymond Boyce developed a language originally called SEQUEL to work with relational data; the name later became SQL.\n\nSQL became an ANSI standard in 1986 and an ISO standard in 1987. Since then, the language has grown to support more complex queries, transactions and analytics. Different database products add their own features, so a query that works in one system may need a small change in another." },
    { heading: "3. Data, databases and SQL", body: "Data means recorded facts, such as a student's name or a course fee. A database is an organized collection of related data. SQL stands for Structured Query Language; it is a language for defining, reading and changing data in relational databases. A database management system (DBMS) is software that stores data and runs queries." },
    { heading: "4. Relational databases and NoSQL", body: "An RDBMS stores data in tables with defined columns and relationships. Examples include SQLite, MySQL, PostgreSQL, SQL Server and Oracle. NoSQL is a broad family of systems that may store documents, key-value pairs, graphs or wide-column records. Neither is automatically best for every job; choose based on data shape, consistency needs and workload." },
    { heading: "5. Tables, rows, columns and relationships", body: "A table stores one kind of entity. A row (also called a record) describes one item. A column (also called a field or attribute) describes one property. A primary key uniquely identifies a row. A foreign key points to a key in another table and connects related records." },
    { heading: "6. SQL standards and database engines", body: "SQL standards describe common language features, but engines do not implement every feature identically. MySQL and PostgreSQL are popular server databases; Microsoft SQL Server and Oracle Database are widely used enterprise systems; SQLite is a small embedded database. Check the engine documentation when syntax or behavior differs." },
    { heading: "6. SQL command families", body: "DDL (Data Definition Language) defines structures, for example CREATE TABLE. DML (Data Manipulation Language) changes rows, for example INSERT, UPDATE and DELETE. DQL (Data Query Language) reads data, especially SELECT. DCL (Data Control Language) manages permissions, for example GRANT and REVOKE. TCL (Transaction Control Language) controls transactions, for example COMMIT and ROLLBACK." },
    { heading: "7. SQL command families: the big picture", body: "SQL commands are often grouped by what they do. DDL defines the shape of tables; DML adds, edits or removes records; DQL reads records; DCL manages user permissions; TCL controls transactions. Some books classify SELECT under DML, while many beginner courses teach it separately as DQL. These categories help you understand the purpose of a command before memorising its syntax." },
    { heading: "8. DDL — Data Definition Language", body: "DDL means Data Definition Language. It creates or changes database objects such as tables. A database object is a structure stored in the database. Common DDL commands are CREATE, ALTER and DROP. TRUNCATE is supported by some database engines, but SQLite does not support TRUNCATE TABLE; in SQLite, DELETE FROM table_name removes rows instead.", examples: [
      { title: "CREATE TABLE — create a table", concept: "CREATE TABLE defines a new table and its columns.", analogy: "Create a new blank register and decide which headings it will have.", sql: "CREATE TABLE demo_students (\n  student_id INTEGER PRIMARY KEY,\n  full_name TEXT NOT NULL,\n  age INTEGER\n);", explanation: [
        { line: "CREATE TABLE demo_students", meaning: "Create a table named demo_students." },
        { line: "student_id INTEGER PRIMARY KEY", meaning: "An integer ID that uniquely identifies each row." },
        { line: "full_name TEXT NOT NULL", meaning: "A text name is required; it cannot be left NULL." },
        { line: "age INTEGER", meaning: "An optional whole-number age." }
      ], input: [], output: { columns: ["Result"], rows: [["Table demo_students created"]] }, note: "Use a new table name in Query Lab if demo_students already exists.", tryInLab: true },
      { title: "ALTER TABLE — change a table", concept: "ALTER TABLE changes a table that already exists. Supported changes differ by database engine.", analogy: "Add another heading to a register that is already in use.", sql: "ALTER TABLE demo_students\nADD COLUMN city TEXT;", explanation: [
        { line: "ALTER TABLE demo_students", meaning: "Choose the existing table to change." },
        { line: "ADD COLUMN city TEXT", meaning: "Add a text column named city." }
      ], input: [], output: { columns: ["Result"], rows: [["Column city added"]] }, note: "Run after creating demo_students. SQLite supports ADD COLUMN; other ALTER operations vary by engine.", tryInLab: true },
      { title: "DROP TABLE — remove a table", concept: "DROP TABLE removes the table structure and its stored rows. This is destructive.", analogy: "Dispose of the entire register, not just one entry.", sql: "DROP TABLE demo_students;", explanation: [
        { line: "DROP TABLE", meaning: "Remove a table object." },
        { line: "demo_students", meaning: "Names the table to remove." }
      ], input: [], output: { columns: ["Result"], rows: [["Table demo_students removed"]] }, note: "Only run this in a practice database when you are sure you no longer need the table.", tryInLab: true }
    ] },
    { heading: "9. DML — Data Manipulation Language", body: "DML means Data Manipulation Language. These commands change the rows stored inside tables. The main commands are INSERT (add rows), UPDATE (edit existing rows) and DELETE (remove rows). Always check your WHERE condition before UPDATE or DELETE; without WHERE, every row may be affected.", examples: [
      { title: "INSERT — add a row", concept: "INSERT INTO adds a new record to a table.", analogy: "Write a new student's details into the register.", sql: "INSERT INTO demo_students (student_id, full_name, age)\nVALUES (1, 'Meera Shah', 21);", explanation: [
        { line: "INSERT INTO demo_students", meaning: "Choose the table receiving the new row." },
        { line: "(student_id, full_name, age)", meaning: "List the columns you are providing values for." },
        { line: "VALUES (1, 'Meera Shah', 21)", meaning: "Provide one value for each listed column, in the same order." }
      ], input: [], output: { columns: ["Result"], rows: [["1 row inserted"]] }, note: "This example expects demo_students to exist and student_id 1 not to be used already.", tryInLab: true },
      { title: "UPDATE — edit a row", concept: "UPDATE changes column values in rows that match WHERE.", analogy: "Correct a student's age in the register.", sql: "UPDATE demo_students\nSET age = 22\nWHERE student_id = 1;", explanation: [
        { line: "UPDATE demo_students", meaning: "Choose which table to change." },
        { line: "SET age = 22", meaning: "Set the age column to 22." },
        { line: "WHERE student_id = 1", meaning: "Only change the row whose ID is 1." }
      ], input: [{ name: "demo_students before", columns: ["student_id", "full_name", "age"], rows: [[1, "Meera Shah", 21]] }], output: { columns: ["student_id", "full_name", "age"], rows: [[1, "Meera Shah", 22]] }, note: "Without WHERE, every row in the table would have its age changed.", tryInLab: true },
      { title: "DELETE — remove rows", concept: "DELETE removes matching records but leaves the table structure in place.", analogy: "Remove one entry from the register while keeping the register itself.", sql: "DELETE FROM demo_students\nWHERE student_id = 1;", explanation: [
        { line: "DELETE FROM demo_students", meaning: "Remove rows from this table." },
        { line: "WHERE student_id = 1", meaning: "Remove only the row with ID 1." }
      ], input: [{ name: "demo_students before", columns: ["student_id", "full_name", "age"], rows: [[1, "Meera Shah", 22]] }], output: { columns: ["Result"], rows: [["1 matching row deleted"]] }, note: "Without WHERE, all rows are deleted. The table remains.", tryInLab: true }
    ] },
    { heading: "10. DQL — Data Query Language", body: "DQL means Data Query Language. In many beginner learning materials, SELECT is taught as the main DQL command because it reads data without changing the stored rows. SELECT is commonly combined with FROM, WHERE, ORDER BY and other clauses; later modules explore those clauses in detail.", examples: [
      { title: "SELECT — read data", concept: "SELECT returns chosen columns from a table.", analogy: "Ask the clerk to show only the student names and ages.", sql: "SELECT full_name, age\nFROM demo_students;", explanation: [
        { line: "SELECT full_name, age", meaning: "Return only these two columns." },
        { line: "FROM demo_students", meaning: "Read the rows from demo_students." }
      ], input: [{ name: "demo_students", columns: ["student_id", "full_name", "age"], rows: [[1, "Meera Shah", 22], [2, "Arjun Patil", 20]] }], output: { columns: ["full_name", "age"], rows: [["Meera Shah", 22], ["Arjun Patil", 20]] }, tryInLab: true }
    ] },
    { heading: "11. DCL — Data Control Language", body: "DCL means Data Control Language. It manages who is allowed to access database objects. GRANT gives a permission and REVOKE removes a permission. These commands are available in many server databases, but SQLite does not support SQL GRANT or REVOKE because access is usually controlled through the application and file-system permissions.", examples: [
      { title: "GRANT — give permission (conceptual syntax)", concept: "GRANT gives a database privilege to a user or role.", analogy: "Give a staff member permission to view a register.", sql: "GRANT SELECT ON students TO analyst_user;", explanation: [
        { line: "GRANT SELECT", meaning: "Give permission to read data." },
        { line: "ON students", meaning: "Apply the permission to the students table." },
        { line: "TO analyst_user", meaning: "Name the user or role receiving permission." }
      ], input: [], output: { columns: ["Meaning"], rows: [["Permission granted on supported database engines"]] }, note: "Conceptual example only; it will not run in SQLWhale's SQLite sandbox." },
      { title: "REVOKE — remove permission (conceptual syntax)", concept: "REVOKE removes a previously granted privilege.", analogy: "Take away a staff member's permission to view a register.", sql: "REVOKE SELECT ON students FROM analyst_user;", explanation: [
        { line: "REVOKE SELECT", meaning: "Remove the read permission." },
        { line: "ON students", meaning: "Choose the table." },
        { line: "FROM analyst_user", meaning: "Name the user whose permission is removed." }
      ], input: [], output: { columns: ["Meaning"], rows: [["Permission revoked on supported database engines"]] }, note: "Conceptual example only; it will not run in SQLWhale's SQLite sandbox." }
    ] },
    { heading: "12. TCL — Transaction Control Language", body: "TCL means Transaction Control Language. A transaction groups changes so they can be committed together or cancelled together. BEGIN starts a transaction, COMMIT saves its changes, and ROLLBACK cancels uncommitted changes. SAVEPOINT marks a point inside a transaction so you can roll back part of the work. Exact syntax can vary by engine.", examples: [
      { title: "BEGIN, COMMIT and ROLLBACK", concept: "Use a transaction when several related changes should succeed or fail as one unit.", analogy: "Prepare a set of register updates, then either confirm the whole set or cancel it.", sql: "BEGIN TRANSACTION;\n\nUPDATE demo_students\nSET age = 23\nWHERE student_id = 1;\n\nCOMMIT;", explanation: [
        { line: "BEGIN TRANSACTION", meaning: "Start a transaction." },
        { line: "UPDATE ... WHERE ...", meaning: "Make a change inside the transaction." },
        { line: "COMMIT", meaning: "Save the transaction's changes." }
      ], input: [], output: { columns: ["Result"], rows: [["Transaction committed"]] }, note: "Use ROLLBACK instead of COMMIT to cancel uncommitted changes. Execute transaction statements in a compatible SQL session.", tryInLab: true },
      { title: "SAVEPOINT — mark a rollback point", concept: "SAVEPOINT marks a point within a transaction so you can undo later changes without cancelling everything.", analogy: "Save a checkpoint before making another set of edits.", sql: "BEGIN TRANSACTION;\nSAVEPOINT before_age_change;\nUPDATE demo_students SET age = 24 WHERE student_id = 1;\nROLLBACK TO before_age_change;\nCOMMIT;", explanation: [
        { line: "SAVEPOINT before_age_change", meaning: "Create a named checkpoint." },
        { line: "ROLLBACK TO before_age_change", meaning: "Undo changes made after that checkpoint." },
        { line: "COMMIT", meaning: "Finish the transaction after the rollback." }
      ], input: [], output: { columns: ["Result"], rows: [["Changes after the savepoint rolled back"]] }, note: "The example assumes demo_students exists. Savepoint syntax is supported by SQLite and several other engines.", tryInLab: true }
    ] },
    { heading: "13. Syntax rules and data types", body: "SQL keywords are commonly written in uppercase for readability, but they are generally case-insensitive. Text values use single quotes. A semicolon commonly ends a statement. INT stores whole numbers, VARCHAR(n) stores variable-length text, DATE stores calendar dates, DECIMAL(p,s) stores exact decimal values such as money, and BOOLEAN represents true/false where supported. SQLite uses flexible storage classes, so some type names behave differently than in MySQL or PostgreSQL." },
    { heading: "14. Our shared practice database", body: "All upcoming modules will use the same teaching dataset: students, courses, enrollments, employees, departments, customers and orders. The relationships are: one student can have many enrolments; one course can have many enrolments; one department can have many employees; one customer can place many orders. This starter script is SQLite-compatible, matching SQLWhale's current query sandbox.", examples: [
      { title: "Create the teaching tables", download: "/learn/sqlwhale-learning-database.sql", tryInLab: false, concept: "CREATE TABLE defines a table's columns and constraints. A primary key identifies each row; a foreign key links a row to a related table.", analogy: "Think of this as printing blank registers and deciding which ID connects each register to another.", sql: `PRAGMA foreign_keys = ON;

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