import { Component, ErrorInfo, ReactNode } from 'react';

// Definiere die Props-Schnittstelle für die ErrorBoundary-Komponente
interface ErrorBoundaryProps {
  children: ReactNode; // Die ErrorBoundary-Komponente nimmt React-Knoten als Kinder an
}

// Definiere die State-Schnittstelle für die ErrorBoundary-Komponente
interface ErrorBoundaryState {
  hasError: boolean; // State-Variable, die angibt, ob ein Fehler aufgetreten ist
}

// Definiere die ErrorBoundary-Klasse, die von React.Component erbt
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialisiere den State
  state: ErrorBoundaryState = { hasError: false };

  // Diese Methode wird aufgerufen, wenn ein Fehler auftritt, und aktualisiert den State
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }; // Setzt hasError auf true
  }

  // Diese Methode wird aufgerufen, wenn ein Fehler von einem der Kind-Komponenten abgefangen wird
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo); // Loggt den Fehler und zusätzliche Informationen in die Konsole
  }

  // Render-Methode, die das UI der Komponente bestimmt
  render() {
    // Wenn ein Fehler aufgetreten ist, zeige eine Fehlermeldung an
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    // Andernfalls rendere die Kind-Komponenten
    return this.props.children;
  }
}

// Exportiere die ErrorBoundary-Komponente als Standard-Export
export default ErrorBoundary;
