import process from 'node:process';
import { log, error } from 'node:console';
// Production publication authorized explicitly by the owner on 2026-10-16.
// Reject missing or unknown environments; never silently infer a destination.
if(!['preview','production'].includes(process.env.VERCEL_ENV)){
  error(`Publicação bloqueada: ambiente Vercel inválido (${process.env.VERCEL_ENV ?? 'ausente'}).`);
  process.exitCode=1;
}else log(`Destino verificado: ${process.env.VERCEL_ENV}.`);
