'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Proteção de rota simples: verifica token no localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchTasks();
    fetchUsers();
  }, [router]);

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

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao eliminar tarefa:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">Painel de Tarefas</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            Sair
          </button>
        </header>

        {/* Formulário de Criação */}
        <form onSubmit={handleCreateTask} className="mb-8 space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-lg font-semibold">Nova Tarefa</h2>

          {errorMessage && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Ex: Refatorar módulo de autenticação"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Detalhes opcionais..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Atribuir a (Responsável)</label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-blue-500"
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'A criar...' : 'Criar Tarefa'}
          </button>
        </form>

        {/* Lista de Tarefas */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Minhas Tarefas</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  {task.description && <p className="text-gray-400 text-sm mt-1">{task.description}</p>}
                  
                  <div className="mt-3 text-xs text-gray-400 space-x-4">
                    <span>Criado por: <strong className="text-gray-200">{task.author?.name || 'Desconhecido'}</strong></span>
                    <span>Responsável: <strong className="text-gray-200">{task.assignedTo?.name || 'Sem responsável'}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 text-sm bg-red-950/50 hover:bg-red-900/50 px-3 py-1 rounded border border-red-800 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}

            {tasks.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhuma tarefa encontrada.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}