import { test } from "node:test"
import assert from "node:assert/strict"
import { countDone, footerText, toggleDone } from "./notes.js"

const notes = [
  { id: 1, text: "Первая", done: true },
  { id: 2, text: "Вторая", done: false },
  { id: 3, text: "Третья", done: false },
]

test("считает сделанные заметки", () => {
  assert.equal(countDone(notes), 1)
})

test("подвал «Сделано N из M»", () => {
  assert.equal(footerText(notes), "Сделано 1 из 3")
  assert.equal(footerText([]), "Сделано 0 из 0")
})

test("отметка меняет только одну заметку и не портит исходный список", () => {
  const next = toggleDone(notes, 2)
  assert.equal(footerText(next), "Сделано 2 из 3")
  assert.equal(notes[1].done, false)
})
