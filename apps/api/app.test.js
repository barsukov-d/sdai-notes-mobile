import { test } from "node:test"
import assert from "node:assert/strict"
import { createApp } from "./app.js"

async function withServer(options, fn) {
  const server = createApp(options).listen(0, "127.0.0.1")
  await new Promise((ok) => server.once("listening", ok))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    await fn(base)
  } finally {
    server.close()
  }
}

test("список заметок и счётчики", async () => {
  await withServer({ databaseUrl: "" }, async (base) => {
    const body = await (await fetch(`${base}/api/notes`)).json()
    assert.equal(body.total, 3)
    assert.equal(body.active, 2)
  })
})

test("добавление и отметка «сделано»", async () => {
  await withServer({ databaseUrl: "" }, async (base) => {
    const created = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "Новая заметка" }),
    })
    assert.equal(created.status, 201)
    const note = await created.json()
    const patched = await fetch(`${base}/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ done: true }),
    })
    assert.equal((await patched.json()).done, true)
  })
})

test("пустой текст отклоняется", async () => {
  await withServer({ databaseUrl: "" }, async (base) => {
    const res = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "  " }),
    })
    assert.equal(res.status, 400)
  })
})

test("/health/db без DATABASE_URL — «нет базы»", async () => {
  await withServer({ databaseUrl: "" }, async (base) => {
    assert.deepEqual(await (await fetch(`${base}/health/db`)).json(), { db: "нет базы" })
  })
})

test("/health/db с базой — значение метки", async () => {
  const connect = async () => ({ query: async () => ({ rows: [{ marker: "stage-1" }] }), end: async () => {} })
  await withServer({ databaseUrl: "postgres://x", connect }, async (base) => {
    assert.deepEqual(await (await fetch(`${base}/health/db`)).json(), { db: "подключено", marker: "stage-1" })
  })
})

test("/health/db при сбое базы — «ошибка»", async () => {
  const connect = async () => {
    throw new Error("refused")
  }
  await withServer({ databaseUrl: "postgres://x", connect }, async (base) => {
    assert.deepEqual(await (await fetch(`${base}/health/db`)).json(), { db: "ошибка" })
  })
})
