import React from 'react'

export type Filter = 'all' | 'active' | 'completed'

const filterConfig = {
  all: { label: 'All Tasks', emoji: '📋', color: 'blue' },
  active: { label: 'Active', emoji: '⚡', color: 'purple' },
  completed: { label: 'Completed', emoji: '✅', color: 'green' }
}

export function Filters({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="flex gap-1 justify-center">
      {(['all', 'active', 'completed'] as const).map(f => (
        <button
          key={f}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${value === f 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'text-white/60 hover:text-white/80'
                      }`}
          onClick={() => onChange(f)}
          style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}
        >
          {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
        </button>
      ))}
    </div>
  )
}
