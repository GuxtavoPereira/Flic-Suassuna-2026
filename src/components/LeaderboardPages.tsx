import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Info, RotateCcw, Trophy } from 'lucide-react';
import { useSession } from '../app-state';
import { summarizeVisit } from '../domain/visit';
import { leaderboardRepository, LEADERBOARD_EVENT, MAX_ENTRIES, rankEntries } from '../services/leaderboard';
import { useLeaderboard } from '../services/useLeaderboard';
export function VisitEnd() {
  const { answers, rounds, visitId, reset } = useSession();
  const summary = summarizeVisit(answers, rounds);
  const stored = useLeaderboard();
  const existing = stored.entries.find(e => e.id === visitId);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setError('Marque a opção de participação para exibir seu resultado.'); return; }
    const result = leaderboardRepository.save(visitId, name, answers, rounds);
    if (!result.ok) {
      setError(result.error === 'name' ? 'Use de 2 a 24 caracteres: letras, números, espaço, ponto, hífen ou apóstrofo.' : result.error === 'empty' ? 'Conclua o quiz de um tema antes de registrar a visita.' : 'Não foi possível salvar neste navegador. Você pode continuar explorando ou encerrar sem participar.');
      return;
    }
    window.dispatchEvent(new Event(LEADERBOARD_EVENT));
    navigate('/ranking', { state: { savedVisitId: result.entry.id } });
  }
  function nextVisitor() { reset(); navigate('/boas-vindas'); }
  return <div className="visit-end-page page-width"><div className="page-top"><Link className="back-link" to="/"><ArrowLeft size={22} aria-hidden="true"/>Continuar explorando</Link><span>FIM DA VISITA</span></div><div className="visit-end-layout"><section className="visit-summary"><span className="result-icon"><Trophy size={50} aria-hidden="true"/></span><span className="eyebrow">CADA DESCOBERTA CONTA</span><h1 tabIndex={-1}>O que você leva do sertão?</h1><p>Um encontro com histórias, saberes e novas ideias.</p><dl className="visit-stats"><div><dt>Acertos</dt><dd>{summary.correct}<span>de {summary.answered} respondidas</span></dd></div><div><dt>Temas concluídos</dt><dd>{summary.completedThemes}<span>de 6 temas</span></dd></div></dl><p className="small-note">Sua visita pode valer até {summary.total} perguntas. Só a primeira rodada concluída de cada tema entra no ranking; rodadas de treino não mudam esses acertos.</p></section><section className="ranking-signup" aria-labelledby="ranking-signup-title"><span className="eyebrow">RANKING DESTE TOTEM</span><h2 id="ranking-signup-title">Quer deixar sua marca?</h2><p>Participe com seu primeiro nome ou um apelido. Entrar no ranking é opcional.</p>{stored.status !== 'ok' && <div className="ranking-notice" role="status"><Info aria-hidden="true"/><p>{stored.status === 'corrupt' ? 'O ranking salvo não pôde ser lido. Avise a organização. Sua visita pode continuar normalmente.' : 'O navegador não permite salvar o ranking. Sua visita pode continuar normalmente.'}</p></div>}{existing ? <div className="ranking-saved"><CheckCircle2 aria-hidden="true"/><p>Esta visita já foi registrada como <strong>{existing.displayName}</strong>, com {existing.correct} acertos.</p><Link className="button primary" to="/ranking" state={{ savedVisitId: existing.id }}>Ver ranking<ArrowRight aria-hidden="true"/></Link><button className="button secondary" onClick={nextVisitor}><RotateCcw aria-hidden="true"/>Iniciar próxima visita</button></div> : summary.answered > 0 ? <form onSubmit={submit}><label className="name-label" htmlFor="visitor-name">Primeiro nome ou apelido</label><input id="visitor-name" name="displayName" value={name} onChange={event => { setName(event.target.value); setError(''); }} minLength={2} maxLength={24} autoComplete="off" autoCapitalize="words" spellCheck={false} required aria-describedby="name-help" placeholder="Ex.: Ana ou Mandacaru"/><p id="name-help" className="small-note">Evite sobrenome. Esse nome ficará visível para os visitantes deste totem.</p><label className="ranking-consent"><input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); setError(''); }} required/><span>Quero exibir este nome e meus acertos no ranking deste totem.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary" type="submit" disabled={stored.status !== 'ok'}>Salvar visita no ranking<ArrowRight aria-hidden="true"/></button><button className="text-button" type="button" onClick={nextVisitor}>Encerrar sem participar</button></form> : <div className="ranking-empty"><p>Leia os cinco posts e conclua o quiz de um tema para registrar suas descobertas.</p><Link className="button primary" to="/">Explorar temas<ArrowRight aria-hidden="true"/></Link></div>}<p className="ranking-storage-note">Os resultados ficam só neste navegador, inclusive sem internet. Não são enviados a um servidor. Apagar os dados do navegador remove o ranking.</p></section></div></div>;
}
export function Leaderboard() {
  const stored = useLeaderboard();
  const { rounds } = useSession();
  const currentSize = Object.values(rounds).filter(r => r.rankingAnswers).length || 1;
  const [group, setGroup] = useState<number | 'legacy'>(currentSize);
  const rows = rankEntries(stored.entries.filter(e => group === 'legacy' ? !e.rulesVersion : e.rulesVersion === 2 && e.completedThemes === group));
  const location = useLocation();
  const savedId = (location.state as { savedVisitId?: string } | null)?.savedVisitId;
  const saved = rows.find(e => e.id === savedId);
  const { reset } = useSession();
  const navigate = useNavigate();
  return <div className="leaderboard-page page-width"><div className="page-top"><Link className="back-link" to="/"><ArrowLeft size={22} aria-hidden="true"/>Voltar aos temas</Link><span><Trophy size={20} aria-hidden="true"/> RESULTADOS LOCAIS</span></div><div className="leaderboard-heading"><div><span className="eyebrow">AS DESCOBERTAS DA NOSSA VISITA</span><h1 tabIndex={-1}>Ranking do totem.</h1><p>Compare visitas com o mesmo número de temas concluídos. Empates em acertos compartilham a posição.</p></div><Link className="button secondary" to="/fim-da-visita">Encerrar minha visita<ArrowRight aria-hidden="true"/></Link></div><p className="ranking-rule">Cada tema vale 3 perguntas: uma de reconhecimento, uma de compreensão e uma de interpretação. A primeira rodada concluída vale; treino não melhora a pontuação. Este ranking é local e não verifica identidade.</p><div className="ranking-filters" role="group" aria-label="Quantidade de temas no ranking">{[1,2,3,4,5,6].map(n => <button key={n} aria-pressed={group === n} onClick={() => setGroup(n)}>{n} {n === 1 ? 'tema' : 'temas'} · {n * 3} perguntas</button>)}{stored.entries.some(e => !e.rulesVersion) && <button aria-pressed={group === 'legacy'} onClick={() => setGroup('legacy')}>Edição anterior</button>}</div>{saved && <p className="ranking-success" role="status"><CheckCircle2 aria-hidden="true"/>Visita de {saved.displayName} registrada: {saved.correct} acertos em {saved.answered} perguntas respondidas. Posição {saved.rank}.</p>}{stored.status !== 'ok' ? <div className="ranking-empty"><Info size={38} aria-hidden="true"/><h2>Não foi possível abrir o ranking.</h2><p>{stored.status === 'corrupt' ? 'Os dados salvos não puderam ser lidos. Avise a organização para verificar o navegador.' : 'O armazenamento está indisponível neste navegador.'}</p><Link className="button secondary" to="/">Continuar explorando</Link></div> : rows.length === 0 ? <div className="ranking-empty"><Trophy size={48} aria-hidden="true"/><h2>A primeira descoberta pode ser sua.</h2><p>Conclua um quiz e, ao encerrar a visita, escolha participar.</p><Link className="button primary" to="/">Explorar temas<ArrowRight aria-hidden="true"/></Link></div> : <div className="leaderboard-table-wrap" tabIndex={0} role="region" aria-label="Resultados do ranking"><table className="leaderboard-table"><caption>Resultados salvos neste navegador · {rows.length} {rows.length === 1 ? 'visita' : 'visitas'}</caption><thead><tr><th scope="col">Posição</th><th scope="col">Nome ou apelido</th><th scope="col">Acertos</th><th scope="col">Respondidas</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className={row.id === savedId ? 'current-visit' : ''}><td><span className="rank-position">{row.rank <= 3 && <Trophy size={19} aria-hidden="true"/>}{row.rank}º</span></td><th scope="row">{row.displayName}{row.id === savedId && <span className="your-visit">Sua visita</span>}</th><td><strong>{row.correct}</strong></td><td>{row.answered} de {row.total}</td></tr>)}</tbody></table></div>}<div className="leaderboard-footer"><p className="small-note">Mesmo total de acertos nesta categoria: mesma posição. Edições anteriores ficam separadas. São mantidas as {MAX_ENTRIES} visitas mais recentes. Resultados locais não aparecem em outros dispositivos.</p><button className="button primary" onClick={() => { reset(); navigate('/boas-vindas'); }}><RotateCcw aria-hidden="true"/>Iniciar próxima visita</button></div></div>;
}
export function LeaderboardSettings() {
  const stored = useLeaderboard();
  const [notice, setNotice] = useState('');
  function clear() {
    if (!window.confirm('Apagar todos os nomes e resultados do ranking deste navegador? Essa ação não pode ser desfeita.')) return;
    const cleared = leaderboardRepository.clear();
    setNotice(cleared ? 'Ranking deste navegador apagado.' : 'Não foi possível apagar o ranking neste navegador.');
    if (cleared) window.dispatchEvent(new Event(LEADERBOARD_EVENT));
  }
  return <details className="ranking-settings"><summary>Dados do ranking deste totem</summary><p className="small-note">{stored.entries.length} visitas salvas. Reiniciar a visita não apaga o ranking.</p><button className="button secondary" type="button" onClick={clear}>Apagar ranking deste navegador</button><p className="small-note">A organização pode limpar os resultados ao fim da atividade.</p>{notice && <p role="status">{notice}</p>}</details>;
}