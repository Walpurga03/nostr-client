import { EventTemplate, Event } from "nostr-tools";

// Globale Deklarationen für das Fensterobjekt
declare global {
  // Erweitere das Fensterobjekt um die nostr-Eigenschaft mit Typ Nostr
  interface Window {
    nostr: Nostr;
  }
}

// Definiere den Typ Nostr
type Nostr = {
  // Funktion, um den öffentlichen Schlüssel asynchron abzurufen
  getPublicKey(): Promise<string>;
  // Funktion, um ein Ereignis asynchron zu signieren
  signEvent(event: EventTemplate): Promise<Event>;
};
