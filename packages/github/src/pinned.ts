export interface PinnedRepo {
  description: string | null;
  fullName: string;
  language: string | null;
  name: string;
  stars: number;
  url: string;
}

interface GraphQlResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes: Array<{
          description: string | null;
          name: string;
          nameWithOwner: string;
          primaryLanguage: { name: string } | null;
          stargazerCount: number;
          url: string;
        } | null>;
      };
    };
  };
}

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            description
            url
            stargazerCount
            primaryLanguage { name }
          }
        }
      }
    }
  }
`;

export async function getGitHubPinnedRepos({
  token,
  username,
}: {
  token: string;
  username: string;
}): Promise<PinnedRepo[]> {
  const response = await fetch("https://api.github.com/graphql", {
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as GraphQlResponse;
  const nodes = payload.data?.user?.pinnedItems?.nodes ?? [];

  return nodes.flatMap((node) =>
    node
      ? [
          {
            description: node.description,
            fullName: node.nameWithOwner,
            language: node.primaryLanguage?.name ?? null,
            name: node.nameWithOwner.startsWith(`${username}/`)
              ? node.name
              : node.nameWithOwner,
            stars: node.stargazerCount,
            url: node.url,
          },
        ]
      : []
  );
}
