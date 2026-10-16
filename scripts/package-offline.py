"""Package a tested dist and the official, checksum-verified Windows runtime.
Usage: python scripts/package-offline.py /absolute/runtime-directory /absolute/output.zip
Runtime directory must contain node.exe and LICENSE.txt. No installation or download occurs here.
"""
from pathlib import Path
import hashlib, json, shutil, subprocess, sys, tempfile, zipfile
root=Path(__file__).resolve().parents[1]
runtime=Path(sys.argv[1]).resolve();output=Path(sys.argv[2]).resolve()
expected='9c9245166b4a8e182e0b797da9c20136117ff24368eaff1fec8343a123c8db0e'
actual=hashlib.sha256((runtime/'node.exe').read_bytes()).hexdigest()
if actual!=expected:raise SystemExit('Runtime checksum mismatch: do not package.')
if not(root/'dist/index.html').exists():raise SystemExit('Run and validate the production build before packaging.')
with tempfile.TemporaryDirectory(prefix='flic-package-') as tmp:
 d=Path(tmp)/'FLIC2026-Offline';d.mkdir()
 shutil.copytree(root/'dist',d/'museu');(d/'runtime').mkdir()
 for name in ['node.exe','LICENSE.txt']:shutil.copy2(runtime/name,d/'runtime'/name)
 for name in ['INICIAR-MUSEU.cmd','LEIA-ME.txt','servidor.mjs']:shutil.copy2(root/'offline'/name,d/name)
 for name in ['FONTES-IMAGENS.md','CHECKLIST-IMPLEMENTACAO.md','LOTES-IMAGENS.md']:shutil.copy2(root/name,d/name)
 (d/'VERSAO.json').write_text(json.dumps({'app':'FLIC2026','contentVersion':2,'runtime':'Node.js 22.23.3 Windows x64','runtimeSource':'https://nodejs.org/dist/v22.23.3/win-x64/node.exe','runtimeSha256':actual,'visualBatches':[1,2],'artworkManifests':['museu/images/fornecidas/lote-1/manifest.json','museu/images/fornecidas/lote-2/manifest.json']},indent=2))
 hashes={str(p.relative_to(d)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(d.rglob('*')) if p.is_file()}
 (d/'CHECKSUMS.json').write_text(json.dumps(hashes,indent=2))
 output.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted(d.rglob('*')):
   if p.is_file():z.write(p,p.relative_to(d.parent))
print(json.dumps({'file':str(output),'sizeBytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest()}))
