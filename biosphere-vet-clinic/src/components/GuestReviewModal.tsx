import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GuestReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function GuestReviewModal({ isOpen, onClose, onSuccess }: GuestReviewModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !text.trim()) {
      toast({ title: 'Заполните все поля', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/guest/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_name: name, guest_phone: phone, text, rating })
      })
      if (!res.ok) throw new Error('Ошибка отправки')
      toast({ title: 'Спасибо за отзыв!', description: 'Ваш отзыв отправлен и сохранён.' })
      setName('')
      setPhone('')
      setText('')
      setRating(5)
      onClose()
      onSuccess && onSuccess()
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось отправить отзыв', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-biosphere-primary">Оставить отзыв</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Имя</Label>
            <Input
              id="guest-name"
              placeholder="Ваше имя"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-phone">Телефон</Label>
            <Input
              id="guest-phone"
              placeholder="+7 (900) 123-45-67"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <Label>Оценка</Label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={`h-6 w-6 cursor-pointer ${n <= rating ? 'text-biosphere-warm fill-biosphere-warm' : 'text-gray-300'}`} onClick={() => setRating(n)} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-text">Отзыв</Label>
            <Textarea
              id="guest-text"
              placeholder="Ваш отзыв..."
              value={text}
              onChange={e => setText(e.target.value)}
              minLength={5}
              maxLength={500}
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full bg-biosphere-primary hover:bg-biosphere-secondary" disabled={loading}>
            Отправить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}