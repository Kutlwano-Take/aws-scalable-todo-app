import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

let todos = [] // Mock DB; replace with DynamoDB in Week 3

app.get('/todos', (req, res) => {
  res.json(todos)
})

app.post('/todos', (req, res) => {
  const { title } = req.body || {}
  const trimmed = (title || '').trim()
  if (!trimmed) return res.status(400).json({ error: 'title required' })
  const todo = { id: crypto.randomUUID(), title: trimmed, completed: false, createdAt: Date.now() }
  todos.unshift(todo)
  res.status(201).json(todo)
})

app.put('/todos/:id/toggle', (req, res) => {
  const { id } = req.params
  const idx = todos.findIndex(t => t.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  todos[idx] = { ...todos[idx], completed: !todos[idx].completed }
  res.json(todos[idx])
})

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params
  const before = todos.length
  todos = todos.filter(t => t.id !== id)
  if (todos.length === before) return res.status(404).json({ error: 'not found' })
  res.status(204).send()
})

app.delete('/todos', (req, res) => {
  const before = todos.length
  todos = todos.filter(t => !t.completed)
  res.json({ removed: before - todos.length })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
