'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { getTasks, createTask, toggleTaskStatus, deleteTask } from '../services/api';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA');

  // Carrega as tarefas ao montar o componente
  async function fetchTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Envio do formulário
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('MEDIA');
      fetchTasks(); // Recarrega a lista atualizada do banco
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  }

  // Alternar status (Concluída / Pendente)
  async function handleToggle(id: string, currentStatus: boolean) {
    try {
      await toggleTaskStatus(id, currentStatus);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  }

  // Deletar tarefa
  async function handleDelete(id: string) {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-indigo-400">To-Do List Fullstack</h1>
          <p className="text-slate-400 text-sm mt-1">NestJS + Prisma + SQLite + Next.js</p>
        </header>

        {/* Formulário de Nova Tarefa */}
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Nova Tarefa</h2>
          
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Título da tarefa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />

            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-indigo-500 flex-1"
              >
                <option value="BAIXA">Prioridade: Baixa</option>
                <option value="MEDIA">Prioridade: Média</option>
                <option value="ALTA">Prioridade: Alta</option>
              </select>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition"
              >
                Adicionar
              </button>
            </div>
          </div>
        </form>

        {/* Lista de Tarefas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Suas Tarefas</h2>

          {loading ? (
            <p className="text-slate-400">Carregando tarefas...</p>
          ) : tasks.length === 0 ? (
            <p className="text-slate-500">Nenhuma tarefa encontrada. Crie uma acima!</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                    task.isCompleted
                      ? 'bg-slate-900/50 border-slate-800 opacity-60'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-semibold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </h3>

                      {/* Badge de Prioridade */}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        task.priority === 'ALTA'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : task.priority === 'BAIXA'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-slate-400">{task.description}</p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(task.id, task.isCompleted)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                        task.isCompleted
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {task.isCompleted ? 'Desmarcar' : 'Concluir'}
                          </button>

                          <button
                            onClick={() => handleDelete(task.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-lg transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </main>
        );
      }