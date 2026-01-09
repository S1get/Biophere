import { useEffect, useState } from "react";

export interface Question {
  id: number;
  user_id?: number;
  guest_name?: string;
  guest_phone?: string;
  text: string;
  created_at: string;
  admin_reply?: string;
  is_read: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/questions/`);
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Ошибка ответа сервера (questions):", text);
        throw new Error("Ошибка загрузки вопросов");
      }
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (questionId: number) => {
    try {
      const res = await fetch(`${API_URL}/questions/${questionId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error("Ошибка отметки как прочитанного");
      await fetchQuestions(); // Обновляем список
    } catch (e: any) {
      setError(e.message);
    }
  };

  const markAsUnread = async (questionId: number) => {
    try {
      const res = await fetch(`${API_URL}/questions/${questionId}/unread`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error("Ошибка отметки как непрочитанного");
      await fetchQuestions(); // Обновляем список
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [API_URL]);

  return { 
    questions, 
    loading, 
    error, 
    refetch: fetchQuestions,
    markAsRead,
    markAsUnread
  };
}