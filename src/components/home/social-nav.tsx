import { MorphingLink } from "@/components/ui/morphing-link";
import { socialLinks } from "@/consts/social-links";

export function SocialNav() {
  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
      {socialLinks.map((link) => (
        <MorphingLink
          href={link.href}
          icon={link.icon}
          key={link.text}
          text={link.text}
        />
      ))}
    </nav>
  );
}
