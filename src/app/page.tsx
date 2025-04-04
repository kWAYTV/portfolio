import { Description } from '@/components/core/home/description';
import { Hero } from '@/components/core/home/hero';

export default async function HomePage() {
  return (
    <section>
      <div className='animate-in fade-in slide-in-from-top-4 duration-500'>
        <Hero />
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-4 animation-delay-200 duration-500'>
        <Description />
      </div>
    </section>
  );
}
