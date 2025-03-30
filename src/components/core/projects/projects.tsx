import { fetchGithubRepos } from '@/actions/github';
import { ClientSearch } from '@/components/core/projects/client-search';

export async function Projects() {
  const result = await fetchGithubRepos();

  if ('error' in result) {
    return <div>Error loading repositories: {result.error}</div>;
  }

  const { repos } = result;

  return (
    <div className='space-y-4'>
      <ClientSearch repos={repos} />
    </div>
  );
}
