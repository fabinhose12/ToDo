import { Task, CreateTaskData } from '../types/task';

const API_URL = 'http://localhost:3000';

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    cache: 'no-store', 
  });
  if (!response.ok) {
    throw new Error('Falha ao buscar tarefas');
  }
  return response.json();
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar tarefa');
  }

  return response.json();
}

export async function toggleTaskStatus(id: string, isCompleted: boolean): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isCompleted: !isCompleted }),
  });

  if (!response.ok) {
    throw new Error('Falha ao atualizar tarefa');
  }

  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Falha ao deletar tarefa');
  }
}