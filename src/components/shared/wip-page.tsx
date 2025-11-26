import { ArrowBigLeftDash, HammerIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function WipPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HammerIcon />
        </EmptyMedia>
        <EmptyTitle>This page is still under construction</EmptyTitle>
        <EmptyDescription>
          I'm still working on it, please check back later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/">
            <ArrowBigLeftDash />
            Go to home
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
