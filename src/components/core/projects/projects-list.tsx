import { getGitHubRepositories } from "@/actions/github";
import { RepositoriesTable } from "@/components/core/projects/repositories-table";

export async function ProjectsList() {
  try {
    const repositories = await getGitHubRepositories();

    if (repositories.length === 0) {
      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              No repositories found
            </p>
          </div>
        </div>
      );
    }

    return <RepositoriesTable repositories={repositories} />;
  } catch {
    // biome-ignore lint/suspicious/noConsole: <>
    console.error("Failed to load repositories");

    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Failed to load repositories. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
