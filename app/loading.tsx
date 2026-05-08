"use client";

import { Skeleton } from "../src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>

        {/* CTA Button Skeleton */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Feature Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg bg-white shadow-sm space-y-4"
            >
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
