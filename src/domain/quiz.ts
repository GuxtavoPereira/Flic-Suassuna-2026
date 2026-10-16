import type { QuizQuestion } from './content';
export type Answers = Record<string, number>;
export function answerQuestion(answers: Answers, question: QuizQuestion, option: number): Answers {
  if (Object.hasOwn(answers, question.id) || !Number.isInteger(option) || option < 0 || option >= question.options.length) return answers;
  return { ...answers, [question.id]: question.optionOrder?.[option] ?? option };
}
export function quizScore(questions: QuizQuestion[], answers: Answers) {
  const correct = questions.filter(q => answers[q.id] === (q.optionOrder?.[q.correctIndex] ?? q.correctIndex)).length;
  const answered = questions.filter(q => Object.hasOwn(answers, q.id)).length;
  return { correct, answered, total: questions.length, points: correct * 100, complete: answered === questions.length };
}