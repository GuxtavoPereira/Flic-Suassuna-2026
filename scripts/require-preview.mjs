import process from 'node:process';
import { log, error } from 'node:console';
// This review branch is explicitly preview-only. A mistaken production target must fail before publication.
if(process.env.VERCEL_ENV !== 'preview'){
  error(`Publicação bloqueada: esta revisão exige VERCEL_ENV=preview, recebido ${process.env.VERCEL_ENV ?? 'ausente'}.`);
  process.exitCode=1;
}else log('Destino verificado: Preview; publicação em produção bloqueada nesta branch.');
