import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Quote, Pencil, Trash } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { GuestReviewModal } from './GuestReviewModal'

interface Review {
  id: number
  user_id?: number
  guest_name?: string
  guest_phone?: string
  rating: number
  text: string
  user?: { name: string, avatar?: string }
  admin_reply?: string | null
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ReviewsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState('')
  const [form, setForm] = useState<{ rating: number; text: string }>({ rating: 5, text: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyingId, setReplyingId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState<string>('')
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false)

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const fetchJSONWithRetry = async (url: string, options?: RequestInit, retries = 6, delay = 1500) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch(url, options)
        const contentType = res.headers.get('content-type') || ''
        if (res.ok && contentType.includes('application/json')) {
          return await res.json()
        }
        const text = await res.text().catch(() => '')
        if (text.includes('Application loading') || res.status === 503 || res.status === 502) {
          await sleep(delay)
          continue
        }
        throw new Error('Bad response')
      } catch (e) {
        if (attempt === retries - 1) throw e
        await sleep(delay)
      }
    }
  }

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchJSONWithRetry(`${API_URL}/reviews/`)
      setReviews(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/reviews/${editingId ? editingId : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        if (res.status === 429) {
          toast({
            title: 'Слишком часто',
            description: 'Можно оставлять отзыв не чаще, чем раз в 10 минут.',
            variant: 'destructive',
          })
          return
        }
        throw new Error('Ошибка сохранения')
      }
      setForm({ rating: 5, text: '' })
      setEditingId(null)
      fetchReviews()
    } catch {
      setError('Ошибка сохранения')
    }
  }

  const handleEdit = (review: Review) => {
    setForm({ rating: review.rating, text: review.text })
    setEditingId(review.id)
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    if (!window.confirm('Удалить отзыв?')) return
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления')
      fetchReviews()
    } catch {
      setError('Ошибка удаления')
    }
  }

  const handleReply = async (id: number) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/reviews/${id}/reply`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(replyText),
      })
      if (!res.ok) throw new Error('Ошибка ответа')
      setReplyingId(null)
      setReplyText('')
      fetchReviews()
    } catch {
      setError('Ошибка ответа')
    }
  }

  const filtered = reviews.filter(r =>
    r.text.toLowerCase().includes(search.toLowerCase()) &&
    (rating === '' || r.rating === Number(rating))
  )

  const renderStars = (rating: number, onClick?: (n: number) => void) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 cursor-pointer ${index < rating ? 'text-biosphere-warm fill-biosphere-warm' : 'text-gray-300'}`}
        onClick={onClick ? () => onClick(index + 1) : undefined}
      />
    ))
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Кнопка для гостей */}
        {!user && (
          <div className="mb-8 flex justify-center">
            <button
              className="bg-biosphere-primary hover:bg-biosphere-secondary text-white font-medium px-6 py-2 rounded-xl shadow"
              onClick={() => setGuestModalOpen(true)}
            >
              Оставить отзыв
            </button>
          </div>
        )}
        <GuestReviewModal isOpen={guestModalOpen} onClose={() => setGuestModalOpen(false)} onSuccess={fetchReviews} />
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-end">
          <input
            type="text"
            placeholder="Поиск по тексту отзыва..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-6 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary shadow-sm mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700"
          />
          <select
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="w-full md:w-48 px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary shadow-sm mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          >
            <option value="">Все рейтинги</option>
            <option value="5">5 звёзд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
        </div>
        {user && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-900 rounded-xl shadow p-6 max-w-xl mx-auto">
            <div className="mb-4 flex items-center gap-2">
              <span className="mr-2 text-gray-700 dark:text-gray-200">Ваша оценка:</span>
              {renderStars(form.rating, n => setForm(f => ({ ...f, rating: n })))}
            </div>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={500}
              placeholder="Ваш отзыв..."
              className="w-full px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 mb-4"
            />
            <button
              type="submit"
              className="bg-biosphere-primary hover:bg-biosphere-secondary text-white font-medium px-6 py-2 rounded-xl shadow"
              disabled={loading}
            >
              {editingId ? 'Сохранить изменения' : 'Оставить отзыв'}
            </button>
            {editingId && (
              <button
                type="button"
                className="ml-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={() => { setEditingId(null); setForm({ rating: 5, text: '' }) }}
              >
                Отмена
              </button>
            )}
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((review) => (
            <Card key={review.id} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-biosphere-primary text-white font-medium">
                        {review.user?.avatar ? review.user.avatar : (review.user?.name ? review.user.name[0] : (review.guest_name ? review.guest_name[0] : '?'))}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.user?.name || review.guest_name || 'Пользователь'}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="flex-1">
                  <Quote className="h-6 w-6 text-biosphere-primary/30 mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {review.text}
                  </p>
                  {review.admin_reply && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded text-black dark:text-white text-sm">
                      <b>Ответ администратора:</b> {review.admin_reply}
                    </div>
                  )}
                  {user && user.is_admin && (
                    <div className="mt-2">
                      {replyingId === review.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            className="w-full border rounded p-2 text-black dark:text-black"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Ответ администратора..."
                          />
                          <div className="flex gap-2">
                            <button className="bg-biosphere-primary text-white px-4 py-1 rounded" onClick={() => handleReply(review.id)} type="button">Сохранить</button>
                            <button className="text-gray-500" onClick={() => { setReplyingId(null); setReplyText('') }} type="button">Отмена</button>
                          </div>
                        </div>
                      ) : (
                        <button className="text-biosphere-primary hover:underline" onClick={() => { setReplyingId(review.id); setReplyText(review.admin_reply || '') }}>Ответить</button>
                      )}
                    </div>
                  )}
                </div>
                {user && (user.id === review.user_id || user.is_admin) && (
                  <div className="flex gap-2 mt-2">
                    {user.id === review.user_id && (
                      <button
                        className="flex items-center gap-1 text-biosphere-primary hover:text-biosphere-secondary"
                        onClick={() => handleEdit(review)}
                      >
                        <Pencil className="w-4 h-4" /> Редактировать
                      </button>
                    )}
                    <button
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash className="w-4 h-4" /> Удалить
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {showScrollTop && (
          <button
            className="fixed z-50 right-6 bottom-24 md:bottom-32 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors bg-white dark:bg-gray-800 text-biosphere-primary dark:text-biosphere-secondary border border-gray-200 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white dark:hover:bg-biosphere-secondary dark:hover:text-white"
            title="Вверх"
            onClick={scrollToTop}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          </button>
        )}
      </div>
    </section>
  )
}
