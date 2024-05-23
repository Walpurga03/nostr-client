import { SimplePool, Event } from "nostr-tools";
import { useState, useEffect } from "react";
import "./App.css";
import NotesList from "./Components/NotesList";

export const RELAYS = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];

export interface Metadata {
  name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
}


function App() {

  const [pool, setPool] = useState<SimplePool | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({})

  // relais-pool einrichten   
  useEffect(() => {
    const _pool = new SimplePool();
    setPool(_pool);

    return () => {
      _pool.close(RELAYS)
    }
  }, []);

  // events abfragen/abonnieren
  useEffect(() => {
    if (!pool) return; // Überprüfe, ob der Pool existiert

    // Erstelle eine Subscription zu den Relais und abonniere Events
    const sub = pool.sub(RELAYS, [
      {
        kinds: [1], // Filtere Ereignisse nach Kinds
        limit: 100, // Begrenze die Anzahl der Ereignisse
        "#t": ["nostr"]
      }
    ]);

    // Füge einen Event-Handler hinzu, um auf eingehende Events zu reagieren
    sub.on('event', (event: Event) => {
      setEvents((events) => [...events, event]); // Füge das empfangene Ereignis zum Zustand 'events' hinzu
    });

    // Rückgabewert ist eine Aufräumfunktion, die beim Unmount der Komponente ausgeführt wird
    return () => {
      sub.unsub(); // Beispiel: Subscription beenden
    };
  }, [pool]); // Der Effekt wird ausgeführt, wenn sich der `pool` ändert


  // render der events
  useEffect(() => {
    if (!pool) return; // Überprüfe, ob der Pool existiert

    const pubkeysToFetch = events.map((event) => event.pubkey);

    // Erstelle eine Subscription zu den Relais und abonniere Events
    const sub = pool.sub(RELAYS, [
      {
        kinds: [0], // Filtere Ereignisse nach Kinds
        authors: pubkeysToFetch
      }
    ]);

    // Füge einen Event-Handler hinzu, um auf eingehende Events zu reagieren
    sub.on('event', (event: Event) => {
      const metadata = JSON.parse(event.content) as Metadata;

      setMetadata((cur) => ({
        ...cur,
        [event.pubkey]: metadata,
      }));
    });

    sub.on('eose', () => {
      sub.unsub();
    })

    // Rückgabewert ist eine Aufräumfunktion, die beim Unmount der Komponente ausgeführt wird
    return () => { };
  }, [events, pool])


  return (
    <div className="app">
      <div className="flex flex-col gap-16">
        <h1 className="text-h1">Nostr Feed</h1>
        <NotesList metadata={metadata} notes={events} />
      </div>
    </div>
  );
}

export default App;
