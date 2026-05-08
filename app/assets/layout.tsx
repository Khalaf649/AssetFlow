"use client";

import { AuthenticatedLayout } from "@/src/components/AuthenticatedLayout";

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
