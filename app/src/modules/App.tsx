import { useState, useEffect } from "react";
import { listTodos, createTodo, toggleTodo, removeTodo } from "../api";
import { TodoList } from "./TodoList";
import { NewTodo } from "./NewTodo";
import { Filters } from "./Filters";
import type { Filter, Todo } from "./types";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTodos()
      .then(setTodos)
      .catch((err) => {
        console.error(err);
        setError("Failed to load tasks. Please refresh the page.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (text: string) => {
    if (!text.trim()) {
      setError("Task cannot be empty");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      const newTodo = await createTodo(text);
      setTodos((prev) => [...prev, newTodo]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add task. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleToggle = async (id: string) => {
    // Optimistically update UI
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    
    try {
      await toggleTodo(id);
      setError(null);
    } catch (err) {
      console.error(err);
      // Rollback on error
      setTodos(previousTodos);
      setError("Failed to update task. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemove = async (id: string) => {
    // Optimistically update UI
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));
    
    try {
      await removeTodo(id);
      setError(null);
    } catch (err) {
      console.error(err);
      // Rollback on error
      setTodos(previousTodos);
      setError("Failed to delete task. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Apply filter
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true; // all
  });

  const completedCount = todos.filter(t => t.completed).length;
  const progressPercentage = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Cosmic Gradient Background with Star Sparkles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a2e] via-[#1a1a3e] to-[#2d1b4e]"></div>
        {/* Star sparkles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          ></div>
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl">
          
          {/* Glassmorphism Main Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Title */}
              <h1 className="text-[32px] font-bold text-white mb-2" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
                To-Do List
              </h1>

              {/* Error Notification */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-slideDown backdrop-blur-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="flex-1 font-medium">{error}</span>
                </div>
              )}

              {/* Input Bar */}
              <NewTodo onAdd={handleAdd} />

              {/* Task List */}
              <div className="min-h-[300px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-white/60 mt-4 text-sm">Loading...</p>
                  </div>
                ) : (
                  <TodoList items={filteredTodos} onToggle={handleToggle} onRemove={handleRemove} />
                )}
              </div>

              {/* Footer with Filters and Counter */}
              {todos.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-4">
                  {/* Task Counter and Clear Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm" style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}>
                      {activeCount} {activeCount === 1 ? 'item' : 'items'} left
                    </span>
                    {completedCount > 0 && (
                      <button
                        onClick={() => {
                          completedTodos.forEach(todo => onRemove(todo.id));
                        }}
                        className="text-white/60 hover:text-white text-sm transition-colors"
                        style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '16px' }}
                      >
                        Clear completed
                      </button>
                    )}
                  </div>

                  {/* Filters */}
                  <Filters value={filter} onChange={setFilter} />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
