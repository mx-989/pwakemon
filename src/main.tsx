/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './ui/App';
import './styles/global.css';

// Enregistrer le service worker
registerSW({ immediate: true });

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
