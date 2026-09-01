import type { ContributionDay } from "./contributions";

export interface ContributionStats {
  activeDays: number;
  busiest: ContributionDay | null;
  currentStreak: number;
  longestStreak: number;
  max: number;
}

export function summarizeContributions(
  days: ContributionDay[]
): ContributionStats {
  let activeDays = 0;
  let longestStreak = 0;
  let run = 0;
  let max = 0;
  let busiest: ContributionDay | null = null;

  for (const day of days) {
    if (day.count > 0) {
      activeDays += 1;
      run += 1;
      longestStreak = Math.max(longestStreak, run);
      if (day.count > max) {
        max = day.count;
        busiest = day;
      }
    } else {
      run = 0;
    }
  }

  let index = days.length - 1;
  if (index >= 0 && days[index]?.count === 0) {
    index -= 1;
  }
  let currentStreak = 0;
  while (index >= 0 && (days[index]?.count ?? 0) > 0) {
    currentStreak += 1;
    index -= 1;
  }

  return { activeDays, busiest, currentStreak, longestStreak, max };
}
