import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/admin/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }).toString(),
      });
      if (!response.ok) {
        let message = 'Неудачный вход';
        try {
          const errorData = await response.json();
          const detail = (errorData && errorData.detail) || null;
          if (Array.isArray(detail)) {
            message = detail.map((d: any) => d.msg || String(d)).join(', ');
          } else if (typeof detail === 'string') {
            message = detail;
          }
        } catch { void 0 }
        setError(message);
        setLoading(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      // Сначала редирект на главную, затем обновление страницы
      navigate('/');
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      setError('Неудачный вход');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e6f9ef] dark:from-[#1f2937] dark:to-[#1f2937]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-biosphere-primary">Вход для администратора</h2>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Логин (email)</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-biosphere-primary text-white py-2 px-4 rounded-lg hover:bg-biosphere-secondary transition-colors font-semibold"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
