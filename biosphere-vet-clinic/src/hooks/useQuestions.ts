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
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders = token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = token ? `${API_URL}/questions/admin` : `${API_URL}/questions/`;
      let data: any = null
      for (let attempt = 0; attempt < 6; attempt++) {
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          data = await res.json();
          break
        }
        const text = await res.text().catch(() => "");
        if (text.includes("Application loading") || res.status === 503 || res.status === 502) {
          await sleep(1500)
          continue
        }
        throw new Error("Ошибка загрузки вопросов");
      }
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
        headers: authHeaders,
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
        headers: authHeaders,
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
