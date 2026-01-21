import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, HeartPulse, Shield, CheckCircle } from 'lucide-react';
import { ArticleNavigation } from './ArticleNavigation';

export default function About24_7Page() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <ArticleNavigation />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">Работаем 24/7</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-biosphere-primary">Круглосуточная помощь вашим питомцам</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Мы всегда на связи — в любое время дня и ночи вы можете рассчитывать на нашу поддержку и профессиональную помощь.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Clock className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Без выходных и праздников</h3>
                <p className="text-gray-700 dark:text-gray-300">Мы работаем 365 дней в году, чтобы ваши питомцы всегда были под защитой.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Phone className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Экстренная помощь</h3>
                <p className="text-gray-700 dark:text-gray-300">В случае неотложных ситуаций мы готовы принять вашего питомца в любое время суток.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <HeartPulse className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Забота и внимание</h3>
                <p className="text-gray-700 dark:text-gray-300">Наша команда всегда готова оказать поддержку и заботу вашему любимцу, независимо от времени обращения.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Shield className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Гарантия безопасности</h3>
                <p className="text-gray-700 dark:text-gray-300">Мы обеспечиваем высокий уровень безопасности и комфорта для каждого пациента в любое время суток.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-biosphere-primary/10 dark:bg-biosphere-primary/20 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-biosphere-primary">Почему это важно?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Своевременная помощь спасает жизни</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartPulse className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Спокойствие для владельцев</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          <p>
            Доверьте здоровье вашего питомца профессионалам, которые всегда рядом и готовы помочь в любой момент!
          </p>
        </div>
      </div>
    </section>
  );
} 
