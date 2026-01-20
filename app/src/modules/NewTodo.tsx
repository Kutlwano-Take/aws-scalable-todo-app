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
    <form onSubmit={submit} className="input-container">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What are we conquering today?"
        className="input-field"
      />
      <button
        type="submit"
        className="add-button"
      >
        Launch
      </button>
    </form>
  );
}
