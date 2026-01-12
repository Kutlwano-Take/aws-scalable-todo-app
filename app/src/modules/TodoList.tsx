import React from 'react'
import type { Todo } from './types'

export function TodoList({ items, onToggle, onRemove }: {
  items: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-white/60 text-base" style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}>
          No tasks yet. Add one above!
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((t, index) => (
        <li 
          key={t.id} 
          className="group animate-slideIn"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {/* Glass Card */}
          <div className="flex items-center gap-3 p-4 
                         bg-white/5 backdrop-blur-sm 
                         border border-white/10 rounded-xl
                         hover:bg-white/10 hover:border-white/20
                         transition-all duration-200">
            
            {/* Rounded Checkbox */}
            <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
              <input 
                type="checkbox" 
                checked={t.completed} 
                onChange={() => onToggle(t.id)}
                className="w-5 h-5 rounded border-white/30 bg-white/5 
                         text-blue-500 focus:ring-2 focus:ring-blue-500/50
                         checked:bg-blue-500 checked:border-blue-500
                         transition-all duration-200"
              />
              
              <span className={`flex-1 text-white transition-all truncate
                              ${t.completed 
                                ? 'line-through text-white/40' 
                                : 'text-white'
                              }`}
                    style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}>
                {t.text}
              </span>
            </label>

            {/* Delete Icon */}
            <button 
              onClick={() => onRemove(t.id)}
              aria-label={`Remove ${t.text}`}
              className="flex-shrink-0 w-8 h-8 rounded-lg 
                         text-white/40 hover:text-white/80
                         hover:bg-white/10
                         transition-all duration-200
                         flex items-center justify-center 
                         opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
