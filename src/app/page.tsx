import { RecentPosts } from '@/components/core/blog/recent-posts';
import { AnimationWrapper } from '@/components/core/home/animation-wrapper';
import { Description } from '@/components/core/home/description';
import { Hero } from '@/components/core/home/hero';

export default async function HomePage() {
  return (
    <section>
      <AnimationWrapper direction='down'>
        <Hero />
      </AnimationWrapper>
      <AnimationWrapper delay={0.2}>
        <Description />
      </AnimationWrapper>
      <div className='my-8'>
        <RecentPosts />
      </div>
    </section>
  );
}
