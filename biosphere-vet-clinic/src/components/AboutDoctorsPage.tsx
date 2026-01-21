import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, GraduationCap, Award, Stethoscope, Users, CheckCircle } from 'lucide-react';
import { ArticleNavigation } from './ArticleNavigation';

export default function AboutDoctorsPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <ArticleNavigation />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">Опытные врачи</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-biosphere-primary">Более 50 специалистов</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            В нашей клинике работает команда профессионалов с многолетним опытом и высокой квалификацией. Мы заботимся о каждом пациенте и постоянно совершенствуем свои знания.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Heart className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Забота и внимание</h3>
                <p className="text-gray-700 dark:text-gray-300">Каждый врач — не только профессионал, но и человек, искренне любящий животных.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <GraduationCap className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Постоянное обучение</h3>
                <p className="text-gray-700 dark:text-gray-300">Наши специалисты регулярно проходят курсы повышения квалификации и участвуют в конференциях.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Award className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Высокие достижения</h3>
                <p className="text-gray-700 dark:text-gray-300">Многие врачи имеют награды и признание в профессиональном сообществе.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Stethoscope className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Широкий спектр специализаций</h3>
                <p className="text-gray-700 dark:text-gray-300">В нашей команде есть терапевты, хирурги, дерматологи, кардиологи, офтальмологи и другие специалисты.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-biosphere-primary/10 dark:bg-biosphere-primary/20 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-biosphere-primary">Почему выбирают наших врачей?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Большой опыт работы</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Ответственность и профессионализм</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          <p>
            Доверьте здоровье вашего питомца нашим специалистам — мы всегда готовы помочь и найти индивидуальный подход к каждому!
          </p>
        </div>
      </div>
    </section>
  );
} 
