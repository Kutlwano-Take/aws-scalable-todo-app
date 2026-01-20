import React, { useState } from "react";

export function NewTodo({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What are we conquering today?"
        className="flex-1 px-5 py-4 rounded-xl bg-black/30 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform shadow-lg"
      >
        Launch
      </button>
    </form>
  );
}
