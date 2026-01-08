import React, { useEffect, useMemo, useState } from 'react'
import { TodoList } from './TodoList'
import { NewTodo } from './NewTodo'
import { Filters, type Filter } from './Filters'
import * as api from '../api'

export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock API fetch (replace with real API Gateway URL in Week 3)
    api
      .listTodos()
      .then(data => setTodos(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed)
      case 'completed':
        return todos.filter(t => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const addTodo = async (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    const created = await api.createTodo(trimmed)
    setTodos(prev => [created, ...prev])
  }

  const toggleTodo = async (id: string) => {
    const updated = await api.toggleTodo(id)
    if (!updated) return
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)))
  }

  const removeTodo = async (id: string) => {
    const ok = await api.removeTodo(id)
    if (!ok) return
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const clearCompleted = async () => {
    await api.clearCompleted()
    setTodos(prev => prev.filter(t => !t.completed))
  }

  return (
    <div className="container">
      <h1>To‑Do List</h1>
      <NewTodo onAdd={addTodo} />
      <Filters value={filter} onChange={setFilter} />
      {loading ? <p className="empty">Loading…</p> : <TodoList items={visible} onToggle={toggleTodo} onRemove={removeTodo} />}
      <div className="footer">
        <span>{todos.filter(t => !t.completed).length} items left</span>
        <button onClick={clearCompleted} className="link">Clear completed</button>
      </div>
    </div>
  )
}
