import { SimplePool, Event } from "nostr-tools"; // Importiere benötigte Module aus nostr-tools
import { useEffect, useRef, useState } from "react"; // Importiere React Hooks
import { useDebounce } from "use-debounce"; // Importiere use-debounce Hook
import "./App.css"; // Importiere CSS Datei
import CreateNote from "./Components/CreateNote"; // Importiere CreateNote Komponente
import HashtagsFilter from "./Components/HashtagsFilter"; // Importiere HashtagsFilter Komponente
import NotesList from "./Components/NotesList"; // Importiere NotesList Komponente
import { insertEventIntoDescendingList } from "./utils/helperFunctions"; // Importiere Hilfsfunktion

export const RELAYS = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
]; // Liste der Relays

export interface Metadata {
  name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
} // Schnittstelle für Metadaten

function App() {
  const [pool, setPool] = useState<SimplePool | null>(null); // Zustand für den SimplePool
  const [eventsImmediate, setEventsImmediate] = useState<Event[]>([]); // Zustand für sofortige Events
  const [events] = useDebounce(eventsImmediate, 1500); // Zustand für debouncete Events
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({}); // Zustand für Metadaten
  const metadataFetched = useRef<Record<string, boolean>>({}); // Ref für bereits abgefragte Metadaten
  const [hashtags, setHashtags] = useState<string[]>([]); // Zustand für Hashtags

  // Initialisiere den Relay-Pool
  useEffect(() => {
    const _pool = new SimplePool();
    setPool(_pool);

    return () => {
      _pool.close(RELAYS); // Schließe den Pool beim Unmount
    };
  }, []);

  // Abonniere Events basierend auf Hashtags
  useEffect(() => {
    if (!pool) return;

    setEventsImmediate([]); // Leere Events
    const sub = pool.sub(RELAYS, [
      {
        kinds: [1], // Art der Events
        limit: 100, // Begrenzung auf 100 Events
        "#t": hashtags, // Filtere nach Hashtags
      },
    ]);

    // Event-Handler für neue Events
    sub.on("event", (event: Event) => {
      setEventsImmediate((events) => insertEventIntoDescendingList(events, event)); // Füge Event in Liste ein
    });

    return () => {
      sub.unsub(); // Beende das Abonnement beim Unmount
    };
  }, [hashtags, pool]);

  // Lade Metadaten für die Events
  useEffect(() => {
    if (!pool) return;

    const pubkeysToFetch = events
      .filter((event: { pubkey: string }) => !metadataFetched.current[event.pubkey]) // Filtere bereits abgefragte pubkeys
      .map((event: { pubkey: string }) => event.pubkey); // Extrahiere pubkeys

    pubkeysToFetch.forEach((pubkey: string) => {
      metadataFetched.current[pubkey] = true; // Markiere pubkeys als abgefragt
    });

    const sub = pool.sub(RELAYS, [
      {
        kinds: [0], // Art der Events
        authors: pubkeysToFetch, // Autorenfilter
      },
    ]);

    // Event-Handler für Metadaten-Events
    sub.on("event", (event: Event) => {
      const metadata = JSON.parse(event.content) as Metadata;

      setMetadata((cur) => ({
        ...cur,
        [event.pubkey]: metadata, // Speichere Metadaten im Zustand
      }));
    });

    sub.on("eose", () => {
      sub.unsub(); // Beende das Abonnement nach Empfang aller Events
    });

    return () => {};
  }, [events, pool]);

  // Render nichts, wenn kein Pool vorhanden ist
  if (!pool) return null;

  return (
    <div className="app">
      <div className="flex flex-col gap-16">
        <h1 className="text-h1">Nostr Feed</h1>
        <CreateNote pool={pool} hashtags={hashtags} /> {/* Komponente zum Erstellen von Notizen */}
        <HashtagsFilter hashtags={hashtags} onChange={setHashtags} /> {/* Komponente zum Filtern von Hashtags */}
        <NotesList metadata={metadata} notes={events} /> {/* Komponente zum Anzeigen der Notizen */}
      </div>
    </div>
  );
}

export default App; // Exportiere die App-Komponente
