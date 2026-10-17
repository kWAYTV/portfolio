"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useState,
} from "react";

interface Tip {
  label: string;
  x: number;
  y: number;
}

const GAP = 8;

function markFrom(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<HTMLElement>(".skill-mark")
    : null;
}

/**
 * One tip for the whole rail. Hovering or focusing a `.skill-mark` reads its
 * `data-title` and parks the label above it; 48 marks previously each carried
 * their own tooltip instance, which was most of the home page's hydration.
 */
export function SkillTip({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null);

  const show = useCallback((host: HTMLElement, target: EventTarget | null) => {
    const mark = markFrom(target);
    const label = mark?.dataset.title;
    if (!(mark && label)) {
      return;
    }
    const hostRect = host.getBoundingClientRect();
    const rect = mark.getBoundingClientRect();
    setTip({
      label,
      x: rect.left + rect.width / 2 - hostRect.left,
      y: rect.top - hostRect.top - GAP,
    });
  }, []);

  const hide = useCallback(() => {
    setTip(null);
  }, []);

  const handlePointerOver = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") {
        show(event.currentTarget, event.target);
      }
    },
    [show]
  );

  const handlePointerOut = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!markFrom(event.relatedTarget)) {
        hide();
      }
    },
    [hide]
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      show(event.currentTarget, event.target);
    },
    [show]
  );

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: delegates hover and focus from the links inside
    // biome-ignore lint/a11y/noStaticElementInteractions: same — the div itself is not a control
    <div
      className="rail"
      onBlur={hide}
      onFocus={handleFocus}
      onPointerOut={handlePointerOut}
      onPointerOver={handlePointerOver}
    >
      {children}
      {tip ? (
        <span
          aria-hidden="true"
          className="rail-tip"
          key={tip.label}
          style={{ "--x": `${tip.x}px`, "--y": `${tip.y}px` } as CSSProperties}
        >
          {tip.label}
        </span>
      ) : null}
    </div>
  );
}
