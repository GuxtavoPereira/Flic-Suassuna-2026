import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
// Only deterministic screenshots from successful CI runs; no reports or runtime data.
const destination='dist/review';
if(existsSync('test-results')){
  mkdirSync(destination,{recursive:true});
  for(const name of readdirSync('test-results'))if(/^(home-|module-|maps-|cistern-|video-qr-|dynamic-quiz-|visit-end-|ranking-|subregions-|selected-state-|site-qr-).*\.png$/.test(name))copyFileSync(`test-results/${name}`,`${destination}/${name}`);
}
