export type LessonExample = {
  title: string;
  concept: string;
  analogy: string;
  sql: string;
  explanation: { line: string; meaning: string }[];
  input: { name: string; columns: string[]; rows: (string | number | null)[][] }[];
  output: { columns: string[]; rows: (string | number | null)[][] };
  note?: string;
};
export type PracticeExercise = { question: string; hint: string; answer: string; explanation: string };
export type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };
export type LessonModule = {
  id: number; title: string; difficulty: string; estimatedTime: string;
  summary: string; outcomes: string[]; analogy: string;
  sections: { heading: string; body: string; examples?: LessonExample[] }[];
  cheatSheet: { keyword: string; meaning: string; example: string }[];
  mistakes: { mistake: string; tip: string }[];
  exercises: PracticeExercise[];
  quiz: QuizQuestion[];
};