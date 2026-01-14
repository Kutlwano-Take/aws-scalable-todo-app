import type { Todo } from './modules/types';


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || '';


const getHeaders = (includeContentType = false): HeadersInit => {
  const headers: HeadersInit = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }
  return headers;
};

export const listTodos = async (): Promise<Todo[]> => {
  try {
    const res = await fetch(`${BASE_URL}/todos`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      console.error('GET /todos failed:', res.status, await res.text());
      return [];
    }
    const data = await res.json();
    console.log('Real tasks from AWS:', data);
    return data.map((item: any) => ({
      id: item.id,
      text: item.text,
      completed: item.completed || false,
      createdAt: item.createdAt || new Date().toISOString()
    }));
  } catch (err) {
    console.error('Network error fetching todos:', err);
    return [];
  }
};

export const createTodo = async (text: string): Promise<Todo> => {
  try {
    const res = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ text, completed: false })
    });
    if (!res.ok) {
      console.error('POST /todos failed:', res.status, await res.text());
      throw new Error('Failed to create task');
    }
    const item = await res.json();
    console.log('Created task on AWS:', item);
    return {
      id: item.id,
      text: item.text,
      completed: item.completed || false,
      createdAt: item.createdAt || new Date().toISOString()
    };
  } catch (err) {
    console.error('Error creating todo:', err);
    throw err;
  }
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  try {
    const res = await fetch(`${BASE_URL}/todos/${id}/toggle`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!res.ok) {
      console.error('PUT /todos/:id/toggle failed:', res.status, await res.text());
      throw new Error('Failed to toggle task');
    }
    const item = await res.json();
    console.log('Toggled task on AWS:', item);
    return item;
  } catch (err) {
    console.error('Error toggling todo:', err);
    throw err;
  }
};

export const removeTodo = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      console.error('DELETE /todos/:id failed:', res.status, await res.text());
      throw new Error('Failed to delete task');
    }
    console.log('Deleted task on AWS:', id);
  } catch (err) {
    console.error('Error removing todo:', err);
    throw err;
  }
};

export const clearCompleted = async (): Promise<void> => {
  // This function is called by the UI but bulk delete is handled client-side
  // Each completed task is deleted individually via removeTodo()
  // This is a placeholder to satisfy the API interface
  console.log('clearCompleted: Bulk delete handled client-side via individual removeTodo calls');
};