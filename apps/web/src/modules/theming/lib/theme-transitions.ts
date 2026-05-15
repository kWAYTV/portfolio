/**
 * Single solid transition for theme toggle.
 */

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export type ThemeTransitionFn = (
  duration: number,
  root: { old: string; newView: string }
) => void;

export const themeTransition: ThemeTransitionFn = (
  duration,
  { old, newView }
) => {
  document.documentElement.animate(
    { opacity: [1, 0] },
    { duration, easing: EASE, pseudoElement: old }
  );
  document.documentElement.animate(
    { opacity: [0, 1] },
    { duration, easing: EASE, pseudoElement: newView }
  );
};
