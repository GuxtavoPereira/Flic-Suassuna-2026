import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp,writeFile,mkdir,rm } from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
import { createMuseumServer } from './servidor.mjs';
test('servidor local: página inicial, rotas internas, MIME, arquivos ausentes e método',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'flic-server-'));await mkdir(path.join(root,'assets'));await writeFile(path.join(root,'index.html'),'<h1>FLIC</h1>');await writeFile(path.join(root,'assets','app.js'),'const ready=true;');
 const server=createMuseumServer(root);server.listen(0,'127.0.0.1');await once(server,'listening');const origin=`http://127.0.0.1:${server.address().port}`;
 try {for(const route of ['/','/tema/culinaria','/ranking']){const res=await fetch(origin+route);assert.equal(res.status,200);assert.equal(await res.text(),'<h1>FLIC</h1>');}
 const js=await fetch(origin+'/assets/app.js');assert.match(js.headers.get('content-type'),/javascript/);assert.equal((await fetch(origin+'/missing.js')).status,404);assert.equal((await fetch(origin,{method:'POST'})).status,405);assert.equal((await fetch(origin+'/__flic_health')).status,200);assert.equal((await fetch(origin+'/%E0%A4%A')).status,400);
 } finally {server.closeAllConnections();server.close();await rm(root,{recursive:true,force:true});}
});
