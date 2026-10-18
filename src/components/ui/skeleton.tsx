"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("sqlwhale-ui-skeleton animate-pulse rounded-md", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <Card className="w-full max-w-xs border-border/70 bg-card/80 shadow-none">
      <CardHeader className="gap-3 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}

export { Skeleton, SkeletonCard };
