import { useEffect, useState } from "react";

export interface Review {
  id: number;
  user_id?: number;
  guest_name?: string;
  guest_phone?: string;
  rating: number;
  text: string;
  created_at: string;
  admin_reply?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = token ? `${API_URL}/reviews/admin` : `${API_URL}/reviews/`;
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
        throw new Error("Ошибка загрузки отзывов");
      }
      setReviews(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [API_URL]);

  return { reviews, loading, error, refetch: fetchReviews };
}
