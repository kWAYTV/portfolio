"use client";

import { Link } from "@i18n/routing";
import {
  cn,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@portfolio/ui";
import { Code2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSwapy, utils } from "swapy";
import { navItems } from "@/consts/nav-items";
import { FileIcon } from "./file-icon";

interface TabItemProps {
  active: boolean;
  fileName: string;
  fileType: string;
  href: string;
  itemId: string;
  onClose: () => void;
  slotId: string;
}

function TabItem({
  active,
  fileName,
  fileType,
  href,
  itemId,
  onClose,
  slotId,
}: TabItemProps) {
  return (
    <div
      className={cn(
        "group relative flex select-none items-center whitespace-nowrap border-border border-r text-xs transition-colors",
        active
          ? "bg-background text-foreground"
          : "bg-muted text-muted-foreground hover:bg-background/50"
      )}
      data-swapy-slot={slotId}
    >
      <div
        className="flex min-w-0 flex-1 cursor-grab items-center active:cursor-grabbing"
        data-swapy-item={itemId}
      >
        {active && (
          <span className="absolute inset-x-0 top-0 h-[2px] bg-primary" />
        )}
        <Link
          className="flex items-center gap-2 py-1 pr-1 pl-3"
          draggable={false}
          href={href}
        >
          <FileIcon className="size-3.5 shrink-0" type={fileType} />
          <span className="truncate">{fileName}</span>
        </Link>
        <button
          className={cn(
            "mr-1.5 ml-1 shrink-0 rounded-sm p-0.5 transition-opacity hover:bg-foreground/10 hover:opacity-100",
            active
              ? "opacity-60"
              : "pointer-events-none opacity-0 group-hover:opacity-60 group-hover:pointer-events-auto"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          type="button"
        >
          <X className="size-3" />
        </button>
      </div>
    </div>
  );
}

interface EditorTabsProps {
  onCloseTab: (href: string) => void;
  onReorder: (newOrder: string[]) => void;
  openTabs: string[];
  pathname: string;
}

export function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
  onReorder,
}: EditorTabsProps) {
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const orderedItems = openTabs.flatMap((href) => {
    const item = navItems.find((n) => n.href === href);
    return item ? [item] : [];
  });

  const [slotItemMap, setSlotItemMap] = useState(() =>
    utils.initSlotItemMap(orderedItems, "href")
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<ReturnType<typeof createSwapy> | null>(null);

  const slottedItems = useMemo(
    () => utils.toSlottedItems(orderedItems, "href", slotItemMap),
    [orderedItems, slotItemMap]
  );

  const handleSwap = useCallback(
    (event: { newSlotItemMap: { asArray: Array<{ slot: string; item: string }> } }) => {
      const newMap = event.newSlotItemMap.asArray;
      setSlotItemMap(newMap);
      const newOrder = openTabs.map(
        (slot) => newMap.find((p) => p.slot === slot)?.item ?? slot
      );
      onReorder(newOrder);
    },
    [onReorder, openTabs]
  );

  const tabsKey = openTabs.slice().sort().join(",");
  useEffect(() => {
    if (orderedItems.length === 0) return;
    setSlotItemMap(utils.initSlotItemMap(orderedItems, "href"));
  }, [tabsKey]);

  useEffect(() => {
    if (!containerRef.current || orderedItems.length === 0) return;
    swapyRef.current = createSwapy(containerRef.current, {
      manualSwap: true,
      swapMode: "drop",
      dragAxis: "x",
    });
    swapyRef.current.onSwap(handleSwap);
    return () => {
      swapyRef.current?.destroy();
      swapyRef.current = null;
    };
  }, [orderedItems.length, handleSwap]);

  if (orderedItems.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="h-[35px] shrink-0 bg-muted" />
        <Empty className="flex-1 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Code2 />
            </EmptyMedia>
            <EmptyTitle className="text-sm">No open editors</EmptyTitle>
            <EmptyDescription className="text-xs">
              Open a file from the sidebar to start editing
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-[35px] shrink-0 items-stretch overflow-x-auto bg-muted"
    >
      {slottedItems.map(({ slotId, itemId, item }) =>
        item ? (
          <TabItem
            active={isActive(item.href)}
            fileName={item.fileName}
            fileType={item.fileType}
            href={item.href}
            itemId={itemId}
            key={slotId}
            onClose={() => onCloseTab(item.href)}
            slotId={slotId}
          />
        ) : null
      )}
    </div>
  );
}
