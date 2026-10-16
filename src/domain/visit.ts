import { themes } from '../content';
import type { Answers } from './quiz';
import type { Rounds } from './rotation';
export interface VisitSummary { correct: number; answered: number; total: number; completedThemes: number }
export function summarizeVisit(answers: Record<string, Answers>, rounds?: Rounds): VisitSummary {
  let correct = 0;
  let answered = 0;
  let completedThemes = 0;
  for (const theme of themes) {
    let themeAnswered = 0;
    const locked = rounds?.[theme.id]?.rankingAnswers;
    const available = rounds ? theme.questionPool.filter(q => Object.hasOwn(locked ?? {}, q.id)) : theme.quiz;
    if (rounds && (available.length !== 3 || new Set(available.map(q => q.difficulty)).size !== 3)) continue;
    for (const question of available) {
      const selected = (rounds ? locked : answers[theme.id])?.[question.id];
      if (typeof selected !== 'number' || !Number.isInteger(selected) || selected < 0 || selected >= question.options.length) continue;
      answered++; themeAnswered++;
      if (selected === question.correctIndex) correct++;
    }
    if (themeAnswered === 3) completedThemes++;
  }
  return { correct, answered, total: themes.reduce((n, theme) => n + theme.quiz.length, 0), completedThemes };
}