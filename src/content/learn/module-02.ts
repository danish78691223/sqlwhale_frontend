import type { LessonModule } from "./types";

const moduleTwo: LessonModule = {
  id: 2,
  title: "SELECT & Expressions",
  difficulty: "Beginner",
  estimatedTime: "35–45 minutes",
  summary: "Choose the columns you need, rename result columns, remove duplicate values and calculate new values directly in SQL.",
  outcomes: [
    "Select all columns or only named columns with SELECT and FROM.",
    "Use AS to give readable names to output columns.",
    "Use DISTINCT to remove duplicate result rows.",
    "Calculate numeric values and build simple text expressions.",
    "Recognize basic functions and understand how NULL affects expressions."
  ],
  analogy: "Imagine a college office has a register with student ID, name, email and enrolment date. SELECT is your request for which fields to show; AS is the heading you want printed on the report; DISTINCT asks the office to list each different value only once; an expression calculates something new while preparing the report.",
  sections: [
    {
      heading: "1. SELECT and FROM: choose your data",
      body: "SELECT tells SQL which columns or expressions to return. FROM tells SQL which table supplies the data. The result is a new view of the data; a normal SELECT query does not change the stored rows.",
      examples: [
        {
          title: "Choose only the columns you need",
          concept: "The students table has student_id, full_name, email and enrolled_on. This query returns only the name and email.",
          analogy: "Like asking for just two columns from a paper register instead of photocopying the whole page.",
          sql: "SELECT full_name, email\nFROM students\nORDER BY student_id;",
          explanation: [
            { line: "SELECT full_name, email", meaning: "Choose the two output columns, in this order." },
            { line: "FROM students", meaning: "Read the rows from the students table." },
            { line: "ORDER BY student_id", meaning: "Show rows in student ID order so the example output is predictable." }
          ],
          input: [{ name: "students", columns: ["student_id", "full_name", "email"], rows: [[1, "Meera Shah", "meera@example.com"], [2, "Arjun Patil", "arjun@example.com"], [3, "Sara Khan", "sara@example.com"]] }],
          output: { columns: ["full_name", "email"], rows: [["Meera Shah", "meera@example.com"], ["Arjun Patil", "arjun@example.com"], ["Sara Khan", "sara@example.com"]] }
        },
        {
          title: "SELECT * versus named columns",
          concept: "An asterisk (*) means every column. It is convenient for exploring a table, but named columns are usually better for reports because the output is focused and stable.",
          analogy: "SELECT * is asking for the complete register; named columns are asking for specific fields.",
          sql: "SELECT *\nFROM courses;",
          explanation: [
            { line: "SELECT *", meaning: "Return every column in the table." },
            { line: "FROM courses", meaning: "Use the courses table as the data source." }
          ],
          input: [{ name: "courses", columns: ["course_id", "course_name", "fee"], rows: [[1, "SQL Basics", 999], [2, "Data Analytics", 1499]] }],
          output: { columns: ["course_id", "course_name", "fee"], rows: [[1, "SQL Basics", 999], [2, "Data Analytics", 1499]] },
          note: "Column order follows the table definition. Avoid relying on SELECT * in production reports when you only need a few fields."
        }
      ]
    },
    {
      heading: "2. Aliases with AS: make output readable",
      body: "An alias is a temporary label for a column or expression in the query result. AS makes that label explicit. It does not rename the real database column or change stored data.",
      examples: [
        {
          title: "Rename result headings",
          concept: "Use aliases to make column headings clearer for a report or dashboard.",
          analogy: "You are printing a friendlier heading on a report without changing the original register.",
          sql: "SELECT full_name AS student_name,\n       enrolled_on AS joining_date\nFROM students\nORDER BY student_id;",
          explanation: [
            { line: "full_name AS student_name", meaning: "Display full_name under the result heading student_name." },
            { line: "enrolled_on AS joining_date", meaning: "Display enrolled_on under the heading joining_date." },
            { line: "FROM students", meaning: "Read the original values from students; the stored columns are unchanged." }
          ],
          input: [{ name: "students", columns: ["student_id", "full_name", "enrolled_on"], rows: [[1, "Meera Shah", "2026-01-10"], [2, "Arjun Patil", "2026-01-12"]] }],
          output: { columns: ["student_name", "joining_date"], rows: [["Meera Shah", "2026-01-10"], ["Arjun Patil", "2026-01-12"]] }
        }
      ]
    },
    {
      heading: "3. DISTINCT: show unique values",
      body: "DISTINCT removes duplicate rows from the selected result. If you select one column, it returns each different value once. If you select two columns, it removes duplicate pairs—not duplicates from each column independently.",
      examples: [
        {
          title: "List each course fee once",
          concept: "The courses table currently has different fees, but DISTINCT is useful when many records repeat a category or value.",
          analogy: "If many students attend the same course, DISTINCT gives you the unique course list rather than repeating a course for every student.",
          sql: "SELECT DISTINCT course_id\nFROM enrollments\nORDER BY course_id;",
          explanation: [
            { line: "SELECT DISTINCT course_id", meaning: "Return each different course_id only once." },
            { line: "FROM enrollments", meaning: "Read course references from enrolment records." },
            { line: "ORDER BY course_id", meaning: "Sort the unique IDs from smallest to largest." }
          ],
          input: [{ name: "enrollments", columns: ["enrollment_id", "student_id", "course_id"], rows: [[1, 1, 1], [2, 1, 2], [3, 2, 1]] }],
          output: { columns: ["course_id"], rows: [[1], [2]] }
        }
      ]
    },
    {
      heading: "4. Calculated columns: arithmetic expressions",
      body: "An expression combines values, operators or functions to produce a result. SQL supports arithmetic such as +, -, * and /. A calculated column is returned by the query; it is not saved into the table unless you explicitly run a data-changing statement.",
      examples: [
        {
          title: "Calculate a discounted course fee",
          concept: "Here the query calculates a 10% discount and the final fee for each course.",
          analogy: "A shopkeeper calculates the sale price on a bill without rewriting the original marked price in the product register.",
          sql: "SELECT course_name, fee,\n       fee * 0.10 AS discount,\n       fee - (fee * 0.10) AS final_fee\nFROM courses\nORDER BY course_id;",
          explanation: [
            { line: "fee * 0.10 AS discount", meaning: "Calculate 10% of the fee and label the result discount." },
            { line: "fee - (fee * 0.10) AS final_fee", meaning: "Subtract the discount from the original fee." },
            { line: "FROM courses", meaning: "Calculate the values for each course row." }
          ],
          input: [{ name: "courses", columns: ["course_id", "course_name", "fee"], rows: [[1, "SQL Basics", 999], [2, "Data Analytics", 1499]] }],
          output: { columns: ["course_name", "fee", "discount", "final_fee"], rows: [["SQL Basics", 999, 99.9, 899.1], ["Data Analytics", 1499, 149.9, 1349.1]] },
          note: "The displayed decimal format may vary by database client. For currency reports, consider an explicit rounding function supported by your SQL engine."
        }
      ]
    },
    {
      heading: "5. Text expressions and basic functions",
      body: "Text concatenation combines text values, but syntax differs between database engines. SQLite supports the || operator. Many engines provide functions such as UPPER, LOWER and LENGTH; exact function names and behavior can vary by engine. SQLWhale's current sandbox uses SQLite.",
      examples: [
        {
          title: "Create a display label and normalize text",
          concept: "Combine a student name with a label, and show the name in uppercase. SQLite's || operator joins text values.",
          analogy: "Like joining a first and last name to print one label, then using uppercase letters for a heading.",
          sql: "SELECT full_name,\n       'Student: ' || full_name AS display_label,\n       UPPER(full_name) AS name_upper,\n       LENGTH(full_name) AS name_length\nFROM students\nORDER BY student_id;",
          explanation: [
            { line: "'Student: ' || full_name", meaning: "Join the literal text Student: with the student's name." },
            { line: "UPPER(full_name)", meaning: "Return the name in uppercase letters." },
            { line: "LENGTH(full_name)", meaning: "Count characters in the text value in SQLite." },
            { line: "AS display_label / name_upper / name_length", meaning: "Give each calculated expression a readable output heading." }
          ],
          input: [{ name: "students", columns: ["student_id", "full_name"], rows: [[1, "Meera Shah"], [2, "Arjun Patil"], [3, "Sara Khan"]] }],
          output: { columns: ["full_name", "display_label", "name_upper", "name_length"], rows: [["Meera Shah", "Student: Meera Shah", "MEERA SHAH", 10], ["Arjun Patil", "Student: Arjun Patil", "ARJUN PATIL", 11], ["Sara Khan", "Student: Sara Khan", "SARA KHAN", 9]] },
          note: "SQLite LENGTH counts characters for ordinary text. In other engines, check the corresponding string-length function and concatenation syntax."
        }
      ]
    },
    {
      heading: "6. How NULL affects expressions",
      body: "NULL means a value is missing or unknown. Most arithmetic and text expressions involving NULL produce NULL, because SQL cannot calculate a definite result from an unknown value. Use COALESCE(value, fallback) to replace NULL with a chosen fallback where appropriate.",
      examples: [
        {
          title: "Provide a fallback for missing text",
          concept: "COALESCE returns the first non-NULL argument. This query keeps a missing email from making the display label missing.",
          analogy: "If a form has no email address, use the words Not provided as a fallback label.",
          sql: "SELECT full_name,\n       COALESCE(email, 'Not provided') AS email_display\nFROM students\nORDER BY student_id;",
          explanation: [
            { line: "COALESCE(email, 'Not provided')", meaning: "Use email when it is not NULL; otherwise use the fallback text." },
            { line: "AS email_display", meaning: "Name the result column email_display." }
          ],
          input: [{ name: "students (illustrative missing email)", columns: ["student_id", "full_name", "email"], rows: [[1, "Meera Shah", "meera@example.com"], [2, "Arjun Patil", null]] }],
          output: { columns: ["full_name", "email_display"], rows: [["Meera Shah", "meera@example.com"], ["Arjun Patil", "Not provided"]] },
          note: "The second row is an illustrative example of a NULL email; the provided starter dataset has emails for all three students."
        }
      ]
    }
  ],
  cheatSheet: [
    { keyword: "SELECT", meaning: "Chooses columns or expressions to return.", example: "SELECT full_name FROM students;" },
    { keyword: "FROM", meaning: "Names the source table.", example: "SELECT course_name FROM courses;" },
    { keyword: "*", meaning: "Selects every column; best used for exploration.", example: "SELECT * FROM students;" },
    { keyword: "AS", meaning: "Gives a temporary result-column alias.", example: "SELECT fee AS course_fee FROM courses;" },
    { keyword: "DISTINCT", meaning: "Removes duplicate result rows.", example: "SELECT DISTINCT course_id FROM enrollments;" },
    { keyword: "+ - * /", meaning: "Arithmetic operators for numeric expressions.", example: "SELECT fee * 1.10 AS increased_fee FROM courses;" },
    { keyword: "||", meaning: "Concatenates text in SQLite.", example: "SELECT full_name || ' - student' AS label FROM students;" },
    { keyword: "UPPER / LOWER", meaning: "Converts text to uppercase or lowercase.", example: "SELECT UPPER(full_name) FROM students;" },
    { keyword: "LENGTH", meaning: "Returns a text length in SQLite.", example: "SELECT LENGTH(full_name) FROM students;" },
    { keyword: "COALESCE", meaning: "Returns the first non-NULL argument.", example: "SELECT COALESCE(email, 'Not provided') FROM students;" }
  ],
  mistakes: [
    { mistake: "Using SELECT * for every report.", tip: "Name only the columns you need; this improves readability and reduces accidental exposure of extra fields." },
    { mistake: "Thinking AS renames the real table column.", tip: "An alias changes only the output heading for that query; it does not alter the schema." },
    { mistake: "Expecting DISTINCT to deduplicate each column separately.", tip: "DISTINCT applies to the complete selected row or combination of selected expressions." },
    { mistake: "Forgetting operator precedence in calculations.", tip: "Use parentheses to make the intended calculation clear, for example fee - (fee * 0.10)." },
    { mistake: "Using the wrong string concatenation syntax for the database.", tip: "This sandbox uses SQLite's || operator. Other engines may use CONCAT() or other supported syntax." },
    { mistake: "Assuming NULL behaves like an empty string or zero.", tip: "Use COALESCE for a fallback and IS NULL when checking for missing values." }
  ],
  exercises: [
    { question: "Show only course_name and fee from courses, sorted by course_id.", hint: "List the two columns after SELECT and add ORDER BY.", answer: "SELECT course_name, fee FROM courses ORDER BY course_id;", explanation: "The query returns only the requested columns and keeps the sample order predictable." },
    { question: "Show each course_id used in enrollments once.", hint: "Use DISTINCT before the column name.", answer: "SELECT DISTINCT course_id FROM enrollments ORDER BY course_id;", explanation: "The enrollments table has course_id 1 twice, so DISTINCT returns 1 and 2." },
    { question: "Display every student's name under the heading student.", hint: "Use AS to create an alias.", answer: "SELECT full_name AS student FROM students ORDER BY student_id;", explanation: "AS changes the result heading, not the stored column name." },
    { question: "Calculate a 5% fee increase and call it increased_fee.", hint: "Multiply fee by 1.05.", answer: "SELECT course_name, fee * 1.05 AS increased_fee FROM courses ORDER BY course_id;", explanation: "Multiplying by 1.05 keeps the original amount plus five percent." },
    { question: "Create a display label that says Student: followed by each full name.", hint: "In SQLite, join text with ||.", answer: "SELECT 'Student: ' || full_name AS display_label FROM students ORDER BY student_id;", explanation: "The || operator concatenates the literal text and the student's name in SQLite." }
  ],
  quiz: [
    { question: "Which clause names the table that supplies the data?", options: ["SELECT", "FROM", "AS", "DISTINCT"], answer: 1, explanation: "FROM identifies the source table or tables." },
    { question: "What does SELECT * return?", options: ["Only the primary key", "Only text columns", "All columns in the selected table", "Only unique rows"], answer: 2, explanation: "The asterisk selects all columns. It does not automatically remove duplicate rows." },
    { question: "What does AS do in SELECT full_name AS student?", options: ["Permanently renames the column", "Creates a temporary result heading", "Deletes duplicate names", "Filters rows"], answer: 1, explanation: "AS gives the output column a query-level alias; the table schema stays unchanged." },
    { question: "If DISTINCT is used with two columns, what is considered a duplicate?", options: ["Either column repeats", "The whole selected pair repeats", "Only the first column repeats", "Every row is removed"], answer: 1, explanation: "DISTINCT removes duplicate combinations across all selected expressions." },
    { question: "Which expression joins text in SQLWhale's SQLite sandbox?", options: ["full_name + ' student'", "full_name || ' student'", "JOIN_TEXT(full_name)", "full_name CONCAT ' student'"], answer: 1, explanation: "SQLite supports the || operator for text concatenation." }
  ]
};

export default moduleTwo;
