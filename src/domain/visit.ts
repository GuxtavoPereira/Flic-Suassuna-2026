import { themes } from '../content';
import type { Answers } from './quiz';
export interface VisitSummary { correct: number; answered: number; total: number; completedThemes: number }
export function summarizeVisit(answers: Record<string, Answers>): VisitSummary {
  let correct = 0;
  let answered = 0;
  let completedThemes = 0;
  for (const theme of themes) {
    let themeAnswered = 0;
    for (const question of theme.quiz) {
      const selected = answers[theme.id]?.[question.id];
      if (typeof selected !== 'number' || !Number.isInteger(selected) || selected < 0 || selected >= question.options.length) continue;
      answered++; themeAnswered++;
      if (selected === question.correctIndex) correct++;
    }
    if (themeAnswered === theme.quiz.length) completedThemes++;
  }
  return { correct, answered, total: themes.reduce((n, theme) => n + theme.quiz.length, 0), completedThemes };
}