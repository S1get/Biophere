import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface GuestQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function GuestQuestionModal({ isOpen, onClose, onSuccess }: GuestQuestionModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !text.trim()) {
      toast({ title: 'Заполните все поля', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/questions/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_name: name, guest_phone: phone, text })
      })
      if (!res.ok) {
        let message = 'Ошибка отправки'
        try {
          const data = await res.json()
          message = (data && data.detail) ? String(data.detail) : message
        } catch { void 0 }
        throw new Error(message)
      }
      toast({ title: 'Спасибо за вопрос!', description: 'Ваш вопрос отправлен и сохранён.' })
      setName('')
      setPhone('')
      setText('')
      onClose()
      onSuccess && onSuccess()
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err?.message || 'Не удалось отправить вопрос', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-biosphere-primary">Задать вопрос</DialogTitle>
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
            <Label htmlFor="guest-text">Вопрос</Label>
            <Textarea
              id="guest-text"
              placeholder="Ваш вопрос..."
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
