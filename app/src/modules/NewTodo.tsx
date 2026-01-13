import React, { useState } from 'react'

export function NewTodo({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
    }
  }

  return (
    <form onSubmit={submit} className="input-container">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="input-field"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="add-button"
      >
        Add
      </button>
    </form>
  )
}
