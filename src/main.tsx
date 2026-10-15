import { Component, StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-600-italic.css';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import './styles/main.css';
import { SessionProvider } from './app-state';
import App from './App';
class ErrorBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className="not-found page-width"><h1>Vamos retomar a visita.</h1><p>Não foi possível abrir o conteúdo. Recarregue o museu. Se o acesso offline ainda não foi preparado, conecte o dispositivo à internet.</p><button className="button primary" onClick={() => { window.location.href = '/'; }}>Reabrir o museu</button></main> : this.props.children; }
}
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><BrowserRouter><SessionProvider><App/></SessionProvider></BrowserRouter></ErrorBoundary></StrictMode>);