import { z } from "zod";

export type Limiter = z.output<typeof LimiterSchema>;
