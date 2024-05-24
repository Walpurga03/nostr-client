import React from "react";

// Definiere die Props-Schnittstelle für die NoteCard-Komponente
interface Props {
  content: string; // Inhalt der Notiz
  user: {
    name: string; // Name des Benutzers
    image: string; // Bild des Benutzers
    pubkey: string; // Public Key des Benutzers
  };
  created_at: number; // Erstellungsdatum der Notiz
  hashtags: string[]; // Array der Hashtags der Notiz
}

// Definiere die Funktionale Komponente NoteCard
export default function NoteCard({
  content,
  user,
  created_at,
  hashtags,
}: Props) {
  return (
    <div className="rounded p-16 border border-gray-600 bg-gray-700 flex flex-col gap-16 break-words">
      {/* Benutzerinformationen */}
      <div className="flex gap-12 items-center overflow-hidden">
        <img
          src={user.image}
          alt="note"
          className="rounded-full w-40 aspect-square bg-gray-100"
        />
        <div>
          {/* Link zum Benutzerprofil */}
          <a
            href={`https://nostr.guru/p/${user.pubkey}`}
            className="text-body3 text-white overflow-hidden text-ellipsis"
            target="_blank"
            rel="noreferrer"
          >
            {user.name}
          </a>
          {/* Anzeige des Erstellungsdatums */}
          <p className="text-body5 text-gray-400">
            {new Date(created_at * 1000).toISOString().split("T")[0]}
          </p>
        </div>
      </div>
      {/* Inhalt der Notiz */}
      <p>{content}</p>
      {/* Liste der Hashtags */}
      <ul className="flex flex-wrap gap-12">
        {hashtags
          // Filtere doppelte Hashtags
          .filter((t) => hashtags.indexOf(t) === hashtags.lastIndexOf(t))
          .map((hashtag) => (
            <li
              key={hashtag}
              className="bg-gray-300 text-body5 text-gray-900 font-medium rounded-24 px-12 py-4"
            >
              #{hashtag}
            </li>
          ))}
      </ul>
    </div>
  );
}
