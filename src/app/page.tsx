import { Description } from '@/components/core/home/description';
import { Hero } from '@/components/core/home/hero';
import { GithubGraph } from '@/components/ui/github';
import { githubUsername } from '@/lib/metadata';

export default async function HomePage() {
  return (
    <section>
      <div className='animate-in fade-in slide-in-from-top-4 duration-500'>
        <Hero />
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-4 animation-delay-200 duration-500'>
        <Description />
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-4 animation-delay-400 duration-500'>
        <div className='my-8 w-full'>
          <h3 className='mb-4 text-xl font-semibold'>Activity</h3>
          <GithubGraph
            username={githubUsername}
            blockMargin={2}
            darkColorPalette={[
              '#1e1e2f',
              '#5a3e7a',
              '#7e5aa2',
              '#a87cc3',
              '#d9a9e6'
            ]}
          />
        </div>
      </div>
    </section>
  );
}
