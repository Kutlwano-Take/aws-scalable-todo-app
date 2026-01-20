import React from "react";
import type { Todo } from "./types";

export function TodoList({
  items,
  onToggle,
  onRemove,
}: {
  items: Todo[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p className="empty-state">No tasks yet</p>;
  }

  return (
    <ul className="task-list">
      {items.map((t) => (
        <li
          key={t.id}
          className={`task-item ${t.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => onToggle(t.id)}
            className="task-checkbox"
          />
          <span className="task-text">{t.text}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="task-delete"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
