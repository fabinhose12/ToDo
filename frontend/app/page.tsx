'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/services/api';
interface User {
  id: string;
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  authorId: string;
  assignedToId?: string;
  author?: User;
  assignedTo?: User;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]); // ◄── Lista de utilizadores
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Carregar Tarefas e Utilizadores ao iniciar a página
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar utilizadores:', error);
    }
  };


  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/tasks', {
        title,
        description: description || undefined,
        assignedToId: assignedToId || undefined, 
      });

      setTitle('');
      setDescription('');
      setAssignedToId('');
      fetchTasks();
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Erro ao criar a tarefa.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestão de Tarefas</h1>

      {/* Formulário */}
      <form onSubmit={handleCreateTask} className="mb-8 space-y-4 border p-4 rounded shadow-sm">
        <h2 className="text-lg font-semibold">Nova Tarefa</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded text-black"
            placeholder="Ex: Refatorar módulo de autenticação"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded text-black"
            placeholder="Detalhes opcionais..."
          />
        </div>

        {/* ◄── Campo de Seleção de Responsável ──► */}
        <div>
          <label className="block text-sm font-medium mb-1">Atribuir a (Responsável)</label>
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="w-full border p-2 rounded text-black bg-white"
          >
            <option value="">-- Nenhum responsável selecionado --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'A criar...' : 'Criar Tarefa'}
        </button>
      </form>

    
      <section>
        <h2 className="text-xl font-semibold mb-4">Minhas Tarefas</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                {task.description && <p className="text-gray-600">{task.description}</p>}
                
                <div className="mt-2 text-xs text-gray-500 space-x-4">
                  <span>Criado por: <strong>{task.author?.name || 'Desconhecido'}</strong></span>
                  <span>Responsável: <strong>{task.assignedTo?.name || 'Sem responsável'}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}