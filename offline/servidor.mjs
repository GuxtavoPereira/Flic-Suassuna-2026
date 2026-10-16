import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
const folder = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon' };
export function createMuseumServer(root = path.join(folder, 'museu')) {
  const resolvedRoot = path.resolve(root);
  return http.createServer(async (req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-cache');
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    let pathname;
    try { pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname); } catch {res.writeHead(400);res.end();return;}
    if (pathname==='/__flic_health') {res.setHeader('Content-Type','application/json');res.end(JSON.stringify({app:'flic2026-offline',version:2}));return;}
    let target=path.resolve(resolvedRoot,'.'+pathname);
    if (!target.startsWith(resolvedRoot+path.sep) && target!==resolvedRoot) {res.writeHead(403);res.end();return;}
    try {
      let info=await stat(target).catch(()=>null);
      if (!info?.isFile()) {
        if (path.extname(pathname)) {res.writeHead(404);res.end('Arquivo indisponivel');return;}
        target=path.join(resolvedRoot,'index.html');info=await stat(target);
      }
      res.setHeader('Content-Type',mime[path.extname(target)]??'application/octet-stream');res.setHeader('Content-Length',info.size);res.writeHead(200);
      if(req.method==='HEAD'){res.end();return;}createReadStream(target).on('error',()=>res.destroy()).pipe(res);
    } catch {res.writeHead(500);res.end('O pacote do museu esta incompleto. Extraia todos os arquivos novamente.');}
  });
}
function openBrowser() { if(process.platform==='win32' && process.argv.includes('--abrir')) execFile('cmd.exe',['/d','/c','start "" "http://127.0.0.1:4173/"'],()=>{}); }
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!existsSync(path.join(folder,'museu','index.html'))) { console.error('Extraia todo o ZIP antes de iniciar. A pasta museu esta ausente.');process.exit(1); }
  const server=createMuseumServer();
  server.on('error',async error=>{
    if(error.code==='EADDRINUSE') {
      try { const r=await fetch('http://127.0.0.1:4173/__flic_health');const data=await r.json();if(data.app==='flic2026-offline'&&data.version===2){console.log('O museu ja esta aberto.');openBrowser();return;} } catch { /* Another app owns this port. */ }
      console.error('A porta 4173 esta ocupada. Feche a outra copia do museu ou solicite ajuda ao responsavel.');
    } else console.error('Nao foi possivel iniciar o museu:',error.message);
    process.exitCode=1;
  });
  server.listen(4173,'127.0.0.1',()=>{
    console.log('FLIC 2026 — Museu local totalmente offline');console.log('Abra http://127.0.0.1:4173/');console.log('Mantenha esta janela aberta. Para encerrar, feche-a ou pressione Ctrl+C.');openBrowser();
  });
}
