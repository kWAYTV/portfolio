import { StarIcon } from "@/components/icons";

export interface RepoItem {
  description: string | null;
  key: string;
  language: string | null;
  name: string;
  stars: number;
  url: string;
}

function initial(name: string) {
  const bare = name.includes("/") ? (name.split("/").at(-1) ?? name) : name;
  return bare.charAt(0).toUpperCase();
}

export function RepoList({
  locale,
  repos,
}: {
  locale: string;
  repos: RepoItem[];
}) {
  const numbers = new Intl.NumberFormat(locale);

  return (
    <ul className="repos">
      {repos.map((repo) => (
        <li key={repo.key}>
          <a
            className="repo"
            href={repo.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span aria-hidden="true" className="mark">
              {initial(repo.name)}
            </span>
            <span className="repo-body">
              <span className="repo-name">{repo.name}</span>
              {repo.description ? (
                <span className="repo-sub">{repo.description}</span>
              ) : null}
            </span>
            <span className="repo-meta">
              {repo.language ? <span>{repo.language}</span> : null}
              <span className="repo-stars">
                <StarIcon />
                {numbers.format(repo.stars)}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
