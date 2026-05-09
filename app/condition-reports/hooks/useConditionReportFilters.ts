import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  filterReportSchema,
  FilterReportInput,
} from "../schemas/condition-report-schemas";

export function useConditionReportFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const params = Object.fromEntries(
      searchParams.toString()
        ? new URLSearchParams(searchParams.toString())
        : [],
    );

    const result = filterReportSchema.safeParse(params);
    if (result.success) {
      return result.data;
    }

    return filterReportSchema.parse({});
  }, [searchParams]);

  const setFilter = useCallback(
    <K extends keyof FilterReportInput>(key: K, value: FilterReportInput[K]) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === "") {
        newParams.delete(key as string);
      } else {
        newParams.set(key as string, String(value));
      }

      if (key !== "page") {
        newParams.set("page", "1");
      }

      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { filters, setFilter };
}
