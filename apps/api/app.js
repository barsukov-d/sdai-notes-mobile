import express from "express"
import pg from "pg"

/**
 * API «Заметок команды»: заметки в памяти процесса.
 * `/health/db` показывает, подключена ли база (переменная DATABASE_URL).
 * Экспортируется отдельно от запуска, чтобы тесты работали без сети.
 */
export function createApp({ seed = defaultNotes(), databaseUrl = process.env.DATABASE_URL, connect = defaultConnect } = {}) {
  const app = express()
  app.use(express.json())

  const notes = seed.map((n) => ({ ...n }))
  let nextId = notes.reduce((max, n) => Math.max(max, n.id), 0) + 1

  app.get("/api/notes", (_req, res) => {
    res.json({ notes, total: notes.length, active: notes.filter((n) => !n.done).length })
  })

  app.post("/api/notes", (req, res) => {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : ""
    if (text === "") return res.status(400).json({ error: "Текст заметки не может быть пустым" })
    const note = { id: nextId++, text, done: false, createdAt: new Date().toISOString() }
    notes.push(note)
    res.status(201).json(note)
  })

  app.patch("/api/notes/:id", (req, res) => {
    const note = notes.find((n) => n.id === Number(req.params.id))
    if (!note) return res.status(404).json({ error: "Заметка не найдена" })
    if (typeof req.body?.done === "boolean") note.done = req.body.done
    res.json(note)
  })

  app.get("/health/db", async (_req, res) => {
    if (!databaseUrl) return res.json({ db: "нет базы" })
    let client
    try {
      client = await connect(databaseUrl)
      const { rows } = await client.query("select marker from probe limit 1")
      res.json({ db: "подключено", marker: rows[0]?.marker ?? null })
    } catch {
      res.json({ db: "ошибка" })
    } finally {
      await client?.end().catch(() => {})
    }
  })

  return app
}

async function defaultConnect(url) {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 3000 })
  await client.connect()
  return client
}

export function defaultNotes() {
  return [
    { id: 1, text: "Согласовать макет главной страницы", done: true, createdAt: "2026-10-20T09:00:00.000Z" },
    { id: 2, text: "Подготовить демо для заказчика", done: false, createdAt: "2026-10-21T10:30:00.000Z" },
    { id: 3, text: "Проверить выгрузку отчёта", done: false, createdAt: "2026-10-22T14:15:00.000Z" },
  ]
}
