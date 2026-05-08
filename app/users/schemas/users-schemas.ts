import { z } from "zod";

export const userRoleEnum = z.enum(["ADMIN", "MANAGER", "DEVELOPER"]);

export const assetSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  serialNumber: z.string(),
  type: z.string(),
  status: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleEnum,
  createdAt: z.string(),
  assignedAssets: z.array(assetSchema).optional(),
});

export type User = z.infer<typeof userSchema>;
export type Asset = z.infer<typeof assetSchema>;

export const updateRoleSchema = z.object({
  role: userRoleEnum,
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
