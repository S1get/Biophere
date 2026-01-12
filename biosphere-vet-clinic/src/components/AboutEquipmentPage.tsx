import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Cpu, Microscope, Stethoscope, HeartPulse, FlaskConical, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutEquipmentPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">Наши технологии</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-biosphere-primary">Современное оборудование и инновации</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Мы гордимся тем, что используем самые передовые технологии для диагностики и лечения ваших питомцев. Наше оборудование — это залог точности, безопасности и комфорта.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Shield className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Безопасность и стерильность</h3>
                <p className="text-gray-700 dark:text-gray-300">Все процедуры проводятся с использованием одноразовых инструментов и в стерильных условиях. Мы строго следим за санитарными нормами.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Cpu className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Цифровая диагностика</h3>
                <p className="text-gray-700 dark:text-gray-300">Современные УЗИ, цифровой рентген, лабораторные анализаторы позволяют быстро и точно поставить диагноз.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Microscope className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Лабораторные исследования</h3>
                <p className="text-gray-700 dark:text-gray-300">Более 20 видов анализов: биохимия, гематология, микроскопия. Результаты — в день обращения.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Stethoscope className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Современные методы лечения</h3>
                <p className="text-gray-700 dark:text-gray-300">Используем лазерную терапию, инфузионные помпы, ингаляционный наркоз и другие инновационные подходы.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-biosphere-primary/10 dark:bg-biosphere-primary/20 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-biosphere-primary">Почему выбирают нас?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex flex-col items-center">
              <HeartPulse className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Забота о каждом пациенте</span>
            </div>
            <div className="flex flex-col items-center">
              <FlaskConical className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Постоянное обновление оборудования</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Гарантия точности и безопасности</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          <p>
            Мы инвестируем в технологии, чтобы ваши питомцы получали лучшее. Приходите и убедитесь сами — современная ветеринария доступна каждому!
          </p>
        </div>

        <div className="mt-10 flex justify-between">
          <Link to="/about-24-7" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <ChevronLeft className="h-4 w-4" /> Назад
          </Link>
          <Link to="/about-doctors" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            Далее <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
} 
