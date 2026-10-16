import { z } from 'zod';
import { questionSchema } from '../domain/content';
const post = z.object({ id: z.string(), themeId: z.string(), topicId: z.string(), title: z.string().min(1), text: z.string().min(1), body: z.string().min(1), curiosity: z.string(), visualKey: z.string(), status: z.literal('draft-editorial'), assetId: z.string(), tags: z.array(z.string()), type: z.literal('educational'), introductory: z.boolean(), order: z.number().int() });
const question = questionSchema.extend({ themeId: z.string(), topicId: z.string(), difficulty: z.number().int().min(1).max(3), tags: z.array(z.string()), postIds: z.array(z.string()).min(1) });
export const poolSchema = z.object({ version: z.literal(2), posts: z.array(post), questions: z.array(question) }).superRefine((data, ctx) => {
  const ids = [...data.posts, ...data.questions].map(c => c.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'IDs duplicados no pool.' });
  for (const q of data.questions) {
    if (!data.posts.some(p => p.themeId === q.themeId && p.topicId === q.topicId)) ctx.addIssue({ code: 'custom', message: `Pergunta sem post: ${q.id}` });
    if (q.postIds.some(id => !data.posts.some(p => p.id === id && p.themeId === q.themeId && p.topicId === q.topicId))) ctx.addIssue({ code: 'custom', message: `Associação inválida: ${q.id}` });
    if (new Set(q.options).size !== 4) ctx.addIssue({ code: 'custom', message: `Alternativas repetidas: ${q.id}` });
  }
});
