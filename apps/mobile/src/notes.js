/** Чистые функции списка заметок: без React и сети, поэтому тестируются обычным node. */

export function countDone(notes) {
  return notes.filter((n) => n.done).length
}

export function footerText(notes) {
  return `Сделано ${countDone(notes)} из ${notes.length}`
}

export function toggleDone(notes, id) {
  return notes.map((n) => (n.id === id ? { ...n, done: !n.done } : n))
}
