// Mock API layer to simulate API Gateway + Lambda in Week 1/2
// Replace with real API Gateway base URL in Week 3

export type TodoDTO = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

let memoryTodos: TodoDTO[] = []

export async function listTodos(): Promise<TodoDTO[]> {
  await delay(150)
  return structuredClone(memoryTodos)
}

export async function createTodo(title: string): Promise<TodoDTO> {
  await delay(120)
  const todo: TodoDTO = { id: crypto.randomUUID(), title: title.trim(), completed: false, createdAt: Date.now() }
  memoryTodos.unshift(todo)
  return structuredClone(todo)
}

export async function toggleTodo(id: string): Promise<TodoDTO | undefined> {
  await delay(100)
  const idx = memoryTodos.findIndex(t => t.id === id)
  if (idx === -1) return undefined
  memoryTodos[idx] = { ...memoryTodos[idx], completed: !memoryTodos[idx].completed }
  return structuredClone(memoryTodos[idx])
}

export async function removeTodo(id: string): Promise<boolean> {
  await delay(80)
  const before = memoryTodos.length
  memoryTodos = memoryTodos.filter(t => t.id !== id)
  return memoryTodos.length < before
}

export async function clearCompleted(): Promise<number> {
  await delay(80)
  const before = memoryTodos.length
  memoryTodos = memoryTodos.filter(t => !t.completed)
  return before - memoryTodos.length
}
