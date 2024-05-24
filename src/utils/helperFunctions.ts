import { Event } from "nostr-tools";

/**
 * Fügt ein Ereignis in ein absteigend sortiertes Array ein.
 * Das Array wird basierend auf dem Erstellungsdatum des Ereignisses sortiert.
 * @param sortedArray Das sortierte Array, in das das Ereignis eingefügt werden soll.
 * @param event Das Ereignis, das eingefügt werden soll.
 * @returns Das aktualisierte sortierte Array mit dem eingefügten Ereignis.
 */
export function insertEventIntoDescendingList<T extends Event>(
    sortedArray: T[],
    event: T
): T[] {
    let start = 0; // Startindex des Bereichs, in dem das Ereignis möglicherweise eingefügt werden soll
    let end = sortedArray.length - 1; // Endindex des Bereichs, in dem das Ereignis möglicherweise eingefügt werden soll
    let midPoint; // Der Index in der Mitte des aktuellen Bereichs
    let position = start; // Die Position, an der das Ereignis eingefügt werden soll

    // Fall: Das Array ist leer, das Ereignis wird an Position 0 eingefügt
    if (end < 0) {
        position = 0;
    }
    // Fall: Das Ereignis hat das neueste Erstellungsdatum, wird am Ende eingefügt
    else if (event.created_at < sortedArray[end].created_at) {
        position = end + 1;
    }
    // Fall: Das Ereignis hat das älteste Erstellungsdatum, wird am Anfang eingefügt
    else if (event.created_at >= sortedArray[start].created_at) {
        position = start;
    }
    // Fall: Das Ereignis hat ein Erstellungsdatum zwischen den vorhandenen Ereignissen
    else {
        // Binäre Suche, um die richtige Position für das Ereignis zu finden
        while (true) {
            // Bereich ist so klein, dass das Ereignis zwischen start und end eingefügt wird
            if (end <= start + 1) {
                position = end;
                break;
            }
            // Berechne den Mittelpunkt des aktuellen Bereichs
            midPoint = Math.floor(start + (end - start) / 2);
            // Das Ereignis gehört zum ersten Teil des Bereichs, verschiebe das Ende
            if (sortedArray[midPoint].created_at > event.created_at) {
                start = midPoint;
            }
            // Das Ereignis gehört zum zweiten Teil des Bereichs, verschiebe den Anfang
            else if (sortedArray[midPoint].created_at < event.created_at) {
                end = midPoint;
            }
            // Das Ereignis hat dasselbe Erstellungsdatum wie das Ereignis in der Mitte
            else {
                position = midPoint;
                break;
            }
        }
    }

    // Füge das Ereignis ein, wenn es noch nicht vorhanden ist
    if (sortedArray[position]?.id !== event.id) {
        return [
            ...sortedArray.slice(0, position),
            event,
            ...sortedArray.slice(position),
        ];
    }

    // Das Ereignis ist bereits im Array vorhanden, gib das unveränderte Array zurück
    return sortedArray;
}
