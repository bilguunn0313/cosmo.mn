import { z } from "zod";
import { idSchema } from "./common";

const retailPartnerFields = z.object({
  name: z.string().trim().min(1).max(100),
  logoId: idSchema,
  isVisible: z.boolean(),
});

export const createRetailPartnerSchema = retailPartnerFields.extend({
  isVisible: z.boolean().default(true),
});

export const updateRetailPartnerSchema = retailPartnerFields.partial();

export type CreateRetailPartnerInput = z.infer<typeof createRetailPartnerSchema>;
export type UpdateRetailPartnerInput = z.infer<typeof updateRetailPartnerSchema>;
