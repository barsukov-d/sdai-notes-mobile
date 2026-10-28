import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text } from "react-native"
import { fetchNotes, setDone } from "./src/api.js"
import { footerText, toggleDone } from "./src/notes.js"

export default function App() {
  const [notes, setNotes] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNotes().then(setNotes, (e) => setError(e.message))
  }, [])

  const onPress = (note) => {
    setNotes((list) => toggleDone(list, note.id))
    setDone(note.id, !note.done).catch((e) => setError(e.message))
  }

  if (error) return <Text style={styles.error}>Не удалось загрузить: {error}</Text>
  if (notes === null) return <ActivityIndicator style={styles.center} />

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Заметки</Text>
      <FlatList
        data={notes}
        keyExtractor={(n) => String(n.id)}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPress(item)} style={styles.row}>
            <Text style={item.done ? styles.done : styles.text}>{item.done ? "✓ " : "○ "}{item.text}</Text>
          </Pressable>
        )}
      />
      <Text style={styles.footer}>{footerText(notes)}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, paddingTop: 48 },
  center: { flex: 1 },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  row: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  text: { fontSize: 16 },
  done: { fontSize: 16, color: "#888", textDecorationLine: "line-through" },
  footer: { paddingVertical: 12, color: "#555" },
  error: { padding: 24, color: "#b00020" },
})
