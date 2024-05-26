import { useState } from "react"; // Importiere useState Hook
import { EventTemplate, Event, getEventHash, SimplePool } from "nostr-tools"; // Importiere benötigte Module aus nostr-tools
import { RELAYS } from "../App"; // Importiere RELAYS aus der App

interface Props {
  pool: SimplePool; // Schnittstelle für die Prop pool vom Typ SimplePool
  hashtags: string[]; // Schnittstelle für die Prop hashtags als Array von Strings
}

export default function CreateNote({ pool, hashtags }: Props) {
  const [input, setInput] = useState(""); // Zustand für das Inputfeld

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Verhindere das Standardverhalten des Formulars

    if (!window.nostr) {
      alert("Nostr extension not found"); // Zeige eine Warnung, wenn die Nostr-Erweiterung nicht gefunden wird
      return;
    }

    // Erstelle das Basisevent-Template
    const _baseEvent: EventTemplate = {
      content: input,
      created_at: Math.round(Date.now() / 1000), // Aktuelle Zeit in Sekunden
      kind: 1,
      tags: hashtags.map((hashtag) => ["t", hashtag]), // Mappe Hashtags zu Tag-Array
    };

    try {
      const pubkey = await window.nostr.getPublicKey(); // Hole den öffentlichen Schlüssel des Benutzers
      const signedEvent = await window.nostr.signEvent(_baseEvent); // Signiere das Event mit dem privaten Schlüssel des Benutzers
      const event: Event = {
        ..._baseEvent,
        sig: signedEvent.sig, // Signatur des Events
        pubkey,
        id: getEventHash({ ..._baseEvent, pubkey }), // Berechne die ID des Events
      };

      const pubs = pool.publish(RELAYS, event); // Veröffentliche das Event an die Relays

      if (Array.isArray(pubs)) {
        // Warte auf alle Promises
        await Promise.all(pubs as Promise<void>[]);
      }

      // Leere das Eingabefeld, wenn alle Veröffentlichungen erfolgreich sind
      setInput("");

    } catch (error) {
      alert("User rejected operation or an error occurred"); // Zeige eine Warnung bei Fehlern
    }
  };

  return (
    <div>
      <h2 className="text-h3 text-white mb-12">What's In Your Mind??</h2>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="Write your note here..." // Platzhaltertext für das Textarea
          className="bg-gray-800 w-full p-12 rounded" // CSS-Klassen für das Styling
          value={input} // Wert des Textareas
          onChange={(e) => setInput(e.target.value)} // Ändere den Zustand bei Eingaben
          rows={6} // Anzahl der Zeilen des Textareas
        />
        <div className="flex justify-end">
          <button className="bg-violet-500 px-16 py-4 rounded-8 font-bold hover:bg-violet-600 active:scale-90">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
