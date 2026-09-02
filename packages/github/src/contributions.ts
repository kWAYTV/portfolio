/** 0 = none, 1–4 = GitHub's own quartile buckets for the year. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  count: number;
  date: string;
  level: ContributionLevel;
  weekday: number;
}

export interface ContributionCalendar {
  days: ContributionDay[];
  total: number;
}

type GraphQlLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

interface GraphQlDay {
  contributionCount: number;
  contributionLevel: GraphQlLevel;
  date: string;
  weekday: number;
}

interface GraphQlResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: GraphQlDay[];
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

const LEVELS: Record<GraphQlLevel, ContributionLevel> = {
  FIRST_QUARTILE: 1,
  FOURTH_QUARTILE: 4,
  NONE: 0,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
};

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

export async function getGitHubContributions({
  token,
  username,
}: {
  token: string;
  username: string;
}): Promise<ContributionCalendar | null> {
  const response = await fetch("https://api.github.com/graphql", {
    body: JSON.stringify({
      query: QUERY,
      variables: { login: username },
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as GraphQlResponse;
  const calendar =
    payload.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    return null;
  }

  const days = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      count: day.contributionCount,
      date: day.date,
      level: LEVELS[day.contributionLevel] ?? 0,
      weekday: day.weekday,
    }))
  );

  return {
    days,
    total: calendar.totalContributions,
  };
}
