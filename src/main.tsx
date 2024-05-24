import React from 'react'; // Importiere React, um JSX zu verwenden
import ReactDOM from 'react-dom/client'; // Importiere ReactDOM für das Rendern der Anwendung
import App from './App'; // Importiere die Hauptkomponente der Anwendung
import './index.css'; // Importiere die CSS-Datei für globale Stile
import ErrorBoundary from './Components/ErrorBoundary'; // Importiere die ErrorBoundary-Komponente

// Verwende ReactDOM.createRoot, um eine Wurzel zum Rendern der Anwendung zu erstellen
ReactDOM.createRoot(document.getElementById('root')!).render(
  // Verwende React.StrictMode, um potenzielle Probleme in der Anwendung während der Entwicklung zu identifizieren
  <React.StrictMode>
    {/* Verwende die ErrorBoundary-Komponente, um Fehler in der Anwendung abzufangen und zu behandeln */}
    <ErrorBoundary>
      {/* Rendere die Hauptkomponente der Anwendung innerhalb der ErrorBoundary */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
