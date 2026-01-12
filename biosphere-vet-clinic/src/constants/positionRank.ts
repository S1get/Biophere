export const rank: Record<string, number> = {
  "Главный хирург сети клиник": 1,
  "Главный врач": 2,
  "Ведущий терапевт": 3,
  "Ветеринарный врач-хирург": 4,
  "Ветеринарный врач": 5,
  "Администратор": 6
};

export const getPositionRank = (title: string): number => rank[title] ?? 100;

export const comparePositions = (a: string, b: string): number => {
  const ra = getPositionRank(a);
  const rb = getPositionRank(b);
  if (ra !== rb) return ra - rb;
  return a.localeCompare(b, "ru", { sensitivity: "base" });
};