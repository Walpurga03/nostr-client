import { Event, nip19 } from "nostr-tools";
import { Metadata } from "../App";
import NoteCard from "./NoteCard";

// Definiere die Props-Schnittstelle für die NotesList-Komponente
interface Props {
  notes: Event[]; // Array der Ereignisse
  metadata: Record<string, Metadata>; // Metadaten als Objekt
}

// Definiere die funktionale Komponente NotesList
export default function NotesList({ notes, metadata }: Props) {
  return (
    <div className="flex flex-col gap-16">
      {/* Durchlaufe jedes Ereignis und rendere eine NoteCard-Komponente */}
      {notes.map((note) => (
        <NoteCard
          created_at={note.created_at} // Erstellungsdatum des Ereignisses
          user={{
            name:
              metadata[note.pubkey]?.name ?? // Name des Benutzers aus den Metadaten oder dem Public Key
              `${nip19.npubEncode(note.pubkey).slice(0, 12)}...`, // Wenn kein Name vorhanden ist, zeige eine abgekürzte Version des Public Keys
            image:
              metadata[note.pubkey]?.picture ?? // Bild des Benutzers aus den Metadaten oder einem generierten Identicon
              `https://api.dicebear.com/5.x/identicon/svg?seed=${note.pubkey}`, // Wenn kein Bild vorhanden ist, generiere ein Identicon anhand des Public Keys
            pubkey: note.pubkey, // Public Key des Benutzers
          }}
          key={note.id} // Schlüssel zur eindeutigen Identifizierung der NoteCard
          content={note.content} // Inhalt der Notiz
          hashtags={note.tags.filter((t) => t[0] === "t").map((t) => t[1])} // Extrahiere Hashtags aus den Tags des Ereignisses
        />
      ))}
    </div>
  );
}
