import { GithubIcon, TwitterIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { githubUsername, twitterUsername } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-2xl tracking-tighter">Contact</h2>

      <p className="mb-4 text-muted-foreground text-sm">
        Feel free to connect with me on these platforms
      </p>

      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              aria-label="GitHub Profile"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                "rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "transition-colors"
              )}
              href={`https://github.com/${githubUsername}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>GitHub</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              aria-label="Twitter/X Profile"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                "rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "transition-colors"
              )}
              href={`https://twitter.com/${twitterUsername}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <TwitterIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Twitter / X</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
