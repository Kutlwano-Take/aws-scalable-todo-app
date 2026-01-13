import React from 'react'

export type Filter = 'all' | 'active' | 'completed'

const filterConfig = {
  all: { label: 'All Tasks', emoji: '📋', color: 'blue' },
  active: { label: 'Active', emoji: '⚡', color: 'purple' },
  completed: { label: 'Completed', emoji: '✅', color: 'green' }
}

export function Filters({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="filters-container">
      {(['all', 'active', 'completed'] as const).map(f => (
        <button
          key={f}
          className={`filter-button ${value === f ? 'active' : ''}`}
          onClick={() => onChange(f)}
        >
          {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
        </button>
      ))}
    </div>
  )
}
