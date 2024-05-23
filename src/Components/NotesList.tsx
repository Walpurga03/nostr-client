import NoteCard from "./NoteCard";
import { Event } from "nostr-tools";
import { Metadata } from "../App";
interface Props {
  notes: Event[];
  metadata: Record<string, Metadata>;
}

export default function NotesList({ notes, metadata }: Props) {
  return (
    <div className="flex flex-col gap-16">
      {notes.map((note) => (
        <NoteCard
          created_at={note.created_at}
          user={{
            name: metadata[note.pubkey]?.name ?? note.pubkey,
            image: metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/5.x/identicon/svg?seed=${note.pubkey}`,
            pubkey: note.pubkey,
          }

          }
          key={note.id}
          content={note.content} />
      ))}
    </div>
  );
}