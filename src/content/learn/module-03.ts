import type { LessonModule } from "./types";

const moduleThree: LessonModule = {
  id: 3,
  title: "Filtering with WHERE",
  difficulty: "Beginner",
  estimatedTime: "40–50 minutes",
  summary: "Find exactly the rows you need with comparison operators, AND/OR/NOT, IN, BETWEEN, LIKE and correct NULL checks.",
  outcomes: [
    "Filter rows with WHERE and comparison operators.",
    "Combine conditions with AND, OR, NOT and parentheses.",
    "Use IN, BETWEEN and LIKE for common search tasks.",
    "Check missing values with IS NULL and IS NOT NULL.",
    "Predict which rows a condition will return before running a query."
  ],
  analogy: "Imagine a college office with thousands of student records. WHERE is the instruction 'show only students from Paranda' or 'show students whose fee is above ₹1,000'. The office still keeps every record; the filter only decides which rows appear in this report.",
  sections: [
    {
      heading: "1. WHERE: filter rows",
      body: "WHERE keeps only rows whose condition is true. A condition (also called a predicate) is a test that SQL evaluates for each row. Rows that do not match are left out of the result; a SELECT query does not delete them from the table.",
      examples: [
        {
          title: "Find students enrolled after a date",
          concept: "Use a comparison operator to keep only rows with a date later than the chosen date.",
          analogy: "Like asking the office for only the students who joined after 10 January.",
          sql: "SELECT student_id, full_name, enrolled_on\nFROM students\nWHERE enrolled_on > '2026-01-10'\nORDER BY student_id;",
          explanation: [
            { line: "SELECT student_id, full_name, enrolled_on", meaning: "Choose the columns that should appear in the report." },
            { line: "FROM students", meaning: "Read rows from the students table." },
            { line: "WHERE enrolled_on > '2026-01-10'", meaning: "Keep only dates later than 10 January 2026; the comparison is exclusive." },
            { line: "ORDER BY student_id", meaning: "Sort the matching rows so the output order is predictable." }
          ],
          input: [{ name: "students", columns: ["student_id", "full_name", "enrolled_on"], rows: [[1, "Meera Shah", "2026-01-10"], [2, "Arjun Patil", "2026-01-12"], [3, "Sara Khan", "2026-01-18"]] }],
          output: { columns: ["student_id", "full_name", "enrolled_on"], rows: [[2, "Arjun Patil", "2026-01-12"], [3, "Sara Khan", "2026-01-18"]] },
          note: "ISO dates in YYYY-MM-DD format sort correctly as text in this SQLite teaching dataset. Other date formats and database engines may need different handling."
        },
        {
          title: "Compare a course fee",
          concept: "The comparison operators =, <>, <, <=, > and >= compare values.",
          analogy: "Like asking for courses costing at least ₹1,000.",
          sql: "SELECT course_name, fee\nFROM courses\nWHERE fee >= 1000\nORDER BY fee;",
          explanation: [
            { line: "WHERE fee >= 1000", meaning: "Keep courses whose fee is greater than or equal to 1000." },
            { line: "ORDER BY fee", meaning: "Display the matching courses from lower fee to higher fee." }
          ],
          input: [{ name: "courses", columns: ["course_name", "fee"], rows: [["SQL Basics", 999], ["Data Analytics", 1499], ["Web Development", 1200]] }],
          output: { columns: ["course_name", "fee"], rows: [["Web Development", 1200], ["Data Analytics", 1499]] }
        }
      ]
    },
    {
      heading: "2. Combine conditions with AND, OR and NOT",
      body: "AND means every connected condition must be true. OR means at least one condition must be true. NOT reverses a condition. When a query mixes AND and OR, use parentheses to show exactly which tests belong together; AND is normally evaluated before OR.",
      examples: [
        {
          title: "Both conditions must match",
          concept: "Return employees in department 1 whose employee ID is greater than 1.",
          analogy: "The student must meet both requirements: be in the selected class AND have a score above the threshold.",
          sql: "SELECT employee_id, name, department_id\nFROM employees\nWHERE department_id = 1\n  AND employee_id > 1\nORDER BY employee_id;",
          explanation: [
            { line: "department_id = 1", meaning: "Test whether the employee belongs to department 1." },
            { line: "AND employee_id > 1", meaning: "Also require the employee ID to be greater than 1." },
            { line: "ORDER BY employee_id", meaning: "Sort matching records by ID." }
          ],
          input: [{ name: "employees (illustrative rows)", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [2, "Ravi", 1], [3, "Nina", 2]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[2, "Ravi", 1]] }
        },
        {
          title: "Group OR conditions with parentheses",
          concept: "This example selects students whose ID is 1 or 2, and who also have a non-empty name.",
          analogy: "First choose one of the allowed groups, then apply the extra requirement to both.",
          sql: "SELECT student_id, full_name\nFROM students\nWHERE (student_id = 1 OR student_id = 2)\n  AND full_name <> ''\nORDER BY student_id;",
          explanation: [
            { line: "(student_id = 1 OR student_id = 2)", meaning: "Allow either of these two IDs." },
            { line: "AND full_name <> ''", meaning: "The chosen row must also have a name that is not an empty string." }
          ],
          input: [{ name: "students (illustrative rows)", columns: ["student_id", "full_name"], rows: [[1, "Meera Shah"], [2, "Arjun Patil"], [3, "Sara Khan"]] }],
          output: { columns: ["student_id", "full_name"], rows: [[1, "Meera Shah"], [2, "Arjun Patil"]] }
        }
      ]
    },
    {
      heading: "3. IN and BETWEEN",
      body: "IN checks whether a value matches any value in a list. BETWEEN checks whether a value falls inside a range, including both endpoints. These operators can make a long chain of OR conditions easier to read.",
      examples: [
        {
          title: "Choose from a list of course IDs",
          concept: "Use IN when several exact values are acceptable.",
          analogy: "Like asking the office for students enrolled in any one of three selected courses.",
          sql: "SELECT enrollment_id, student_id, course_id\nFROM enrollments\nWHERE course_id IN (1, 2)\nORDER BY enrollment_id;",
          explanation: [
            { line: "course_id IN (1, 2)", meaning: "Keep a row when course_id equals 1 or 2." },
            { line: "ORDER BY enrollment_id", meaning: "Sort matching enrolments by their ID." }
          ],
          input: [{ name: "enrollments", columns: ["enrollment_id", "student_id", "course_id"], rows: [[1, 1, 1], [2, 1, 2], [3, 2, 1], [4, 3, 3]] }],
          output: { columns: ["enrollment_id", "student_id", "course_id"], rows: [[1, 1, 1], [2, 1, 2], [3, 2, 1]] }
        },
        {
          title: "Find fees within a range",
          concept: "BETWEEN includes the lower and upper values, so 1000 and 1500 both qualify.",
          analogy: "Like selecting entries from page 10 through page 15, including both pages.",
          sql: "SELECT course_name, fee\nFROM courses\nWHERE fee BETWEEN 1000 AND 1500\nORDER BY fee;",
          explanation: [
            { line: "fee BETWEEN 1000 AND 1500", meaning: "Keep fees greater than or equal to 1000 and less than or equal to 1500." }
          ],
          input: [{ name: "courses", columns: ["course_name", "fee"], rows: [["SQL Basics", 999], ["Data Analytics", 1499], ["Web Development", 1200], ["Cloud Basics", 1500]] }],
          output: { columns: ["course_name", "fee"], rows: [["Web Development", 1200], ["Data Analytics", 1499], ["Cloud Basics", 1500]] }
        }
      ]
    },
    {
      heading: "4. LIKE: search text patterns",
      body: "LIKE compares text against a pattern. In a pattern, % means zero or more characters, while _ means exactly one character. For example, 'A%' matches text starting with A and '%son' matches text ending with son. Case sensitivity can vary by database and collation.",
      examples: [
        {
          title: "Find names that start with S",
          concept: "Put % after the starting letter to allow any number of characters after it.",
          analogy: "Like searching a paper register for names that begin with one letter.",
          sql: "SELECT full_name\nFROM students\nWHERE full_name LIKE 'S%'\nORDER BY full_name;",
          explanation: [
            { line: "full_name LIKE 'S%'", meaning: "Match names that begin with S, followed by any number of characters." },
            { line: "ORDER BY full_name", meaning: "Sort the matching names alphabetically." }
          ],
          input: [{ name: "students", columns: ["full_name"], rows: [["Meera Shah"], ["Arjun Patil"], ["Sara Khan"], ["Sameer Joshi"]] }],
          output: { columns: ["full_name"], rows: [["Sameer Joshi"], ["Sara Khan"]] }
        },
        {
          title: "Find text containing 'data'",
          concept: "A % on both sides means the searched text can appear anywhere inside the value.",
          analogy: "Like finding a word even when it appears in the middle of a sentence.",
          sql: "SELECT course_name\nFROM courses\nWHERE course_name LIKE '%data%'\nORDER BY course_name;",
          explanation: [
            { line: "course_name LIKE '%data%'", meaning: "Match course names containing the letters data." }
          ],
          input: [{ name: "courses", columns: ["course_name"], rows: [["SQL Basics"], ["Data Analytics"], ["Metadata Management"]] }],
          output: { columns: ["course_name"], rows: [["Data Analytics"], ["Metadata Management"]] },
          note: "SQLite's default LIKE behavior is usually ASCII case-insensitive. Case rules differ between engines and configurations."
        }
      ]
    },
    {
      heading: "5. NULL and missing values",
      body: "NULL means a value is missing or unknown; it is not the same as zero, an empty string or the text 'NULL'. Comparisons such as value = NULL do not work as an ordinary true/false test. Use IS NULL or IS NOT NULL. SQL conditions involving NULL can evaluate to UNKNOWN, and WHERE keeps only rows where the condition is TRUE.",
      examples: [
        {
          title: "Find records with a missing value",
          concept: "IS NULL checks whether a column has no known value.",
          analogy: "Like finding forms where the phone number field has not been filled in.",
          sql: "SELECT student_id, full_name, email\nFROM students\nWHERE email IS NULL\nORDER BY student_id;",
          explanation: [
            { line: "email IS NULL", meaning: "Keep only rows whose email value is missing (SQL NULL)." }
          ],
          input: [{ name: "students (illustrative NULL email)", columns: ["student_id", "full_name", "email"], rows: [[1, "Meera Shah", "meera@example.com"], [2, "Arjun Patil", null], [3, "Sara Khan", "sara@example.com"]] }],
          output: { columns: ["student_id", "full_name", "email"], rows: [[2, "Arjun Patil", null]] },
          note: "This example uses an illustrative NULL row; the shared starter data may have no missing emails. The query is still valid and would return zero rows when no email is NULL."
        },
        {
          title: "Exclude missing department assignments",
          concept: "IS NOT NULL keeps rows where the value is known.",
          analogy: "Like listing employees who have actually been assigned to a department.",
          sql: "SELECT employee_id, name, department_id\nFROM employees\nWHERE department_id IS NOT NULL\nORDER BY employee_id;",
          explanation: [
            { line: "department_id IS NOT NULL", meaning: "Keep only employees whose department assignment is present." }
          ],
          input: [{ name: "employees (illustrative rows)", columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [2, "Ravi", null], [3, "Nina", 2]] }],
          output: { columns: ["employee_id", "name", "department_id"], rows: [[1, "Asha", 1], [3, "Nina", 2]] }
        }
      ]
    },
    {
      heading: "6. NOT and safe filtering habits",
      body: "NOT reverses a condition, such as NOT IN or NOT LIKE. Be careful with NULL: NOT IN can behave unexpectedly if the list contains NULL. For real data changes, first run a SELECT with the same WHERE condition to confirm which rows match before using UPDATE or DELETE.",
      examples: [
        {
          title: "Exclude selected course IDs",
          concept: "NOT IN keeps values that do not match any listed value, provided the tested value is not NULL.",
          analogy: "Like asking for everyone except students in the selected list.",
          sql: "SELECT enrollment_id, course_id\nFROM enrollments\nWHERE course_id NOT IN (2, 3)\nORDER BY enrollment_id;",
          explanation: [
            { line: "course_id NOT IN (2, 3)", meaning: "Exclude enrolments whose course ID is 2 or 3." }
          ],
          input: [{ name: "enrollments", columns: ["enrollment_id", "course_id"], rows: [[1, 1], [2, 2], [3, 1], [4, 3]] }],
          output: { columns: ["enrollment_id", "course_id"], rows: [[1, 1], [3, 1]] },
          note: "If course_id itself is NULL, NOT IN does not evaluate to TRUE for that row. Handle NULL explicitly when needed."
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "WHERE", meaning: "Keeps only rows matching a condition.", example: "SELECT * FROM courses WHERE fee > 1000;" },
    { keyword: "=", meaning: "Tests equality.", example: "SELECT * FROM students WHERE student_id = 1;" },
    { keyword: "<> / !=", meaning: "Tests inequality; <> is standard SQL.", example: "SELECT * FROM courses WHERE fee <> 999;" },
    { keyword: "> < >= <=", meaning: "Compare numeric or ordered values.", example: "SELECT * FROM courses WHERE fee >= 1000;" },
    { keyword: "AND", meaning: "Every condition must be true.", example: "WHERE fee >= 1000 AND fee < 2000" },
    { keyword: "OR", meaning: "At least one condition must be true.", example: "WHERE course_id = 1 OR course_id = 2" },
    { keyword: "NOT", meaning: "Reverses a condition.", example: "WHERE course_id NOT IN (2, 3)" },
    { keyword: "IN", meaning: "Matches any value from a list.", example: "WHERE course_id IN (1, 2)" },
    { keyword: "BETWEEN", meaning: "Checks an inclusive range.", example: "WHERE fee BETWEEN 1000 AND 1500" },
    { keyword: "LIKE", meaning: "Matches a text pattern; % is many characters and _ is one.", example: "WHERE full_name LIKE 'S%'" },
    { keyword: "IS NULL", meaning: "Finds missing/unknown values.", example: "WHERE email IS NULL" },
    { keyword: "IS NOT NULL", meaning: "Finds known values.", example: "WHERE email IS NOT NULL" }
  ],
  mistakes: [
    { mistake: "Writing = NULL or <> NULL.", tip: "Use IS NULL or IS NOT NULL; NULL represents unknown, so ordinary equality is not the right test." },
    { mistake: "Forgetting that BETWEEN includes both endpoints.", tip: "Use > and < instead if you need an exclusive range." },
    { mistake: "Using AND when you mean OR.", tip: "AND narrows results because every condition must match; OR usually broadens the match." },
    { mistake: "Mixing AND and OR without parentheses.", tip: "Add parentheses to make the intended condition explicit and avoid surprises from operator precedence." },
    { mistake: "Assuming % and _ mean the same thing in LIKE.", tip: "% matches any length of text; _ matches exactly one character." },
    { mistake: "Assuming a SELECT filter deletes nonmatching records.", tip: "WHERE only filters query output. UPDATE and DELETE change data and need extra care." }
  ],
  exercises: [
    { question: "Show course_name and fee for courses costing at least 1200, lowest fee first.", hint: "Use WHERE fee >= 1200 and ORDER BY fee ASC.", answer: "SELECT course_name, fee FROM courses WHERE fee >= 1200 ORDER BY fee ASC;", explanation: "The comparison keeps fees equal to 1200 or higher, and ORDER BY sorts the result." },
    { question: "Find students whose names start with A.", hint: "Use LIKE 'A%'.", answer: "SELECT student_id, full_name FROM students WHERE full_name LIKE 'A%' ORDER BY student_id;", explanation: "A% means the first character is A and any number of characters may follow." },
    { question: "List enrolments for course IDs 1 and 2 only.", hint: "Use IN (1, 2).", answer: "SELECT enrollment_id, student_id, course_id FROM enrollments WHERE course_id IN (1, 2) ORDER BY enrollment_id;", explanation: "IN is a compact way to match either of the listed values." },
    { question: "Find employees who have no department assigned.", hint: "Use department_id IS NULL.", answer: "SELECT employee_id, name FROM employees WHERE department_id IS NULL ORDER BY employee_id;", explanation: "IS NULL checks for a missing value. If the dataset has none, the query correctly returns zero rows." },
    { question: "Find courses with fees from 900 through 1500, including both endpoints.", hint: "Use BETWEEN 900 AND 1500.", answer: "SELECT course_name, fee FROM courses WHERE fee BETWEEN 900 AND 1500 ORDER BY fee;", explanation: "BETWEEN includes 900 and 1500 if rows have those exact values." }
  ],
  quiz: [
    { question: "Which clause filters individual rows in a SELECT query?", options: ["ORDER BY", "WHERE", "GROUP BY", "AS"], answer: 1, explanation: "WHERE keeps only rows that satisfy the condition." },
    { question: "Which operator requires both conditions to be true?", options: ["OR", "NOT", "AND", "IN"], answer: 2, explanation: "AND returns true only when every connected condition is true." },
    { question: "What does BETWEEN 10 AND 20 include?", options: ["Only values above 10 and below 20", "10 and 20 as well as values between them", "Only 10 and 20", "Only values greater than 20"], answer: 1, explanation: "BETWEEN is inclusive: both endpoints are included." },
    { question: "In LIKE 'S%', what does % mean?", options: ["Exactly one character", "A numeric value", "Zero or more characters", "A missing value"], answer: 2, explanation: "% matches zero or more characters; underscore (_) matches exactly one character." },
    { question: "How should SQL test whether email is missing?", options: ["email = NULL", "email == NULL", "email IS NULL", "email LIKE NULL"], answer: 2, explanation: "Use IS NULL because NULL represents a missing or unknown value." }
  ]
};

export default moduleThree;
