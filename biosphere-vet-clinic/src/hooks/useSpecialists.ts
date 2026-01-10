import { useEffect, useState } from "react";

export interface Specialist {
  id: number;
  name: string;
  position: string;
  specialization?: string;
  workplace?: string;
  education?: string;
  extra_qual?: string;
  photo?: string;
}

export function useSpecialists() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/specialists/`);
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Ошибка ответа сервера (specialists):", text);
        throw new Error("Ошибка загрузки специалистов");
      }
      const data = await res.json();
      setSpecialists(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, [API_URL]);

  const createSpecialist = async (specialist: Omit<Specialist, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Необходима авторизация');

    const res = await fetch(`${API_URL}/specialists/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(specialist)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Ошибка создания специалиста');
    }

    await fetchSpecialists(); // Обновляем список
  };

  const updateSpecialist = async (id: number, specialist: Partial<Specialist>) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Необходима авторизация');

    const res = await fetch(`${API_URL}/specialists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(specialist)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Ошибка обновления специалиста');
    }

    await fetchSpecialists(); // Обновляем список
  };

  const deleteSpecialist = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Необходима авторизация');

    const res = await fetch(`${API_URL}/specialists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Ошибка удаления специалиста');
    }

    await fetchSpecialists(); // Обновляем список
  };

  return { 
    specialists, 
    loading, 
    error, 
    createSpecialist, 
    updateSpecialist, 
    deleteSpecialist,
    refetch: fetchSpecialists
  };
}