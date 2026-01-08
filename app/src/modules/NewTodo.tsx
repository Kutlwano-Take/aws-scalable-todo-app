import React, { useState } from 'react'

export function NewTodo({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(title)
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="new-todo">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}
