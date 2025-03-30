import { Projects } from '@/components/core/projects/projects';

// Cache this page for 1 hour at the edge
export const revalidate = 3600;

export default function ProjectsPage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
        My Projects
      </h1>
      <Projects />
    </section>
  );
}
