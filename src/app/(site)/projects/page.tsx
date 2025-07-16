import { Suspense } from 'react';

import { ProjectsList } from '@/components/core/projects/projects-list';
import { ProjectsSkeleton } from '@/components/core/projects/projects-skeleton';

// Revalidate every 10 minutes
export const revalidate = 600;

export default function ProjectsPage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>Projects</h1>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsList />
      </Suspense>
    </section>
  );
}
