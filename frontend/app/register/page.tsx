'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/src/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users', {
        name,
        email,
        password,
      });

      // Redireciona para o login após criar a conta com sucesso
      router.push('/login');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao criar conta. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Fábio Gomes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="fabio@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'A registar...' : 'Registar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}