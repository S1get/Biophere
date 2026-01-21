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
      {/* PC/Tablet: Home Top-Left (below header) */}
      <Link
        to="/"
        className="hidden md:flex fixed z-50 left-6 top-24 w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all bg-white dark:bg-gray-800 text-biosphere-primary border border-gray-200 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white group"
        title="На главную"
      >
        <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Mobile: Home Bottom-Left */}
      <Link
        to="/"
        className="md:hidden fixed z-50 left-6 bottom-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all bg-white dark:bg-gray-800 text-biosphere-primary border border-gray-200 dark:border-gray-700 active:scale-95"
        title="На главную"
      >
        <Home className="w-6 h-6" />
      </Link>

      {/* PC/Tablet: Prev Bottom-Left */}
      {prev && (
        <Link
          to={prev.path}
          className="hidden md:flex fixed z-50 left-6 bottom-6 w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all bg-white dark:bg-gray-800 text-biosphere-primary border border-gray-200 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white group"
          title={`Назад: ${prev.title}`}
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
      )}

      {/* All: Next Bottom-Right */}
      {next && (
        <Link
          to={next.path}
          className="fixed z-50 right-6 bottom-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all bg-white dark:bg-gray-800 text-biosphere-primary border border-gray-200 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white group active:scale-95"
          title={`Далее: ${next.title}`}
        >
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </>
  );
}
