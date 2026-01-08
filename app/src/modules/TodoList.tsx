import React from 'react'
import type { Todo } from './App'

export function TodoList({ items, onToggle, onRemove }: {
  items: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  if (items.length === 0) {
    return <p className="empty">No items</p>
  }

  return (
    <ul className="todo-list">
      {items.map(t => (
        <li key={t.id} className={t.completed ? 'completed' : ''}>
          <label>
            <input type="checkbox" checked={t.completed} onChange={() => onToggle(t.id)} />
            <span>{t.title}</span>
          </label>
          <button className="remove" onClick={() => onRemove(t.id)} aria-label={`Remove ${t.title}`}>
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
