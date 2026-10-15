import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Cloud, CloudRain, Leaf, Pause, Play, Sun } from 'lucide-react';
import { climateStages, timeline } from '../content';
import { useSession } from '../app-state';
import { Sources } from './Sources';
export function ClimateExperience() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { reducedMotion } = useSession();
  const systemReduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = !reducedMotion && !systemReduced;
  const icons = [Sun, Cloud, CloudRain, Leaf];
  useEffect(() => {
    if (!playing || !canAnimate) return;
    const interval = window.setInterval(() => setStage(s => (s + 1) % 4), 5000);
    return () => clearInterval(interval);
  }, [playing, canAnimate]);
  return <section className="climate-experience" aria-label="Ciclo da Caatinga">
    <div className={`landscape stage-${stage}`}>
      <svg viewBox="0 0 900 330" role="img" aria-labelledby="landscape-title"><title id="landscape-title">Caatinga na fase {climateStages[stage].name}: paisagem ilustrativa</title>
        <circle className="sun" cx="720" cy="72" r="37"/>
        <g className="clouds" fill="#e4eaeb"><path d="M120 85c-35-38-85-8-70 25h190c12-37-30-65-63-44-15-23-48-16-57 19Z"/><path d="M540 65c-35-38-85-8-70 25h190c12-37-30-65-63-44-15-23-48-16-57 19Z"/></g>
        <path d="M0 240 120 160 235 242 390 167 550 236 700 158 900 235V330H0Z" fill="#c2b99d"/>
        <path className="ground" d="M0 265q225-60 450 0t450 0v65H0Z"/>
        <g className="plants" fill="none" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"><path d="M190 300V180m0 71h-33v-45m33 64h36v-43M665 304V193m0 51h-32v-36m32 62h32v-39"/></g>
        <g stroke="#493e2d" strokeWidth="8" fill="none"><path d="M417 294v-90m0 43-35-29m35 16 36-37m-37 30-11-43"/></g>
        <g className="leaves" fill="#648c41"><ellipse cx="380" cy="210" rx="25" ry="15"/><ellipse cx="455" cy="191" rx="25" ry="16"/><ellipse cx="405" cy="181" rx="21" ry="18"/><ellipse cx="430" cy="220" rx="20" ry="14"/></g>
        <g className="raindrops" stroke="#3e7291" strokeWidth="5" strokeLinecap="round">{Array.from({ length: 15 }, (_, i) => <path key={i} d={`M${75 + i * 53} ${120 + (i % 3) * 19}l-10 23`}/>)}</g>
      </svg>
      <span className="landscape-label">{stage + 1}/4 · {climateStages[stage].name}</span>
    </div>
    <div className="phase-tabs" role="group" aria-label="Escolher fase da Caatinga">{climateStages.map((s, i) => { const Icon = icons[i]; return <button key={s.name} aria-pressed={stage === i} onClick={() => { setStage(i); setPlaying(false); }}><Icon size={23} aria-hidden="true"/>{s.name}</button>; })}</div>
    <p className="phase-description" aria-live="polite">{climateStages[stage].description}</p>
    <div className="experience-controls"><button className="button secondary" aria-label="Fase anterior" disabled={stage === 0} onClick={() => { setStage(s => s - 1); setPlaying(false); }}><ArrowLeft aria-hidden="true"/></button><button className="button secondary" disabled={!canAnimate} onClick={() => setPlaying(p => !p)}>{playing && canAnimate ? <Pause aria-hidden="true"/> : <Play aria-hidden="true"/>}{playing && canAnimate ? 'Pausar' : 'Reproduzir ciclo'}</button><button className="button secondary" aria-label="Próxima fase" disabled={stage === 3} onClick={() => { setStage(s => s + 1); setPlaying(false); }}><ArrowRight aria-hidden="true"/></button></div>
    {!canAnimate && <p className="small-note">Movimento reduzido ativo. Escolha as fases pelos botões.</p>}
  </section>;
}
export function TimelineExperience() {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const event = timeline[active];
  function select(index: number) { setActive(index); const item = rail.current?.children[index] as HTMLElement | undefined; item?.scrollIntoView?.({ behavior: 'instant', block: 'nearest', inline: 'nearest' }); }
  return <section className="timeline-experience" aria-label="Marcos de 1896 a 2014">
    <div className="timeline-rail" ref={rail} role="group" aria-label="Selecionar marco histórico">{timeline.map((e, i) => <button key={e.year} aria-pressed={active === i} onClick={() => select(i)}><span className="timeline-dot"/><strong>{e.year}</strong><span>{e.title}</span></button>)}</div>
    <article className="timeline-event" aria-live="polite"><span className="eyebrow">{event.year}</span><h2>{event.title}</h2><p>{event.description}</p><p className="small-note">{event.relation}</p><Sources ids={event.sources}/></article>
    <div className="experience-controls"><button className="button secondary" disabled={active === 0} onClick={() => select(active - 1)}><ArrowLeft aria-hidden="true"/>Marco anterior</button><span>{active + 1} de {timeline.length}</span><button className="button secondary" disabled={active === timeline.length - 1} onClick={() => select(active + 1)}>Próximo marco<ArrowRight aria-hidden="true"/></button></div>
  </section>;
}