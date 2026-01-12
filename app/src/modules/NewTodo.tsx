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
    <form onSubmit={submit} className="flex gap-3">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl
                   text-white placeholder-white/60
                   focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                   focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                   transition-all duration-300
                   text-base"
        style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50
                   shadow-lg shadow-blue-500/20"
        style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}
      >
        Add
      </button>
    </form>
  )
}
