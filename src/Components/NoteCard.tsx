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
    <div className="rounded-lg p-6 border border-gray-600 bg-gray-800 flex flex-col gap-4 break-words shadow-md transition-transform duration-300 hover:scale-105">
      <div className="flex gap-4 items-center overflow-hidden">
        <img
          src={user.image}
          alt="note"
          className="rounded-full w-16 h-16 bg-gray-100"
        />
        <div>
          <a
            href={`https://nostr.guru/p/${user.pubkey}`}
            className="text-lg font-semibold text-white overflow-hidden text-ellipsis"
            target="_blank"
            rel="noreferrer"
          >
            {user.name}
          </a>
          <p className="text-sm text-gray-400">
            {new Date(created_at * 1000).toISOString().split("T")[0]}
          </p>
        </div>
      </div>
      <p className="text-base">{content}</p>
      <ul className="flex flex-wrap gap-2">
        {hashtags
          .filter((t) => hashtags.indexOf(t) === hashtags.lastIndexOf(t))
          .map((hashtag) => (
            <li
              key={hashtag}
              className="bg-gray-700 text-sm text-gray-300 font-medium rounded-full px-4 py-1"
            >
              #{hashtag}
            </li>
          ))}
      </ul>
    </div>
  );
  
}
