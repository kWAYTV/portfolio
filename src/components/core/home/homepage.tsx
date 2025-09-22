import { Separator } from '@/components/ui/separator';

import { Contact } from './contact';
import { Description } from './description';
import { Hero } from './hero';

export function Homepage() {
  return (
    <section>
      <div className='animate-in fade-in slide-in-from-top-4 duration-500'>
        <Hero />
      </div>

      <Separator className='my-8' />

      <div className='animate-in fade-in slide-in-from-bottom-4 animation-delay-200 duration-500'>
        <Description />
      </div>

      <Separator className='my-8' />

      <div className='animate-in fade-in slide-in-from-bottom-4 animation-delay-300 duration-500'>
        <Contact />
      </div>
    </section>
  );
}
