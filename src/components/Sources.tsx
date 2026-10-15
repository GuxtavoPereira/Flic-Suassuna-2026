import { sources } from '../content';
export function Sources({ ids }: { ids: string[] }) {
  return <details className="sources"><summary>Fontes e curadoria</summary><p>Texto pedagógico original · rascunho em revisão editorial.</p>{ids.length ? <ul>{sources.filter(s => ids.includes(s.id)).map(s => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></li>)}</ul> : <p>Fonte específica pendente de conferência pelo responsável pedagógico antes da exposição.</p>}</details>;
}