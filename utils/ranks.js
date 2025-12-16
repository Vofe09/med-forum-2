// utils/ranks.js (рекомендую вынести, но можно и прямо в profile.js)
export const RANKS = [
  {
    name: "Новичок",
    min: 0,
    max: 99,
    color: "#94a3b8"
  },
  {
    name: "Студент",
    min: 100,
    max: 499,
    color: "#4fd1c5"
  },
  {
    name: "Продвинутый",
    min: 500,
    max: 1999,
    color: "#34d399"
  },
  {
    name: "Наставник",
    min: 2000,
    max: 4999,
    color: "#22c55e"
  },
  {
    name: "Врач-эксперт",
    min: 5000,
    max: Infinity,
    color: "#1f7a73"
  }
];

export function getRankByReputation(rep) {
  return RANKS.find(
    r => rep >= r.min && rep <= r.max
  ) || RANKS[0];
}
