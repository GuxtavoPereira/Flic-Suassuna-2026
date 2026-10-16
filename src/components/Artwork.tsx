import { useState } from 'react';
import { ImageOff } from 'lucide-react';
export function Artwork({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className={`artwork-fallback ${className}`} role="img" aria-label={alt}><ImageOff aria-hidden="true"/><span>Imagem indisponível. Você pode continuar a explorar o tema.</span></div> : <img className={className} src={src} alt={alt} onError={() => setFailed(true)} decoding="async" draggable="false"/>;
}