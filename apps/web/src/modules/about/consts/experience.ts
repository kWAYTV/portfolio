export const experience = [
  {
    id: "freelancing-1",
    key: "freelancing",
  },
  {
    id: "tokyo-school",
    key: "tokyoSchool",
  },
  {
    id: "insergal-sales",
    key: "insergalSales",
  },
  {
    id: "insergal-mechanic",
    key: "insergalMechanic",
  },
] as const;

export type Experience = (typeof experience)[number];
