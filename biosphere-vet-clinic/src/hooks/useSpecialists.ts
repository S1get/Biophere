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

  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  const fetchSpecialists = async () => {
    // Попробуем сначала взять из localStorage
    const cachedData = localStorage.getItem('specialists_cache');
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        // Если кэшу меньше 1 часа, используем его
        if (Date.now() - timestamp < 3600000) {
          setSpecialists(data);
          setLoading(false);
          // Но все равно обновим в фоне
        }
      } catch (e) {
        console.error("Ошибка парсинга кэша специалистов:", e);
      }
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // Увеличиваем до 45 секунд для "просыпания" сервера

    try {
      const res = await fetch(`${API_URL}/specialists/`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Ошибка ответа сервера (specialists):", text);
        throw new Error("Ошибка загрузки специалистов");
      }
      const data = await res.json();
      
      // Сохраняем в кэш
      localStorage.setItem('specialists_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));

      setSpecialists(data);
      setError(null);
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        setError("Превышено время ожидания ответа от сервера. Возможно, сервер просыпается или есть проблемы с сетью. Попробуйте обновить страницу через минуту.");
      } else {
        setError(e.message);
      }
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
