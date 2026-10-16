import { z } from 'zod';
import { questionSchema } from '../domain/content';
const themeId = z.enum(['clima-vegetacao', 'cultura', 'personalidades', 'linha-do-tempo', 'culinaria', 'ariano', 'musica-audiovisual', 'festas-religiosidade']);
const post = z.object({ id: z.string(), themeId: themeId, topicId: z.string(), title: z.string().min(1), text: z.string().min(1), body: z.string().min(1), curiosity: z.string(), visualKey: z.string(), status: z.literal('draft-editorial'), assetId: z.string(), tags: z.array(z.string()), type: z.literal('educational'), introductory: z.boolean(), order: z.number().int(), source: z.array(z.string()).min(1), postType: z.literal('educational'), editorialStatus: z.enum(['review-pending', 'approved']), quizEligible: z.boolean(), required: z.boolean(), experience: z.string().optional(), imageContext: z.string().optional() });
const question = questionSchema.extend({ themeId: themeId, topicId: z.string(), difficulty: z.number().int().min(1).max(3), tags: z.array(z.string()), postIds: z.array(z.string()).min(1) });
export const poolSchema = z.object({ version: z.literal(3), posts: z.array(post), questions: z.array(question) }).superRefine((data, ctx) => {
  const ids = [...data.posts, ...data.questions].map(c => c.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'IDs duplicados no pool.' });
  for (const q of data.questions) {
    if (!data.posts.some(p => p.quizEligible && p.themeId === q.themeId && p.topicId === q.topicId)) ctx.addIssue({ code: 'custom', message: `Pergunta sem post: ${q.id}` });
    if (q.postIds.some(id => !data.posts.some(p => p.id === id && p.quizEligible && p.themeId === q.themeId && p.topicId === q.topicId))) ctx.addIssue({ code: 'custom', message: `Associação inválida: ${q.id}` });
    if (new Set(q.options).size !== 4) ctx.addIssue({ code: 'custom', message: `Alternativas repetidas: ${q.id}` });
  }
});
