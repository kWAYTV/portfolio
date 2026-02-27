"use client";

import { useCallback, useMemo, useState } from "react";
import type { FolderItem, TreeItem } from "@/consts/explorer-tree";

function getFolderNames(folder: FolderItem): string[] {
  return [
    folder.name,
    ...folder.children.flatMap((c) =>
      c.type === "folder" ? getFolderNames(c as FolderItem) : []
    ),
  ];
}

export function useExplorerState(
  tree: TreeItem[],
  initialExpanded: string[] = ["portfolio", "src", "blog"]
) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(initialExpanded)
  );

  const toggle = useCallback((name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback((folder: FolderItem) => {
    setExpanded((prev) => new Set([...prev, ...getFolderNames(folder)]));
  }, []);

  const collapseAll = useCallback((name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const allFolderNames = useMemo(
    () => [
      "portfolio",
      ...tree.flatMap((c) =>
        c.type === "folder" ? getFolderNames(c as FolderItem) : []
      ),
    ],
    [tree]
  );

  const handleExpandAll = useCallback(
    () => setExpanded(new Set(allFolderNames)),
    [allFolderNames]
  );

  const handleCollapseAll = useCallback(() => setExpanded(new Set()), []);

  return {
    collapseAll,
    expandAll,
    expanded,
    handleCollapseAll,
    handleExpandAll,
    toggle,
  };
}
