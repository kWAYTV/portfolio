"use client";

import { analytics } from "@repo/analytics";
import { useCallback } from "react";
import { FileIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import {
  type SocialIcon,
  socialLinks,
} from "@/modules/home/consts/social-links";

const ICONS = {
  fileText: FileIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
} satisfies Record<SocialIcon, typeof GitHubIcon>;

function SocialLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: SocialIcon;
  text: string;
}) {
  const Icon = ICONS[icon];
  const handleClick = useCallback(() => {
    analytics.socialClick(text);
    if (text === "resume") {
      analytics.resumeDownload();
    }
  }, [text]);

  return (
    <a
      className="chip"
      href={href}
      onClick={handleClick}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon />
      {text}
    </a>
  );
}

export function SocialLinks() {
  return (
    <nav aria-label="Social" className="chips">
      {socialLinks.map((link) => (
        <SocialLink
          href={link.href}
          icon={link.icon}
          key={link.text}
          text={link.text}
        />
      ))}
    </nav>
  );
}
