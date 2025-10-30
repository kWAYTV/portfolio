"use client";

import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems } from "@/enums/nav";
import type { NavPath } from "@/types/nav";

export function Navbar() {
  return (
    <aside className="mb-8 tracking-tight sm:mb-16">
      <div className="lg:sticky lg:top-20">
        <nav
          className="fade relative flex scroll-pr-6 flex-row items-start px-0 pb-0 md:relative md:overflow-auto"
          id="nav"
        >
          <div className="flex w-full flex-row items-center justify-start space-x-0 pr-2 sm:space-x-1 sm:pr-10">
            {(
              Object.entries(navItems) as [
                NavPath,
                (typeof navItems)[NavPath],
              ][]
            ).map(([path, { name, icon: Icon, tooltip }]) => (
              <Tooltip key={path}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="flex items-center gap-1 p-1.5 sm:gap-2 sm:p-2"
                    variant="linkHover2"
                  >
                    <Link
                      aria-label={`Navigate to ${name}`}
                      href={
                        name.toLowerCase() === "résumé"
                          ? "https://gitroll.io/profile/uezq54oxIk4VFZkLigfxGmGgm57z1"
                          : path
                      }
                      {...(name.toLowerCase() === "github" ||
                      name.toLowerCase() === "résumé"
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      <span className="hidden capitalize sm:inline">
                        {name}
                      </span>
                      {(name.toLowerCase() === "github" ||
                        name.toLowerCase() === "résumé") && (
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3 w-3 opacity-70"
                        />
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ))}
            <Separator className="mx-1 h-6" orientation="vertical" />
            <ModeToggle />
          </div>
        </nav>
      </div>
    </aside>
  );
}
