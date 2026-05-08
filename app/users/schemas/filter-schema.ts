import { z } from "zod";

export const filterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  role: z.enum(["ADMIN", "MANAGER", "DEVELOPER"]).optional(),
  q: z.string().optional(),
});

export type UserFilters = z.infer<typeof filterSchema>;
