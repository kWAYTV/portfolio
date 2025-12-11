"use client";

import { FileText, Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const icons = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  fileText: FileText,
} as const;

type IconName = keyof typeof icons;

type MorphingLinkProps = {
  href: string;
  text: string;
  icon: IconName;
  className?: string;
  iconSize?: number;
};

export function MorphingLink({
  href,
  text,
  icon,
  className,
  iconSize = 20,
}: MorphingLinkProps) {
  const Icon = icons[icon];
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef.current && text) {
      const { offsetWidth, offsetHeight } = textRef.current;
      setDimensions({
        width: Math.max(offsetWidth, iconSize),
        height: Math.max(offsetHeight, iconSize),
      });
    }
  }, [text, iconSize]);

  return (
    <a
      className={cn(
        "relative inline-flex items-center justify-center",
        "text-foreground transition-colors duration-300 hover:text-primary",
        className
      )}
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      rel="noopener noreferrer"
      target="_blank"
      style={{
        width: dimensions.width || "auto",
        height: dimensions.height || "auto",
      }}
    >
      {/* Hidden text for measurement */}
      <span className="invisible absolute whitespace-nowrap" ref={textRef}>
        {text}
      </span>

      {/* Visible text */}
      <span
        className={cn(
          "absolute whitespace-nowrap transition-all duration-300 ease-out",
          isHovered
            ? "scale-75 opacity-0 blur-sm"
            : "scale-100 opacity-100 blur-0"
        )}
      >
        {text}
      </span>

      {/* Icon */}
      <Icon
        className={cn(
          "absolute transition-all duration-300 ease-out",
          isHovered
            ? "rotate-0 scale-100 opacity-100 blur-0"
            : "-rotate-90 scale-75 opacity-0 blur-sm"
        )}
        style={{ width: iconSize, height: iconSize }}
      />
    </a>
  );
}
