import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { filterSchema, UserFilters } from "../schemas/filter-schema";

export function useUserFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const params = Object.fromEntries(
      searchParams.toString()
        ? new URLSearchParams(searchParams.toString())
        : [],
    );
    const result = filterSchema.safeParse(params);
    if (result.success) {
      return result.data;
    }
    return filterSchema.parse({});
  }, [searchParams]);

  const setFilter = useCallback(
    <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === "") {
        newParams.delete(key as string);
      } else {
        newParams.set(key as string, String(value));
      }

      // Reset to page 1 if any filter other than page changes
      if (key !== "page") {
        newParams.set("page", "1");
      }

      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { filters, setFilter };
}
