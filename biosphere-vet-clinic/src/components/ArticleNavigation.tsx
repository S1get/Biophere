import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, ArrowRight } from 'lucide-react';

const articles = [
  { path: '/about-equipment', title: 'Оборудование' },
  { path: '/about-24-7', title: 'Режим 24/7' },
  { path: '/about-doctors', title: 'Наши врачи' },
  { path: '/about-branches', title: 'Наши филиалы' },
];

export function ArticleNavigation() {
  const location = useLocation();
  const currentIndex = articles.findIndex(a => a.path === location.pathname);

  if (currentIndex === -1) return null;

  const prev = articles[currentIndex - 1];
  const next = articles[currentIndex + 1];

  return (
    <>
      {/* Home Button - Top Left for all devices */}
      <Link
        to="/"
        className="fixed z-50 left-6 top-24 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all bg-white dark:bg-gray-800 text-biosphere-primary border-2 border-biosphere-primary/20 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white group active:scale-90"
        title="На главную"
      >
        <Home className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Prev Bottom-Left */}
      {prev && (
        <Link
          to={prev.path}
          className="fixed z-50 left-6 bottom-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all bg-white dark:bg-gray-800 text-biosphere-primary border-2 border-biosphere-primary/20 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white group active:scale-90"
          title={`Назад: ${prev.title}`}
        >
          <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
        </Link>
      )}

      {/* All: Next Bottom-Right */}
      {next && (
        <Link
          to={next.path}
          className="fixed z-50 right-6 bottom-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all bg-white dark:bg-gray-800 text-biosphere-primary border-2 border-biosphere-primary/20 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white group active:scale-90"
          title={`Далее: ${next.title}`}
        >
          <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </>
  );
}
