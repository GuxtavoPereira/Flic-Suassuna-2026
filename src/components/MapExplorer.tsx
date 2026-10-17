import { useId, useState, type KeyboardEvent } from 'react';
import mapMetadata from '../content/maps/metadata.json';
import states from '../content/maps/states.json';
import caatinga from '../content/maps/caatinga.json';
import semiarido from '../content/maps/semiarido.json';
import localities from '../content/maps/localities.json';
import subregions from '../content/maps/subregions.json';
import { Sources } from './Sources';
import { Check } from 'lucide-react';
type Geometry = { type: string; coordinates: unknown };
function path(geometry: Geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return (polygons as number[][][][]).map(polygon => polygon.map(ring => ring.map(([lon, lat], i) => `${i ? 'L' : 'M'}${lon},${-lat}`).join(' ') + 'Z').join(' ')).join(' ');
}
const statePaths = states.features.map(f => ({ ...f, d: path(f.geometry) }));
const northeast = statePaths.filter(f => f.properties.isNordeste);
const caatingaPath = caatinga.features.map(f => path(f.geometry)).join(' ');
const semiaridoPath = semiarido.features.map(f => path(f.geometry)).join(' ');
const regions = [
  { id:'meio-norte',name:'Meio-Norte',climate:'Faixa de transição, com diferenças entre áreas mais úmidas e mais secas.',vegetation:'Mata dos Cocais e contatos com outros ambientes.',economy:'Extrativismo, agricultura, comércio e serviços, conforme o lugar.',landscape:'Cocais, rios e áreas de transição.',place:'Teresina, Piauí' },
  { id:'sertao',name:'Sertão',climate:'Grande presença do clima semiárido, com chuvas irregulares; há variações locais.',vegetation:'Caatinga em muitas áreas, com adaptações à estação seca.',economy:'Agricultura, pecuária, comércio, artesanato e serviços.',landscape:'Depressões, serras, cidades e rios de regimes diferentes.',place:'Salgueiro, Pernambuco' },
  { id:'agreste',name:'Agreste',climate:'Transição entre áreas litorâneas mais úmidas e o interior mais seco.',vegetation:'Mosaicos e áreas de transição; altitude também faz diferença.',economy:'Agricultura diversificada, comércio, indústria e serviços em diferentes cidades.',landscape:'Serras e planaltos com condições locais variadas.',place:'Caruaru, Pernambuco' },
  { id:'zona-mata',name:'Zona da Mata',climate:'Em geral, maior umidade na faixa oriental, com diferenças ao longo da costa.',vegetation:'Mata Atlântica e ambientes costeiros, hoje bastante transformados.',economy:'Agricultura, indústria, comércio, serviços e atividades urbanas.',landscape:'Tabuleiros, rios, cidades e áreas próximas ao litoral.',place:'Recife, Pernambuco' },
];
function activate(event: KeyboardEvent<SVGElement>, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); }
}
export function MapExplorer({ initialMode = 'brasil' }: { initialMode?: 'brasil' | 'subregioes' }) {
  const titleId = useId();
  const descId = useId();
  const [mode, setMode] = useState(initialMode);
  const [layer, setLayer] = useState<'nordeste' | 'caatinga' | 'semiarido'>('nordeste');
  const [regionIndex, setRegionIndex] = useState(1);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [zoomNortheast, setZoomNortheast] = useState(false);
  const region = regions[regionIndex];
  const selectedState = northeast.find(f => String(f.properties.id) === selectedStateId);
  const selectState = (id: string) => { setSelectedStateId(id); setZoomNortheast(true); };
  return <section className="map-explorer" aria-labelledby={titleId}>
    <h2 id={titleId}>Territórios que se encontram</h2>
    <div className="map-tabs" aria-label="Escolha o mapa"><button aria-pressed={mode === 'brasil'} onClick={() => setMode('brasil')}>Brasil e Nordeste</button><button aria-pressed={mode === 'subregioes'} onClick={() => setMode('subregioes')}>Quatro sub-regiões</button></div>
    <div className="map-layout"><div className="map-visual">
      {mode === 'brasil' ? <>
        <div className="map-tabs" aria-label="Camada cartográfica"><button aria-pressed={layer === 'nordeste'} onClick={() => setLayer('nordeste')}>Região Nordeste</button><button aria-pressed={layer === 'caatinga'} onClick={() => setLayer('caatinga')}>Bioma Caatinga · 2019</button><button aria-pressed={layer === 'semiarido'} onClick={() => setLayer('semiarido')}>Semiárido · recorte 2022</button></div>
        <button className="map-zoom-button" onClick={() => setZoomNortheast(v => !v)}>{zoomNortheast ? 'Ver Brasil inteiro' : 'Ampliar Nordeste para tocar'}</button>
        <svg className="territory-map" viewBox={zoomNortheast ? '-50 -1 17 19' : '-76 -7 49 44'} role="group" aria-labelledby={`${titleId} ${descId}`}>
          <desc id={descId}>Nordeste em terracota. Toque em um dos nove estados ou use os botões. O estado selecionado fica amarelo, com contorno escuro. As camadas de Caatinga e semiárido têm contornos próprios.</desc>
          {statePaths.filter(f => !zoomNortheast || f.properties.isNordeste).map(f => <path key={f.properties.id} d={f.d} data-state={f.properties.sigla} data-selected={String(f.properties.id) === selectedStateId} fill={f.properties.isNordeste ? '#B96C48' : '#e6dfce'} stroke="#544c3b" strokeWidth="0.12" role={f.properties.isNordeste ? 'button' : undefined} tabIndex={f.properties.isNordeste ? 0 : undefined} aria-label={f.properties.isNordeste ? `Selecionar estado ${f.properties.name}` : undefined} aria-pressed={f.properties.isNordeste ? String(f.properties.id) === selectedStateId : undefined} onClick={f.properties.isNordeste ? () => selectState(String(f.properties.id)) : undefined} onKeyDown={f.properties.isNordeste ? e => activate(e, () => selectState(String(f.properties.id))) : undefined}><title>{f.properties.name} ({f.properties.sigla})</title></path>)}
          {layer === 'caatinga' && <path d={caatingaPath} fill="#346e49" fillOpacity="0.75" stroke="#153c28" strokeWidth="0.12" pointerEvents="none"><title>Bioma Caatinga · IBGE 2019</title></path>}
          {layer === 'semiarido' && <path d={semiaridoPath} fill="#365e73" pointerEvents="none"><title>Semiárido · conjunto de 1.477 municípios no recorte IBGE 2022</title></path>}
          {selectedState && <g className="state-selection" pointerEvents="none" aria-hidden="true"><path d={selectedState.d} fill="none" stroke="white" strokeWidth="9" vectorEffect="non-scaling-stroke"/><path d={selectedState.d} fill="#ffe065" fillOpacity="0.82" stroke="#172d40" strokeWidth="4" vectorEffect="non-scaling-stroke"/></g>}
        </svg>
        <div className="map-selection-status" role="status">{selectedState ? <><Check size={22} aria-hidden="true"/> Estado selecionado: <strong>{selectedState.properties.name} · {selectedState.properties.sigla}</strong></> : 'Toque no mapa ou escolha um estado nos botões.'}</div>
        <div className="map-legend"><span><i style={{background:'#B96C48'}}/>Região Nordeste</span><span><i style={{background:'#346e49'}}/>Caatinga · 2019</span><span><i style={{background:'#365e73'}}/>Semiárido · recorte 2022</span><span><i style={{background:'#ffe065'}}/>Estado selecionado</span></div>
        <p className="small-note">Estados: IBGE. Camadas de bioma e clima representam áreas diferentes; o recorte do semiárido exibido é de 2022.</p>
      </> : <>
        <p className="map-instruction">Toque em uma área colorida para descobrir sua sub-região.</p>
        <svg className="territory-map subregion-map" viewBox={subregions.viewBox} role="group" aria-labelledby={`${titleId} ${descId}`}>
          <desc id={descId}>Quatro áreas coloridas: 1 Meio-Norte em laranja, 2 Sertão em amarelo, 3 Agreste em lilás, 4 Zona da Mata em verde. A área selecionada tem contorno forte. Esquema didático, com faixas aproximadas.</desc>
          {subregions.regions.map((r, i) => <path key={r.id} d={r.d} fill={r.fill} stroke="#554c3c" strokeWidth="1" vectorEffect="non-scaling-stroke" role="button" tabIndex={0} aria-label={`Selecionar ${regions[i].name}: ${localities[i].locality}`} aria-pressed={regionIndex === i} data-subregion={r.id} onClick={() => setRegionIndex(i)} onKeyDown={e => activate(e, () => setRegionIndex(i))}/>)}
          <g pointerEvents="none" aria-hidden="true">{subregions.stateBorders.map((d, i) => <path key={i} d={d} fill="none" stroke="#554c3c" strokeWidth="0.8" vectorEffect="non-scaling-stroke"/>)}</g>
          <g className="subregion-selection" pointerEvents="none" aria-hidden="true"><path d={subregions.regions[regionIndex].d} fill="none" stroke="white" strokeWidth="9" vectorEffect="non-scaling-stroke"/><path d={subregions.regions[regionIndex].d} fill="none" stroke="#172d40" strokeWidth="4" vectorEffect="non-scaling-stroke"/></g>
          <g pointerEvents="none" aria-hidden="true">{subregions.regions.map((r,i) => <g key={r.id}><circle cx={r.x} cy={r.y} r="65" fill="white" stroke="#172d40" strokeWidth="2" vectorEffect="non-scaling-stroke"/><text x={r.x} y={r.y + 24} textAnchor="middle" fontSize="76" fontWeight="700" fill="#172d40">{i + 1}</text></g>)}</g>
        </svg>
        <p className="subregion-attribution">Mapa didático adaptado de <a href={subregions.source.url} target="_blank" rel="noreferrer">Raphael Lorenzeto de Abreu (2006) ↗</a> · <a href={subregions.source.licenseUrl} target="_blank" rel="noreferrer">CC BY 2.5</a>. Cores, coordenadas SVG e interação adaptadas. As faixas são aproximadas.</p>
      </>}
    </div><div className="map-copy">
      {mode === 'brasil' ? <><h3>{selectedState?.properties.name ?? 'Nordeste: nove estados'}</h3><p>Toque diretamente em um estado ou use os botões. A seleção aparece em amarelo no mapa ampliado, com contorno escuro.</p><div className="map-state-list">{northeast.map(f => <button key={f.properties.id} aria-pressed={String(f.properties.id) === selectedStateId} onClick={() => selectState(String(f.properties.id))}>{f.properties.name}</button>)}</div><dl className="concept-list"><dt>Nordeste</dt><dd>Uma das cinco Grandes Regiões do Brasil; reúne nove estados.</dd><dt>Sertão</dt><dd>Termo histórico e geográfico; também nome de uma sub-região didática do Nordeste. Não possui um único limite válido para todo uso.</dd><dt>Semiárido</dt><dd>Delimitação oficial baseada em critérios climáticos e lista de municípios. Não é sinônimo de Nordeste nem de Caatinga.</dd><dt>Caatinga</dt><dd>Bioma brasileiro, definido por características ambientais. Ative a camada verde para comparar.</dd></dl></> : <><p>Quatro sub-regiões, quatro cores. Escolha uma área no mapa ou um botão para conhecer suas características.</p><div className="map-tabs region-buttons" aria-label="Escolha uma sub-região">{regions.map((r,i) => <button key={r.id} aria-pressed={regionIndex === i} aria-controls={`${titleId}-panel`} onClick={() => setRegionIndex(i)}><i className="region-color" style={{background:subregions.regions[i].fill}} aria-hidden="true"/><span>{i + 1}. {r.name}</span>{regionIndex === i && <Check size={23} aria-hidden="true"/>}</button>)}</div><article id={`${titleId}-panel`} className="region-panel" aria-live="polite"><h3>{region.name}</h3><dl><dt>Clima</dt><dd>{region.climate}</dd><dt>Vegetação</dt><dd>{region.vegetation}</dd><dt>Atividades econômicas</dt><dd>{region.economy}</dd><dt>Paisagens</dt><dd>{region.landscape}</dd><dt>Exemplo de localidade</dt><dd>{region.place}. O exemplo não representa todos os municípios da sub-região.</dd></dl></article></>}
      <details className="sources"><summary>Critérios e limites desta leitura</summary><p>Estados, Caatinga e semiárido usam bases oficiais locais. O semiárido é o recorte de 2022. O mapa colorido das sub-regiões é uma adaptação didática vetorial de 2006, com licença CC BY 2.5; não é uma nova delimitação oficial, não possui georreferenciamento e não permite classificar municípios ou medir áreas. As faixas dependem da metodologia.</p></details>
      <details className="sources"><summary>Bases cartográficas e procedência</summary><p><a href={subregions.source.url} target="_blank" rel="noreferrer">Mapa de sub-regiões: autoria, arquivo original e licença ↗</a></p><p>{subregions.source.creator}, {subregions.source.date}. {subregions.source.license}. {subregions.source.modifications}</p><ul>{mapMetadata.layers.map(l => <li key={l.id}><a href={l.sourceUrl} target="_blank" rel="noreferrer">{l.sourceName} ↗</a><p>{l.dataDate}. {l.method}</p></li>)}</ul></details><Sources ids={['ibge-regioes','caatinga']}/>
    </div></div>
  </section>;
}
