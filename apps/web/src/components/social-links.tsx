"use client";

import { analytics } from "@repo/analytics";
import { useCallback } from "react";
import { socialLinks } from "@/modules/home/consts/social-links";

function SocialLink({ href, text }: { href: string; text: string }) {
  const handleClick = useCallback(() => {
    analytics.socialClick(text);
    if (text === "resume") {
      analytics.resumeDownload();
    }
  }, [text]);

  return (
    <a
      href={href}
      onClick={handleClick}
      rel="noopener noreferrer"
      target="_blank"
    >
      {text}
    </a>
  );
}

export function SocialLinks() {
  return (
    <nav aria-label="Social" className="social-links">
      {socialLinks.map((link) => (
        <SocialLink href={link.href} key={link.text} text={link.text} />
      ))}
    </nav>
  );
}
