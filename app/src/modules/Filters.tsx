import React from 'react'

export type Filter = 'all' | 'active' | 'completed'

export function Filters({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="filters">
      {(['all', 'active', 'completed'] as const).map(f => (
        <button
          key={f}
          className={value === f ? 'active' : ''}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
