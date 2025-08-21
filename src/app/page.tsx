import { Contacts } from '@/components/core/home/contacts';
import { Description } from '@/components/core/home/description';
import { Hero } from '@/components/core/home/hero';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
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
        <Contacts />
      </div>
    </section>
  );
}
