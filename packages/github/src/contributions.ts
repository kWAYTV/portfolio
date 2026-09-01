export interface ContributionDay {
  count: number;
  date: string;
  weekday: number;
}

export interface ContributionCalendar {
  days: ContributionDay[];
  total: number;
}

interface GraphQlDay {
  contributionCount: number;
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

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
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
      weekday: day.weekday,
    }))
  );

  return {
    days,
    total: calendar.totalContributions,
  };
}
