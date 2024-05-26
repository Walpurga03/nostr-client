import React, { useState } from "react";

// Definiere die Props-Schnittstelle für die HashtagsFilter-Komponente
interface Props {
  hashtags: string[]; // Array der aktuellen Hashtags
  onChange: (hashtags: string[]) => void; // Callback-Funktion zum Aktualisieren der Hashtags
}

// Definiere die Funktionale Komponente HashtagsFilter
export default function HashtagsFilter({ hashtags, onChange }: Props) {
  // Zustand für das Eingabefeld
  const [input, setInput] = useState("");

  // Funktion zum Hinzufügen eines Hashtags
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange([...hashtags, input.toLowerCase()]); // Füge den neuen Hashtag hinzu
    setInput(""); // Setze das Eingabefeld zurück
  };

  // Funktion zum Entfernen eines Hashtags
  const removeHashtag = (hashtag: string) => {
    onChange(hashtags.filter((h) => h !== hashtag)); // Filtere den Hashtag aus der Liste
  };

  return (
    <div className="flex flex-col gap-12">
      <h3 className="text-h3 text-white">Filtering hashtags</h3>
      {/* Formular zum Hinzufügen eines Hashtags */}
      <form onSubmit={onSubmit} className="flex gap-16">
        <input
          type="text"
          className="grow p-16 rounded bg-gray-800"
          placeholder="Write a hashtag"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Aktualisiere den Input-Wert
        />
        <button
          className="bg-gray-500 px-16 py-4 rounded-8 font-bold hover:bg-gray-600 active:scale-90"
          type="submit"
        >
          + Add
        </button>
      </form>
      {/* Liste der Hashtags */}
      <ul className="flex flex-wrap gap-8">
        {hashtags.map((hashtag) => (
          <li
            className="bg-gray-300 text-body5 text-gray-900 font-medium rounded-24 px-12 py-4"
            key={hashtag}
          >
            {hashtag}{" "}
            {/* Button zum Entfernen des Hashtags */}
            <button className="ml-8" onClick={() => removeHashtag(hashtag)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
