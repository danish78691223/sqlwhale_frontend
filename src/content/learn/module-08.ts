import type { LessonModule } from "./types";

const moduleEight: LessonModule = {
  id: 8,
  title: "Data Modification & Integrity",
  difficulty: "Intermediate",
  estimatedTime: "50–60 minutes",
  summary: "Insert, update and delete rows carefully, use transactions where supported, and understand constraints that protect reliable data.",
  outcomes: [
    "Use INSERT to add new rows and specify target columns explicitly.",
    "Use UPDATE with a WHERE condition to change only intended records.",
    "Use DELETE safely and distinguish deleting rows from dropping a table.",
    "Explain primary keys, foreign keys, UNIQUE, NOT NULL and CHECK constraints.",
    "Understand transactions and the idea of COMMIT and ROLLBACK."
  ],
  analogy: "Think of a database as an official register. INSERT adds a new entry, UPDATE corrects an existing entry, and DELETE removes an entry. Constraints are the rules that prevent invalid entries, while a transaction is like checking a batch of edits before making them final.",
  sections: [
    {
      heading: "1. INSERT — add new rows",
      body: "INSERT adds a new row to a table. Write the column names so the values are clearly matched to the correct fields. Text values usually use single quotes. If a column has an automatic default, you can omit it when the database supports that behavior. The example below assumes an employees table with employee_id, name and department_id columns; inspect Query Lab's schema before running it.",
      examples: [
        {
          title: "Add one employee",
          concept: "Name the target columns, then provide one value for each column in the same order.",
          analogy: "Fill in the name, ID and department fields on a new form.",
          sql: "INSERT INTO employees (employee_id, name, department_id)\nVALUES (101, 'Asha', 2);",
          explanation: [
            { line: "INSERT INTO employees", meaning: "Choose the table that will receive the new row." },
            { line: "(employee_id, name, department_id)", meaning: "List the exact columns being supplied." },
            { line: "VALUES (101, 'Asha', 2)", meaning: "Supply values in the same order as the column list." }
          ],
          input: [{ name: "employees before", columns: ["employee_id", "name", "department_id"], rows: [[1, "Ravi", 1]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[1, "Ravi", 1], [101, "Asha", 2]] },
          note: "Illustrative example only. If employee_id is already used or the sandbox has different columns, choose a valid unused ID and match the actual schema.",
          tryInLab: true
        },
        {
          title: "Insert multiple rows",
          concept: "A single INSERT can add multiple rows by separating value groups with commas.",
          analogy: "Submit several completed forms in one batch.",
          sql: "INSERT INTO departments (department_id, department_name)\nVALUES (10, 'Support'), (11, 'Research');",
          explanation: [
            { line: "INSERT INTO departments (...)", meaning: "Select the target table and its columns." },
            { line: "VALUES (...), (...)", meaning: "Each parenthesized group represents one new row." }
          ],
          input: [{ name: "departments before", columns: ["department_id", "department_name"], rows: [[1, "Sales"]] }],
          output: { columns: ["department_id", "department_name"], rows: [[1, "Sales"], [10, "Support"], [11, "Research"]] },
          note: "Multi-row VALUES syntax is supported by SQLite and many common SQL databases; check your database dialect if using a different system.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "2. UPDATE — change existing rows",
      body: "UPDATE modifies values in existing rows. SET names the columns to change. WHERE identifies which rows should change. If you leave out WHERE, every row in the table may be updated. Before running an UPDATE, run a SELECT with the same WHERE condition to preview the target rows.",
      examples: [
        {
          title: "Change one employee's department",
          concept: "The WHERE condition narrows the update to the row with employee_id 101.",
          analogy: "Correct one person's department in a register, not the whole register.",
          sql: "UPDATE employees\nSET department_id = 3\nWHERE employee_id = 101;",
          explanation: [
            { line: "UPDATE employees", meaning: "Choose the table to change." },
            { line: "SET department_id = 3", meaning: "Set the department_id value to 3 for matching rows." },
            { line: "WHERE employee_id = 101", meaning: "Limit the change to the employee whose ID is 101." }
          ],
          input: [{ name: "employees before", columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 2], [102, "Ravi", 1]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 3], [102, "Ravi", 1]] },
          tryInLab: true
        },
        {
          title: "Preview rows before updating",
          concept: "Use SELECT with the intended WHERE condition first, so you can verify the target rows before making a change.",
          analogy: "Highlight the exact lines in a form before editing them.",
          sql: "SELECT employee_id, name, department_id\nFROM employees\nWHERE department_id = 2;\n\n-- After confirming the rows, run the UPDATE separately.",
          explanation: [
            { line: "SELECT ...", meaning: "Inspect the values that would be affected." },
            { line: "WHERE department_id = 2", meaning: "Use the same filter you intend to use in the UPDATE." },
            { line: "-- comment", meaning: "The line beginning with -- is a comment and is not executed as SQL." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 2], [102, "Ravi", 1], [103, "Noor", 2]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 2], [103, "Noor", 2]] },
          note: "This is a safe preview query; it does not change data.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "3. DELETE — remove selected rows",
      body: "DELETE removes rows from a table. Its WHERE clause is just as important as UPDATE's. Without WHERE, DELETE removes every row from the table, although the table structure remains. DROP TABLE is different: it removes the table structure itself. Always preview the intended rows with SELECT first, and use a transaction if your environment supports it.",
      examples: [
        {
          title: "Delete one specific employee",
          concept: "The primary-key-like employee_id condition targets one record.",
          analogy: "Remove one identified entry from the register by its unique reference number.",
          sql: "DELETE FROM employees\nWHERE employee_id = 101;",
          explanation: [
            { line: "DELETE FROM employees", meaning: "Choose the table whose rows will be removed." },
            { line: "WHERE employee_id = 101", meaning: "Remove only rows that match this ID." }
          ],
          input: [{ name: "employees before", columns: ["employee_id", "name"], rows: [[101, "Asha"], [102, "Ravi"]] }],
          output: { columns: ["employee_id", "name"], rows: [[102, "Ravi"]] },
          note: "Only run destructive examples in a practice database. Confirm that the ID exists and is the intended row.",
          tryInLab: true
        },
        {
          title: "Preview rows before deletion",
          concept: "Run a SELECT first to see exactly which rows match the delete condition.",
          analogy: "Check the list of entries marked for removal before confirming.",
          sql: "SELECT employee_id, name\nFROM employees\nWHERE department_id = 9;",
          explanation: [
            { line: "SELECT employee_id, name", meaning: "Show the identifiers and names of candidate rows." },
            { line: "WHERE department_id = 9", meaning: "Preview only the rows in department 9." }
          ],
          input: [{ name: "employees", columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 9], [102, "Ravi", 1]] }],
          output: { columns: ["employee_id", "name"], rows: [[101, "Asha"]] },
          note: "This SELECT is read-only. Only use DELETE after confirming the preview.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "4. Constraints — rules that protect data",
      body: "A constraint is a rule enforced by the database. PRIMARY KEY identifies each row uniquely and cannot be NULL. FOREIGN KEY links a value to a matching key in another table, when foreign-key enforcement is enabled. NOT NULL requires a value. UNIQUE prevents duplicate values in the constrained column or column combination. CHECK requires a condition to be true. Constraints help reject invalid data instead of relying only on application code.",
      examples: [
        {
          title: "Create a table with constraints",
          concept: "The table definition sets rules that every inserted row must follow.",
          analogy: "A registration form may require a name, a unique registration number and a non-negative age.",
          sql: "CREATE TABLE course_registrations (\n  registration_id INTEGER PRIMARY KEY,\n  student_name TEXT NOT NULL,\n  email TEXT UNIQUE,\n  age INTEGER CHECK (age >= 0)\n);",
          explanation: [
            { line: "registration_id INTEGER PRIMARY KEY", meaning: "Use registration_id to identify each row uniquely." },
            { line: "student_name TEXT NOT NULL", meaning: "A registration must include a student name." },
            { line: "email TEXT UNIQUE", meaning: "Non-NULL email values cannot be repeated." },
            { line: "CHECK (age >= 0)", meaning: "Reject an age below zero." }
          ],
          input: [{ name: "valid row", columns: ["registration_id", "student_name", "email", "age"], rows: [[1, "Asha", "asha@example.com", 20]] }],
          output: { columns: ["registration_id", "student_name", "email", "age"], rows: [[1, "Asha", "asha@example.com", 20]] },
          note: "This CREATE TABLE example creates a new practice table. Use a fresh table name if it already exists in your sandbox.",
          tryInLab: true
        },
        {
          title: "Connect child rows to a parent row",
          concept: "A foreign key can prevent a registration from referring to a course that does not exist.",
          analogy: "A booking must refer to a real course in the course catalogue.",
          sql: "CREATE TABLE courses_demo (\n  course_id INTEGER PRIMARY KEY,\n  course_name TEXT NOT NULL\n);\n\nCREATE TABLE enrollments_demo (\n  enrollment_id INTEGER PRIMARY KEY,\n  course_id INTEGER NOT NULL,\n  FOREIGN KEY (course_id) REFERENCES courses_demo(course_id)\n);",
          explanation: [
            { line: "courses_demo.course_id", meaning: "The parent table's primary key." },
            { line: "enrollments_demo.course_id", meaning: "The child table stores the course it refers to." },
            { line: "FOREIGN KEY ... REFERENCES", meaning: "Declare the relationship and the referenced key." }
          ],
          input: [{ name: "courses_demo", columns: ["course_id", "course_name"], rows: [[1, "SQL Basics"]] }],
          output: { columns: ["enrollment_id", "course_id"], rows: [[1, 1]] },
          note: "SQLite foreign-key enforcement can depend on connection settings. A declared foreign key protects data only when enforcement is enabled.",
          tryInLab: true
        }
      ]
    },
    {
      heading: "5. Transactions — make a group of changes safely",
      body: "A transaction groups operations into one logical unit. COMMIT makes the transaction's changes permanent; ROLLBACK cancels uncommitted changes. A transaction is useful when several related edits must either all succeed or be undone together. Support and exact behavior depend on the database and on whether the SQL sandbox permits transaction statements. Test this concept in an isolated practice database.",
      examples: [
        {
          title: "Use a transaction for a planned update",
          concept: "Start a transaction, perform a change, inspect it, then commit if correct or roll back if not.",
          analogy: "Make a draft edit, review it, and only then confirm the final version.",
          sql: "BEGIN;\nUPDATE employees\nSET department_id = 3\nWHERE employee_id = 101;\nSELECT employee_id, name, department_id\nFROM employees\nWHERE employee_id = 101;\n-- If correct, run COMMIT; otherwise run ROLLBACK;",
          explanation: [
            { line: "BEGIN", meaning: "Start a transaction in database systems that support this syntax." },
            { line: "UPDATE ... WHERE ...", meaning: "Make a targeted change inside the transaction." },
            { line: "SELECT ...", meaning: "Inspect the changed row before finalizing." },
            { line: "COMMIT / ROLLBACK", meaning: "Commit to keep the change or roll back to undo uncommitted work." }
          ],
          input: [{ name: "employees before", columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 2]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[101, "Asha", 3]] },
          note: "Run transaction commands separately if the SQL editor only accepts one statement at a time. Do not leave an open transaction in a shared sandbox.",
          tryInLab: true
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "INSERT", meaning: "Adds new rows to a table.", example: "INSERT INTO t (id, name) VALUES (1, 'Asha');" },
    { keyword: "UPDATE", meaning: "Changes existing rows.", example: "UPDATE t SET name = 'Noor' WHERE id = 1;" },
    { keyword: "DELETE", meaning: "Removes selected rows but keeps the table.", example: "DELETE FROM t WHERE id = 1;" },
    { keyword: "PRIMARY KEY", meaning: "Uniquely identifies each row.", example: "id INTEGER PRIMARY KEY" },
    { keyword: "FOREIGN KEY", meaning: "Links a child value to a referenced key.", example: "FOREIGN KEY (course_id) REFERENCES courses(course_id)" },
    { keyword: "NOT NULL", meaning: "Requires a value.", example: "name TEXT NOT NULL" },
    { keyword: "UNIQUE", meaning: "Prevents duplicate non-NULL values for a unique column.", example: "email TEXT UNIQUE" },
    { keyword: "CHECK", meaning: "Requires a condition to hold for stored values.", example: "CHECK (price >= 0)" },
    { keyword: "COMMIT", meaning: "Makes a transaction's changes permanent.", example: "COMMIT;" },
    { keyword: "ROLLBACK", meaning: "Cancels uncommitted transaction changes.", example: "ROLLBACK;" }
  ],
  mistakes: [
    { mistake: "Running UPDATE without WHERE.", tip: "First run a SELECT using the intended condition, then reuse that condition in UPDATE." },
    { mistake: "Running DELETE without WHERE by accident.", tip: "Preview rows with SELECT and verify the identifier before deleting." },
    { mistake: "Assuming DELETE and DROP TABLE mean the same thing.", tip: "DELETE removes rows; DROP TABLE removes the table definition and its data." },
    { mistake: "Putting values in an order that does not match the INSERT columns.", tip: "Always write an explicit column list and match each value to it." },
    { mistake: "Expecting a foreign key to work even when enforcement is disabled.", tip: "Check the database's foreign-key enforcement settings and test invalid references in a safe environment." },
    { mistake: "Committing a transaction before reviewing its changes.", tip: "Inspect affected rows before COMMIT; use ROLLBACK if the uncommitted changes are wrong." }
  ],
  exercises: [
    { question: "Insert employee 201 named 'Meera' into department 2.", hint: "Use INSERT INTO with explicit columns.", answer: "INSERT INTO employees (employee_id, name, department_id) VALUES (201, 'Meera', 2);", explanation: "The target columns and values are listed in matching order. Use a free ID and actual column names in your sandbox." },
    { question: "Change employee 201 to department 4.", hint: "Use UPDATE, SET and a WHERE condition.", answer: "UPDATE employees SET department_id = 4 WHERE employee_id = 201;", explanation: "The WHERE clause limits the update to the row with employee_id 201." },
    { question: "Delete only employee 201.", hint: "Preview the row with SELECT before running DELETE.", answer: "DELETE FROM employees WHERE employee_id = 201;", explanation: "The WHERE condition limits deletion to the identified row." },
    { question: "Create a table with an integer primary key and a required name.", hint: "Use PRIMARY KEY and NOT NULL.", answer: "CREATE TABLE people_demo (id INTEGER PRIMARY KEY, name TEXT NOT NULL);", explanation: "The primary key identifies each row and NOT NULL requires a name." },
    { question: "Explain the difference between COMMIT and ROLLBACK.", hint: "Think of finalizing versus cancelling uncommitted changes.", answer: "COMMIT; -- keep the transaction changes. ROLLBACK; -- undo uncommitted transaction changes.", explanation: "Use transaction control only when supported by the SQL engine and only in a safe practice database." }
  ],
  quiz: [
    { question: "Which SQL command adds new rows?", options: ["INSERT", "UPDATE", "DELETE", "ALTER"], answer: 0, explanation: "INSERT adds new records to a table." },
    { question: "What can happen if UPDATE has no WHERE clause?", options: ["Only one row changes", "All rows may be updated", "The table is dropped", "The query always fails"], answer: 1, explanation: "Without WHERE, UPDATE applies its SET changes to every row in the table." },
    { question: "Which constraint uniquely identifies a row?", options: ["CHECK", "NOT NULL", "PRIMARY KEY", "DEFAULT"], answer: 2, explanation: "A primary key identifies each row uniquely and cannot contain NULL." },
    { question: "What is the main difference between DELETE and DROP TABLE?", options: ["They are identical", "DELETE removes rows; DROP TABLE removes the table structure", "DROP only changes one row", "DELETE removes the database server"], answer: 1, explanation: "DELETE removes rows from a table; DROP TABLE removes the table definition itself." },
    { question: "What does ROLLBACK do to an uncommitted transaction?", options: ["Makes changes permanent", "Creates a backup table", "Cancels the uncommitted changes", "Adds a constraint"], answer: 2, explanation: "ROLLBACK cancels changes that have not been committed, when transaction support is available." }
  ]
};

export default moduleEight;
