import { z } from 'zod';
export const rawModuleIds = ['clima', 'cultura', 'personalidades', 'linha-do-tempo', 'culinaria', 'ariano'] as const;
export type BaseModuleId = typeof rawModuleIds[number];
export type RawModuleId = BaseModuleId | 'musica-audiovisual' | 'festas-religiosidade';
export type ThemeId = 'clima-vegetacao' | Exclude<RawModuleId, 'clima'>;
export const questionSchema = z.object({ id: z.string().min(1), question: z.string().min(1), options: z.array(z.string().min(1)).length(4), correctIndex: z.number().int().min(0).max(3), feedback: z.string().min(1) });
export const moduleSchema = z.object({ id: z.enum(rawModuleIds), title: z.string(), subtitle: z.string(), cover: z.string().regex(/^\/assets\/xilogravuras\/[a-z-]+\.webp$/), slides: z.array(z.object({ id: z.string(), title: z.string(), body: z.string(), curiosity: z.string(), visualKey: z.string(), status: z.literal('draft-editorial') })).length(5), quiz: z.array(questionSchema).length(3) });
export const contentSchema = z.object({ project: z.string(), version: z.string(), language: z.literal('pt-BR'), modules: z.array(moduleSchema).length(6) }).superRefine((data, ctx) => {
  const ids = data.modules.flatMap(m => [m.id, ...m.slides.map(s => s.id), ...m.quiz.map(q => q.id)]);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'IDs de conteúdo devem ser únicos.' });
});
export type QuizQuestion = z.infer<typeof questionSchema> & { sources: string[]; themeId: string; topicId: string; difficulty: number; tags: string[]; optionOrder?: number[]; postIds?: string[] };
export interface SourceMetadata { sourceName: string; sourceUrl: string; credit: string; caption: string; licenseNote: string; assetType: string; relatedWork?: string }
export type EducationalSlide = z.infer<typeof moduleSchema>['slides'][number] & { type: 'educational'; sources: string[]; themeId: string; topicId: string; text: string; image: string; alt: string; tags: string[]; sourceMetadata: SourceMetadata; introductory: boolean; order: number; source: string[]; imageCredit: string; imageLicense: string; postType: string; editorialStatus: string; quizEligible: boolean; experience?: string };
export interface LiterarySlide {
  type: 'literary'; id: string; workTitle: string; year: number; genre: string;
  author: string; context: string; connectionToTheme: string; placeholderParaphrase: string; question: string;
  permissionStatus: 'approved' | 'pending' | 'rejected'; quoteText?: string; edition?: string; page?: string;
  authorization?: string; editorialVerified?: boolean; sources: string[]; moduleIds: RawModuleId[];
}
export type Slide = EducationalSlide | LiterarySlide;
export interface Theme { quizEnabled: boolean; postsPerVisit: number; id: ThemeId; rawId: RawModuleId; title: string; subtitle: string; cover: string; alt: string; category: string; color: string; tint: string; slides: EducationalSlide[]; quiz: QuizQuestion[]; postPool: EducationalSlide[]; questionPool: QuizQuestion[] }
export function allowedQuote(slide: LiterarySlide): string | undefined {
  if (slide.permissionStatus !== 'approved' || !slide.editorialVerified || !slide.quoteText?.trim() || !slide.edition?.trim() || !slide.page?.trim() || !slide.authorization?.trim() || !slide.sources.length) return undefined;
  return slide.quoteText;
}
export function slideIndex(index: number, direction: number, total: number) { return Math.max(0, Math.min(total - 1, index + direction)); }