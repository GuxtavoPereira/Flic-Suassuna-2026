import type { EducationalSlide, QuizQuestion, Theme } from './content';
export const POSTS_PER_VISIT = 5;
export const QUESTIONS_PER_QUIZ = 3;
export interface RecentContent { posts: string[]; questions: string[] }
export interface ThemeRound { postIds: string[]; seenPostIds: string[]; questions: QuizQuestion[]; practice: boolean; rankingAnswers?: Record<string, number> }
export type Rounds = Record<string, ThemeRound>;
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.max(0, Math.min(0.999999999, random())) * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
function preferFresh<T extends { id: string }>(items: T[], recent: string[], random: () => number): T[] {
  const order = shuffled(items, random);
  return order.sort((a, b) => (recent.lastIndexOf(a.id) + 1) - (recent.lastIndexOf(b.id) + 1));
}
export function shuffleQuestion(question: QuizQuestion, random: () => number = Math.random): QuizQuestion {
  const optionOrder = shuffled([0, 1, 2, 3], random);
  return { ...question, options: optionOrder.map(i => question.options[i]), correctIndex: optionOrder.indexOf(question.correctIndex), optionOrder };
}
export function selectQuestions(questions: QuizQuestion[], posts: EducationalSlide[], recent: string[] = [], random = Math.random): QuizQuestion[] {
  const topics = new Set(posts.map(p => p.topicId));
  const candidates = preferFresh(questions.filter(q => topics.has(q.topicId) && q.postIds?.some(id => posts.some(p => p.id === id))), recent, random);
  const picked: QuizQuestion[] = [];
  for (const difficulty of [1, 2, 3]) {
    const q = candidates.find(q => q.difficulty === difficulty && !picked.some(p => p.id === q.id));
    if (!q) return []; // A short or unbalanced pool never creates an unequal competitive round.
    picked.push(q);
  }
  return shuffled(picked, random).map(q => shuffleQuestion(q, random));
}
export function createRound(theme: Theme, history: RecentContent, practice = false, random = Math.random): ThemeRound {
  const mandatory = preferFresh(theme.postPool.filter(p => p.introductory), history.posts, random).slice(0, 1);
  const optional = preferFresh(theme.postPool.filter(p => !p.introductory), history.posts, random);
  const selected = [...mandatory];
  for (const post of optional) { if (selected.length >= POSTS_PER_VISIT) break; if (!selected.some(p => p.topicId === post.topicId)) selected.push(post); }
  selected.sort((a, b) => a.order - b.order);
  return { postIds: selected.map(p => p.id), seenPostIds: [], questions: selectQuestions(theme.questionPool, selected, history.questions, random), practice };
}
export function roundReady(round: ThemeRound) { return round.questions.length === QUESTIONS_PER_QUIZ && round.postIds.every(id => round.seenPostIds.includes(id)); }
export function remember(history: RecentContent, posts: string[], questions: string[]): RecentContent {
  const append = (old: string[], ids: string[]) => [...old.filter(id => !ids.includes(id)), ...ids].slice(-120);
  return { posts: append(history.posts, posts), questions: append(history.questions, questions) };
}
