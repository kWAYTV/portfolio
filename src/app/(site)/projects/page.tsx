import { Suspense } from 'react';

import { ProjectsList } from '@/components/core/projects/projects-list';
import { ProjectsSkeleton } from '@/components/core/projects/projects-skeleton';

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
