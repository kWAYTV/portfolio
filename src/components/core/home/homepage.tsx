import { Separator } from "@/components/ui/separator";

import { Contact } from "./contact";
import { Description } from "./description";
import { Hero } from "./hero";

export function Homepage() {
  return (
    <section>
      <div className="fade-in slide-in-from-top-4 animate-in duration-500">
        <Hero />
      </div>

      <Separator className="my-8" />

      <div className="fade-in slide-in-from-bottom-4 animation-delay-200 animate-in duration-500">
        <Description />
      </div>

      <Separator className="my-8" />

      <div className="fade-in slide-in-from-bottom-4 animation-delay-300 animate-in duration-500">
        <Contact />
      </div>
    </section>
  );
}
