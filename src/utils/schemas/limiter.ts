import { z } from "zod";

export const LimiterSchema = z
  .object({
    less: z.number().int().nonnegative().catch(0),
    more: z.number().int().nonnegative().catch(0),
  })
  .catch(() => ({ less: 0, more: 0 }));
