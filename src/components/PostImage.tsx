import type { SourceMetadata } from '../domain/content';
import { Artwork } from './Artwork';
export function PostImage({ image, alt, metadata }: { image: string; alt: string; metadata: SourceMetadata }) {
  return <figure className="post-image"><Artwork key={image} src={image} alt={alt}/><figcaption><p>{metadata.caption}</p><details className="image-credit"><summary>Crédito e fonte da imagem</summary><p>{metadata.credit}</p><p><a href={metadata.sourceUrl} target="_blank" rel="noreferrer">{metadata.sourceName} ↗</a></p><p>{metadata.licenseNote}</p>{metadata.licenseUrl && <p><a href={metadata.licenseUrl} target="_blank" rel="noreferrer">Condições da licença ↗</a></p>}{metadata.place && <p>Local: {metadata.place}</p>}{metadata.date && <p>Data informada pela fonte: {metadata.date}</p>}{metadata.usagePermission && <p>{metadata.usagePermission}</p>}</details></figcaption></figure>;
}
