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
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#000000' }}>
      {/* Glassmorphism Background */}
      <div className="app-background"></div>
      
      {/* Star Sparkles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.6 + 0.2
          }}
        ></div>
      ))}

      {/* Main Container */}
      <div className="app-container">
        <div className="app-wrapper">
          
          {/* Glassmorphism Main Card */}
          <div className="glass-card">
            <div className="glass-card-content">
              
              {/* Title */}
              <div>
                <h1 className="app-title">To-Do List</h1>
                <p className="app-subtitle">
                  {todos.length > 0 ? `${completedCount} of ${todos.length} completed` : 'Get things done'}
                </p>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="error-notification">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Input Bar */}
              <NewTodo onAdd={handleAdd} />

              {/* Task List */}
              <div style={{ minHeight: '300px' }}>
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading your tasks...</p>
                  </div>
                ) : (
                  <TodoList items={filteredTodos} onToggle={handleToggle} onRemove={handleRemove} />
                )}
              </div>

              {/* Footer with Filters and Counter */}
              {todos.length > 0 && (
                <div className="app-footer">
                  {/* Task Counter and Clear Button */}
                  <div className="footer-row">
                    <span className="task-counter">
                      {activeCount} {activeCount === 1 ? 'item' : 'items'} left
                    </span>
                    {completedCount > 0 && (
                      <button
                        onClick={() => {
                          completedTodos.forEach(todo => handleRemove(todo.id));
                        }}
                        className="clear-button"
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
