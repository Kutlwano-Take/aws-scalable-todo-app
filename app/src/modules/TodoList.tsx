import React from "react";
import type { Todo } from "../api";

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
    return <p className="text-gray-400 italic text-center py-4">No tasks yet</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-4 bg-black/30 border border-white/10 rounded-xl px-5 py-4 ${
            t.completed ? "opacity-60 line-through" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => onToggle(t.id)}
            className="w-5 h-5 accent-purple-500"
          />
          <span className="flex-1 text-white text-lg">{t.text}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
