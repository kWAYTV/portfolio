"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";

const EASE = "motion-out";
const ENTER_STAGGER = 0.05;
const REVEAL_STAGGER = 0.045;

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);
  CustomEase.create(EASE, "M0,0 C0.23,1 0.32,1 1,1");
}

const seenEnter = new Set<string>();

function showEnter(node: HTMLElement) {
  gsap.set(node, { opacity: 1 });
}

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    (context, contextSafe) => {
      if (!contextSafe) {
        return;
      }

      // React 19 types current as T | null; Biome treats the mounted ref as always set.
      // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is null before mount
      if (!root.current) {
        return;
      }
      const scope = root.current;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const clearTransform = contextSafe((nodes: HTMLElement[]) => {
        gsap.set(nodes, { clearProps: "transform" });
      });
      const clearReveal = contextSafe((nodes: HTMLElement[]) => {
        gsap.set(nodes, { clearProps: "opacity,transform" });
      });
      const claimed: string[] = [];
      const running = new WeakSet<HTMLElement>();
      const settled = new WeakSet<HTMLElement>();

      const bindEnter = () => {
        const fresh: HTMLElement[] = [];

        for (const node of scope.querySelectorAll<HTMLElement>(
          "[data-enter]"
        )) {
          const key = node.dataset.enter ?? "";
          if (seenEnter.has(key)) {
            if (!(running.has(node) || settled.has(node))) {
              showEnter(node);
              settled.add(node);
            }
            continue;
          }

          seenEnter.add(key);
          claimed.push(key);
          running.add(node);
          fresh.push(node);
        }

        if (fresh.length === 0) {
          return;
        }

        context.add(() => {
          gsap.fromTo(
            fresh,
            { opacity: 0, y: 8 },
            {
              duration: 0.3,
              ease: EASE,
              onComplete: () => clearTransform(fresh),
              opacity: 1,
              stagger: ENTER_STAGGER,
              y: 0,
            }
          );
        });
      };

      const bindReveal = (section: HTMLElement) => {
        if (section.dataset.motionBound === "true") {
          return;
        }
        section.dataset.motionBound = "true";

        const items = [
          ...section.querySelectorAll<HTMLElement>("[data-reveal-item]"),
        ];
        const targets = items.length > 0 ? items : [section];
        const below =
          section.getBoundingClientRect().top > window.innerHeight * 0.88;

        if (!below) {
          return;
        }

        context.add(() => {
          gsap.set(targets, { opacity: 0, y: 8 });
          gsap.to(targets, {
            duration: 0.36,
            ease: EASE,
            onComplete: () => clearReveal(targets),
            opacity: 1,
            scrollTrigger: {
              once: true,
              start: "top 88%",
              trigger: section,
            },
            stagger: items.length > 0 ? REVEAL_STAGGER : 0,
            y: 0,
          });
        });
      };

      const scan = () => {
        if (context.isReverted) {
          return;
        }

        const triggers = ScrollTrigger.getAll().length;
        bindEnter();
        for (const section of scope.querySelectorAll<HTMLElement>(
          "[data-reveal]"
        )) {
          bindReveal(section);
        }
        if (ScrollTrigger.getAll().length !== triggers) {
          ScrollTrigger.refresh();
        }
      };

      scan();

      const observer = new MutationObserver(scan);
      observer.observe(scope, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        for (const node of scope.querySelectorAll<HTMLElement>(
          "[data-motion-bound]"
        )) {
          delete node.dataset.motionBound;
        }
        for (const key of claimed) {
          seenEnter.delete(key);
        }
      };
    },
    { dependencies: [pathname], revertOnUpdate: true, scope: root }
  );

  return (
    <div className="page-motion" ref={root}>
      {children}
    </div>
  );
}
