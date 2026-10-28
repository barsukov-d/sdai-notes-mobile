import Constants from "expo-constants"

/** Адрес API: переменная EXPO_PUBLIC_API_URL, иначе значение из app.json. */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:3000"

export async function fetchNotes() {
  const res = await fetch(`${API_URL}/api/notes`)
  if (!res.ok) throw new Error(`API ответил ${res.status}`)
  return (await res.json()).notes
}

export async function setDone(id, done) {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ done }),
  })
  if (!res.ok) throw new Error(`API ответил ${res.status}`)
  return res.json()
}
