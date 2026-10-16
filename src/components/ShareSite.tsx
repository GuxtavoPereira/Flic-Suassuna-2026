import { useId, useRef } from 'react';
import { QrCode } from 'lucide-react';
import site from '../content/site-links.json';
export function ShareSite() {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return <>
    <button className="icon-button share-site-trigger" aria-label="Ver site no celular" onClick={() => dialog.current?.showModal()}><QrCode size={25} aria-hidden="true"/><span>Ver no celular</span></button>
    <dialog className="settings-dialog share-site-dialog" ref={dialog} aria-labelledby={titleId}>
      <div className="dialog-top"><h2 id={titleId}>Leve o sertão com você</h2><button className="button secondary" onClick={() => dialog.current?.close()}>Fechar QR code</button></div>
      <p>Aponte a câmera do celular para o QR code e continue explorando o site.</p>
      <img src={site.qrImage} className="share-site-qr" alt="QR code para abrir O Sertão de Ariano Suassuna no celular" width="360" height="360"/>
      <p className="share-site-address">{site.publicUrl}</p>
      <p className="share-site-note">O celular precisa de internet para abrir o endereço público. A visita neste display continua disponível.</p>
    </dialog>
  </>;
}
