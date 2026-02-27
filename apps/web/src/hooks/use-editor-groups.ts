"use client";

import { useRouter } from "@i18n/routing";
import { useCallback, useRef, useState } from "react";
import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import { navItems } from "@/consts/nav-items";
import { useTabSync } from "@/hooks/use-tab-sync";

const initialTabs = navItems.map((item) => item.href);

export function useEditorGroups(pathname: string) {
  const router = useRouter();
  const [editorGroups, setEditorGroups] = useState<EditorGroup[]>(() => [
    { tabs: initialTabs, activeIndex: 0 },
  ]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const closingRef = useRef(false);
  const openedFromSidebarRef = useRef<string | null>(null);
  const activeGroupIndexRef = useRef(0);
  activeGroupIndexRef.current = activeGroupIndex;

  const activeGroup = editorGroups[activeGroupIndex];
  const activeHref =
    activeGroup?.tabs[activeGroup?.activeIndex] ?? activeGroup?.tabs[0];

  useTabSync({
    pathname,
    editorGroups,
    activeGroupIndex,
    setEditorGroups,
    closingRef,
    openedFromSidebarRef,
  });

  const openTab = useCallback((href: string) => {
    openedFromSidebarRef.current = href;
    const idx = activeGroupIndexRef.current;
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[idx];
      if (!g) {
        return prev;
      }
      if (g.tabs.includes(href)) {
        const i = g.tabs.indexOf(href);
        next[idx] = { ...g, activeIndex: i };
        return next;
      }
      const newTabs = [...g.tabs, href];
      next[idx] = { tabs: newTabs, activeIndex: newTabs.length - 1 };
      return next;
    });
  }, []);

  const closeTab = useCallback(
    (groupIndex: number, href: string) => {
      const group = editorGroups[groupIndex];
      if (!group) {
        return;
      }
      const idx = group.tabs.indexOf(href);
      if (idx === -1) {
        return;
      }

      const nextTabs = group.tabs.filter((h) => h !== href);
      const isActive =
        href === "/" ? pathname === "/" : pathname.startsWith(href);

      setEditorGroups((prev) => {
        const next = [...prev];
        if (nextTabs.length === 0) {
          next.splice(groupIndex, 1);
          if (next.length === 0) {
            return [{ tabs: [], activeIndex: 0 }];
          }
          if (activeGroupIndex >= next.length) {
            setActiveGroupIndex(next.length - 1);
          }
          return next;
        }
        const newActiveIndex = Math.min(idx, nextTabs.length - 1);
        next[groupIndex] = { tabs: nextTabs, activeIndex: newActiveIndex };
        return next;
      });

      if (isActive) {
        closingRef.current = true;
        if (nextTabs.length > 0) {
          const target = nextTabs[Math.min(idx, nextTabs.length - 1)];
          router.push(target);
        } else if (editorGroups.length > 1) {
          const otherGroup = editorGroups[groupIndex === 0 ? 1 : 0];
          const target =
            otherGroup?.tabs[otherGroup.activeIndex] ?? otherGroup?.tabs[0];
          if (target) {
            router.push(target);
          }
        }
      }
    },
    [pathname, editorGroups, activeGroupIndex, router]
  );

  const reorderTabs = useCallback((groupIndex: number, newOrder: string[]) => {
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      if (!g) {
        return prev;
      }
      const newActiveIndex = newOrder.indexOf(g.tabs[g.activeIndex]);
      next[groupIndex] = {
        tabs: newOrder,
        activeIndex: newActiveIndex >= 0 ? newActiveIndex : 0,
      };
      return next;
    });
  }, []);

  const closeAllTabs = useCallback((groupIndex?: number) => {
    closingRef.current = true;
    if (groupIndex !== undefined) {
      setEditorGroups((prev) => {
        const next = prev.filter((_, i) => i !== groupIndex);
        return next.length > 0 ? next : [{ tabs: [], activeIndex: 0 }];
      });
      setActiveGroupIndex((prev) =>
        prev >= groupIndex && prev > 0 ? prev - 1 : prev
      );
    } else {
      setEditorGroups([{ tabs: [], activeIndex: 0 }]);
    }
  }, []);

  const closeGroup = useCallback(
    (groupIndex: number) => {
      const group = editorGroups[groupIndex];
      if (!group || editorGroups.length <= 1) {
        return;
      }
      const targetGroupIndex = groupIndex === 0 ? 1 : 0;
      const targetGroup = editorGroups[targetGroupIndex];
      if (!targetGroup) {
        return;
      }
      const mergedTabs = [...new Set([...targetGroup.tabs, ...group.tabs])];
      setEditorGroups((prev) => {
        const next = prev.filter((_, i) => i !== groupIndex);
        next[0] = {
          tabs: mergedTabs,
          activeIndex: Math.min(targetGroup.activeIndex, mergedTabs.length - 1),
        };
        return next;
      });
      setActiveGroupIndex(0);
      const targetHref =
        targetGroup.tabs[targetGroup.activeIndex] ?? targetGroup.tabs[0];
      if (targetHref) {
        closingRef.current = true;
        router.push(targetHref);
      }
    },
    [editorGroups, router]
  );

  const closeOtherTabs = useCallback(
    (groupIndex: number, keepHref: string) => {
      setEditorGroups((prev) => {
        const next = [...prev];
        next[groupIndex] = { tabs: [keepHref], activeIndex: 0 };
        return next;
      });
      const isActive =
        keepHref === "/" ? pathname === "/" : pathname.startsWith(keepHref);
      if (!isActive) {
        closingRef.current = true;
        router.push(keepHref);
      }
    },
    [pathname, router]
  );

  const closeTabsToRight = useCallback((groupIndex: number, href: string) => {
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      if (!g) {
        return prev;
      }
      const idx = g.tabs.indexOf(href);
      if (idx === -1) {
        return prev;
      }
      const newTabs = g.tabs.slice(0, idx + 1);
      next[groupIndex] = {
        tabs: newTabs,
        activeIndex: Math.min(g.activeIndex, newTabs.length - 1),
      };
      return next;
    });
  }, []);

  const splitRight = useCallback(
    (groupIndex: number, href: string) => {
      setEditorGroups((prev) => {
        const next = prev.map((g) => ({ ...g }));
        const rightIdx = groupIndex + 1;
        if (rightIdx < next.length) {
          const right = next[rightIdx];
          if (right && !right.tabs.includes(href)) {
            next[rightIdx] = {
              tabs: [...right.tabs, href],
              activeIndex: right.tabs.length,
            };
          }
          return next;
        }
        const newGroup: EditorGroup = { tabs: [href], activeIndex: 0 };
        next.splice(groupIndex + 1, 0, newGroup);
        return next;
      });
      setActiveGroupIndex(groupIndex + 1);
      router.push(href);
    },
    [router]
  );

  const splitLeft = useCallback(
    (groupIndex: number, href: string) => {
      setEditorGroups((prev) => {
        const next = prev.map((g) => ({ ...g }));
        if (groupIndex > 0) {
          const left = next[groupIndex - 1];
          if (left && !left.tabs.includes(href)) {
            next[groupIndex - 1] = {
              tabs: [...left.tabs, href],
              activeIndex: left.tabs.length,
            };
          }
          return next;
        }
        const newGroup: EditorGroup = { tabs: [href], activeIndex: 0 };
        next.splice(0, 0, newGroup);
        return next;
      });
      setActiveGroupIndex(Math.max(0, groupIndex - 1));
      router.push(href);
    },
    [router]
  );

  const moveTabToGroup = useCallback(
    (targetGroupIndex: number, href: string, sourceGroupIndex: number) => {
      if (targetGroupIndex === sourceGroupIndex) {
        return;
      }
      setEditorGroups((prev) => {
        const next = prev.map((g) => ({ ...g }));
        const src = next[sourceGroupIndex];
        const dst = next[targetGroupIndex];
        if (!(src && dst)) {
          return prev;
        }
        const tabIdx = src.tabs.indexOf(href);
        if (tabIdx === -1) {
          return prev;
        }
        const newSrcTabs = src.tabs.filter((h) => h !== href);
        const newDstTabs = [...dst.tabs, href];
        if (newSrcTabs.length === 0) {
          next.splice(sourceGroupIndex, 1);
          const newTargetIdx =
            targetGroupIndex > sourceGroupIndex
              ? targetGroupIndex - 1
              : targetGroupIndex;
          next[newTargetIdx] = {
            tabs: newDstTabs,
            activeIndex: newDstTabs.length - 1,
          };
        } else {
          next[sourceGroupIndex] = {
            tabs: newSrcTabs,
            activeIndex: Math.min(src.activeIndex, newSrcTabs.length - 1),
          };
          next[targetGroupIndex] = {
            tabs: newDstTabs,
            activeIndex: newDstTabs.length - 1,
          };
        }
        return next;
      });
      const willRemoveSource =
        editorGroups[sourceGroupIndex]?.tabs.length === 1;
      const newTargetIdx =
        willRemoveSource && targetGroupIndex > sourceGroupIndex
          ? targetGroupIndex - 1
          : targetGroupIndex;
      setActiveGroupIndex(newTargetIdx);
      router.push(href);
    },
    [router, editorGroups]
  );

  const focusGroup = useCallback(
    (groupIndex: number, href?: string) => {
      setActiveGroupIndex(groupIndex);
      const group = editorGroups[groupIndex];
      if (!group?.tabs.length) {
        return;
      }
      const targetHref = href ?? group.tabs[group.activeIndex] ?? group.tabs[0];
      const tabIdx = group.tabs.indexOf(targetHref);
      if (tabIdx >= 0) {
        setEditorGroups((prev) => {
          const next = [...prev];
          const g = next[groupIndex];
          if (g) {
            next[groupIndex] = { ...g, activeIndex: tabIdx };
          }
          return next;
        });
      }
      router.push(targetHref);
    },
    [editorGroups, router]
  );

  return {
    activeGroup,
    activeGroupIndex,
    activeHref,
    closeAllTabs,
    closeGroup,
    closeOtherTabs,
    closeTab,
    closeTabsToRight,
    editorGroups,
    focusGroup,
    moveTabToGroup,
    openTab,
    reorderTabs,
    setSplitRatio,
    splitLeft,
    splitRatio,
    splitRight,
  };
}
