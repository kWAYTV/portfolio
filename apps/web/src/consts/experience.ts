export const experience = [
  {
    id: "freelancing-1",
    period: "2019 - Present",
    role: "Freelance Developer / Open Source Contributor",
    company: "Freelance",
  },
  {
    id: "tokyo-school",
    period: "2024 - Present",
    role: "PCAP Python, Computer Programming",
    company: "Tokyo School",
  },
  {
    id: "insergal-sales",
    period: "2018 - 2019",
    role: "Sales Assistant, Marketing",
    company: "Insergal",
  },
  {
    id: "insergal-mechanic",
    period: "2018 - 2019",
    role: "Automotive Mechanic",
    company: "Insergal",
  },
] as const;

export type Experience = (typeof experience)[number];
