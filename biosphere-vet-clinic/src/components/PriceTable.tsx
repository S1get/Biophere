import React, { useMemo, useState } from 'react';
import { usePricelist } from '@/hooks/usePricelist';

export default function PriceTable() {
  const { items: services, loading, error } = usePricelist();
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('Все разделы');

  const sections = useMemo(() => {
    return ['Все разделы', ...Array.from(new Set(services.map(s => s.section).filter(Boolean)))];
  }, [services]);

  const filtered = services.filter(s =>
    (section === 'Все разделы' || s.section === section) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || (s.note && s.note.toLowerCase().includes(search.toLowerCase())))
  );

  // Группировка по разделам для отображения секций
  const grouped = filtered.reduce((acc: Record<string, typeof services>, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-900 p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <input
          type="text"
          placeholder="Поиск по названию или примечанию..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-6 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700 mb-2 md:mb-0 transition-colors"
        />
        <select
          value={section}
          onChange={e => setSection(e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
        >
          {sections.map(sec => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          Загрузка прейскуранта...
        </div>
      )}

      {!loading && error && (
        <div className="py-10 text-center text-red-600">
          Не удалось загрузить прейскурант. {error}
        </div>
      )}

      <table className="w-full border-collapse text-sm md:text-base">
        <thead>
          <tr>
            <th className="bg-biosphere-warm/10 text-left px-4 py-2 font-bold w-3/4 text-gray-900 dark:text-white">Название</th>
            <th className="bg-biosphere-warm/10 text-left px-4 py-2 font-bold w-1/4 text-gray-900 dark:text-white">Цена, руб.</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([sec, items]) => (
            <React.Fragment key={String(sec)}>
              <tr>
                <td colSpan={2} className="bg-biosphere-primary/10 font-semibold px-4 py-2 text-biosphere-primary">{sec}</td>
              </tr>
              {(items as typeof services).map((item, idx) => (
                <tr key={idx}>
                  <td className="border-t px-4 py-2">
                    {item.name}
                    {item.note && <span className="float-right text-gray-500">{item.note}</span>}
                  </td>
                  <td className="border-t px-4 py-2">{item.price}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center text-gray-400 py-8">Ничего не найдено</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 