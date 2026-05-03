import { useEffect, useMemo, useState } from "react";

export type PricelistItem = {
  section: string;
  name: string;
  note?: string | null;
  price: string;
};

type PricelistResponse = {
  cached: boolean;
  fetched_at: number;
  source_url: string;
  sections: string[];
  items: PricelistItem[];
};

const CACHE_KEY = "pricelist_cache_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export function usePricelist() {
  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

  const [items, setItems] = useState<PricelistItem[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromCache = () => {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw) as { timestamp: number; data: PricelistResponse };
      if (!parsed?.timestamp || !parsed?.data) return false;
      if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return false;
      setItems(Array.isArray(parsed.data.items) ? parsed.data.items : []);
      setSections(Array.isArray(parsed.data.sections) ? parsed.data.sections : []);
      return true;
    } catch {
      return false;
    }
  };

  const fetchPricelist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pricelist`, { method: "GET" });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Ошибка загрузки прейскуранта");
      }
      const data = (await res.json()) as PricelistResponse;
      const nextItems = Array.isArray(data.items) ? data.items : [];
      const nextSections = Array.isArray(data.sections) ? data.sections : [];
      setItems(nextItems);
      setSections(nextSections);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки прейскуранта");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasCache = loadFromCache();
    if (hasCache) {
      // обновляем в фоне
      fetchPricelist();
      setLoading(false);
      return;
    }
    fetchPricelist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  const serviceNames = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) {
      const n = (it?.name || "").trim();
      if (n.length >= 3) set.add(n);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [items]);

  return { items, sections, serviceNames, loading, error, refetch: fetchPricelist };
}

