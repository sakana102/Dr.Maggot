import { z } from "zod";

export type Platform = z.output<typeof PlatformSchema>;
