"use client";

import { type ReactNode, type RefObject, useLayoutEffect, useRef } from "react";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const DILATE_MS = 160;
const LAND_MS = 140;
const SQUASH = 3;
const INSET_PATTERN =
  /inset\(\s*([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px/;

interface Box {
  h: number;
  l: number;
  r: number;
  t: number;
}

function readBox(root: HTMLElement, active: HTMLElement): Box {
  const rootRect = root.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  return {
    h: rect.height,
    l: rect.left - rootRect.left,
    r: rect.right - rootRect.left,
    t: rect.top - rootRect.top,
  };
}

function sameRow(a: Box, b: Box) {
  return Math.abs(a.t - b.t) < 1;
}

function clip(box: Box, width: number, radius: string) {
  const right = Math.max(0, width - box.r);
  return `inset(0px ${right}px 0px ${box.l}px round ${radius})`;
}

function parseInset(
  value: string,
  width: number
): { l: number; r: number } | null {
  const match = value.match(INSET_PATTERN);
  if (!match) {
    return null;
  }
  const right = Number(match[2]);
  const left = Number(match[4]);
  if (Number.isNaN(right) || Number.isNaN(left)) {
    return null;
  }
  return { l: left, r: width - right };
}

function placeThumb(
  thumb: HTMLSpanElement,
  root: HTMLElement,
  box: Box,
  from: Box | null,
  animate: boolean
) {
  const { width } = root.getBoundingClientRect();
  const radius =
    getComputedStyle(root).getPropertyValue("--radius-control").trim() || "6px";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const running = thumb.getAnimations();

  let origin = from;
  if (running.length > 0) {
    const live = parseInset(getComputedStyle(thumb).clipPath, width);
    if (live && from) {
      origin = { ...from, l: live.l, r: live.r };
    }
  }
  for (const animation of running) {
    animation.cancel();
  }

  thumb.style.top = `${box.t}px`;
  thumb.style.height = `${box.h}px`;
  thumb.dataset.ready = "true";

  const canStretch =
    animate &&
    !reduce &&
    origin !== null &&
    sameRow(origin, box) &&
    (Math.abs(origin.l - box.l) > 0.5 || Math.abs(origin.r - box.r) > 0.5);

  if (!canStretch || origin === null) {
    thumb.style.clipPath = clip(box, width, radius);
    return;
  }

  const dir = box.l + box.r >= origin.l + origin.r ? 1 : -1;
  const dilated: Box = {
    ...box,
    l: Math.min(origin.l, box.l),
    r: Math.max(origin.r, box.r),
  };
  const squashed: Box =
    dir > 0 ? { ...box, l: box.l + SQUASH } : { ...box, r: box.r - SQUASH };
  const duration = DILATE_MS + LAND_MS;

  thumb.style.clipPath = clip(origin, width, radius);
  const animation = thumb.animate(
    [
      { clipPath: clip(origin, width, radius) },
      {
        clipPath: clip(dilated, width, radius),
        offset: DILATE_MS / duration,
      },
      { clipPath: clip(squashed, width, radius), offset: 0.82 },
      { clipPath: clip(box, width, radius) },
    ],
    { duration, easing: EASE, fill: "forwards" }
  );

  animation.finished
    .then(() => {
      thumb.style.clipPath = clip(box, width, radius);
      animation.cancel();
    })
    .catch(() => {
      thumb.style.clipPath = clip(box, width, radius);
    });
}

function useRubberThumb(
  rootRef: RefObject<HTMLElement | null>,
  thumbRef: RefObject<HTMLSpanElement | null>
) {
  const boxRef = useRef<Box | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const thumb = thumbRef.current;
    if (!(root && thumb)) {
      return;
    }

    let frame = 0;

    const measure = (animate: boolean) => {
      const active = root.querySelector<HTMLElement>("[aria-current]");
      if (!active || active.getBoundingClientRect().width === 0) {
        thumb.dataset.ready = "false";
        boxRef.current = null;
        return;
      }
      const box = readBox(root, active);
      placeThumb(thumb, root, box, boxRef.current, animate);
      boxRef.current = box;
    };

    measure(false);

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measure(false));
    });
    observer.observe(root);

    const mutation = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measure(true));
    });
    mutation.observe(root, {
      attributeFilter: ["aria-current"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      cancelAnimationFrame(frame);
      for (const animation of thumb.getAnimations()) {
        animation.cancel();
      }
    };
  }, [rootRef, thumbRef]);
}

export function Segment({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  useRubberThumb(rootRef, thumbRef);

  return (
    <nav aria-label={label} className="segment" ref={rootRef}>
      <span aria-hidden="true" className="segment-thumb" ref={thumbRef} />
      {children}
    </nav>
  );
}
