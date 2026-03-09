import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Specialist } from '../hooks/useSpecialists';
import { X, Plus, Upload } from 'lucide-react';

interface SpecialistModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist?: Specialist | null;
  onSave: (specialist: Omit<Specialist, 'id'>) => Promise<void>;
  onUpdate?: (id: number, specialist: Partial<Specialist>) => Promise<void>;
  mode: 'create' | 'edit';
  positions: string[];
  workplaces: string[];
}

export default function SpecialistModal({
  isOpen,
  onClose,
  specialist,
  onSave,
  onUpdate,
  mode,
  positions = [],
  workplaces = []
}: SpecialistModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    specialization: '',
    workplace: '',
    education: '',
    extra_qual: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (specialist && mode === 'edit') {
      setFormData({
        name: specialist.name || '',
        position: specialist.position || '',
        specialization: specialist.specialization || '',
        workplace: specialist.workplace || '',
        education: specialist.education || '',
        extra_qual: specialist.extra_qual || '',
        photo: specialist.photo || ''
      });
    } else {
      setFormData({
        name: '',
        position: '',
        specialization: '',
        workplace: '',
        education: '',
        extra_qual: '',
        photo: ''
      });
    }
    setErrors({});
  }, [specialist, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Должность обязательна';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (mode === 'create') {
        await onSave(formData);
      } else if (mode === 'edit' && specialist && onUpdate) {
        await onUpdate(specialist.id, formData);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setErrors({ submit: 'Ошибка сохранения специалиста' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Пожалуйста, выберите изображение' }));
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      // Получаем базовый URL без лишних слешей
      const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка загрузки: ${errorText}`);
      }
      
      const data = await response.json();
      // data.url уже содержит начальный слеш (/uploads/filename.ext)
      const fullUrl = `${API_URL}${data.url}`;
      
      setFormData(prev => ({ ...prev, photo: fullUrl }));
      setErrors(prev => ({ ...prev, photo: '' }));
    } catch (error: any) {
      console.error('Ошибка загрузки фото:', error);
      setErrors(prev => ({ ...prev, photo: `Не удалось загрузить фото: ${error.message}` }));
    } finally {
      setUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-biosphere-primary">
            {mode === 'create' ? 'Добавить специалиста' : 'Редактировать специалиста'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Заполните информацию о новом специалисте клиники.' 
              : 'Измените данные специалиста.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="ФИО специалиста"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="position">Должность *</Label>
              <Input
                id="position"
                list="positions-list"
                value={formData.position}
                onChange={e => handleChange('position', e.target.value)}
                placeholder="Ветеринарный врач"
                className={errors.position ? 'border-red-500' : ''}
              />
              <datalist id="positions-list">
                {positions.map(pos => (
                  <option key={pos} value={pos} />
                ))}
              </datalist>
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="specialization">Специализация</Label>
            <Textarea
              id="specialization"
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              placeholder="терапия, хирургия, кардиология"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="workplace">Место работы</Label>
            <Input
              id="workplace"
              list="workplaces-list"
              value={formData.workplace}
              onChange={e => handleChange('workplace', e.target.value)}
              placeholder="ул. Московская, д. 4"
            />
            <datalist id="workplaces-list">
              {workplaces.map(w => (
                <option key={w} value={w} />
              ))}
            </datalist>
          </div>

          <div>
            <Label htmlFor="education">Образование</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              placeholder="Московская Ветеринарная Академия"
            />
          </div>

          <div>
            <Label htmlFor="extra_qual">Дополнительная квалификация</Label>
            <Textarea
              id="extra_qual"
              value={formData.extra_qual}
              onChange={(e) => handleChange('extra_qual', e.target.value)}
              placeholder="Кардиология, УЗИ-диагностика"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Фото специалиста</Label>
            <div className="flex flex-col gap-4">
              {formData.photo && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <img 
                    src={formData.photo} 
                    alt="Предпросмотр" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => handleChange('photo', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="photo_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => document.getElementById('photo_upload')?.click()}
                    disabled={uploading}
                  >
                    <Plus className="h-4 w-4" />
                    {uploading ? 'Загрузка...' : 'Загрузить фото'}
                  </Button>
                </div>
                <div className="flex-1">
                  <Input
                    id="photo_url"
                    value={formData.photo}
                    onChange={(e) => handleChange('photo', e.target.value)}
                    placeholder="Или вставьте ссылку на фото"
                  />
                </div>
              </div>
            </div>
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : (mode === 'create' ? 'Добавить' : 'Сохранить')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 