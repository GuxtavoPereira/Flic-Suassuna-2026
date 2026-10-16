// Test the same static server shipped with the Windows package.
import { createMuseumServer } from './servidor.mjs';
import path from 'node:path';
createMuseumServer(path.resolve('dist')).listen(4173,'127.0.0.1',()=>console.log('Museu local de teste: http://127.0.0.1:4173'));
