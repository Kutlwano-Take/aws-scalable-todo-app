import React, { useState, useRef, useEffect } from 'react'
import type { Todo } from './types'

export function TodoList({ items, onToggle, onRemove }: {
  items: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<{ [key: string]: number }>({});
  const touchStartX = useRef<{ [key: string]: number }>({});
  const touchStartTime = useRef<{ [key: string]: number }>({});

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartX.current[id] = e.touches[0].clientX;
    touchStartTime.current[id] = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current[id];
    
    if (diff < 0) {
      setSwipeOffset(prev => ({ ...prev, [id]: Math.max(diff, -80) }));
      setSwipedId(id);
    }
  };

  const handleTouchEnd = (id: string) => {
    const offset = swipeOffset[id] || 0;
    const timeDiff = Date.now() - touchStartTime.current[id];
    
    if (offset < -50 || (offset < -30 && timeDiff < 200)) {
      // Swipe to delete
      onRemove(id);
    }
    
    setSwipeOffset(prev => ({ ...prev, [id]: 0 }));
    setSwipedId(null);
  };

  // Reset swipe when items change
  useEffect(() => {
    setSwipeOffset({});
    setSwipedId(null);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Add one above! ✨</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {items.map((t, index) => (
        <li 
          key={t.id} 
          className={`task-item ${t.completed ? 'completed' : ''} ${swipedId === t.id ? 'swiping' : ''}`}
          style={{ 
            animationDelay: `${index * 50}ms`,
            transform: `translateX(${swipeOffset[t.id] || 0}px)`,
            transition: swipeOffset[t.id] ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onTouchStart={(e) => handleTouchStart(e, t.id)}
          onTouchMove={(e) => handleTouchMove(e, t.id)}
          onTouchEnd={() => handleTouchEnd(t.id)}
        >
          <input 
            type="checkbox" 
            checked={t.completed} 
            onChange={() => onToggle(t.id)}
            className="task-checkbox"
          />
          
          <span className="task-text">
            {t.text}
          </span>

          <button 
            onClick={() => onRemove(t.id)}
            aria-label={`Remove ${t.text}`}
            className="task-delete"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}
