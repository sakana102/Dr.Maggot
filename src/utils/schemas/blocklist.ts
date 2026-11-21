import { z } from "zod";
import { PlatformRecordSchema } from "./platform";

export const BlocklistEntrySchema = z.object({
  value: z.string().min(1),
  enabled: z.boolean().default(true).catch(true),
});

export const BlocklistSchema = z
  .array(z.unknown())
  .transform((list) => {
    const set = new Set<string>();
    const entries: z.output<typeof BlocklistEntrySchema>[] = [];

    for (const item of list) {
      const result = BlocklistEntrySchema.safeParse(item);
      if (!result.success || set.has(result.data.value)) continue;
      set.add(result.data.value);
      entries.push(result.data);
    }

    return entries;
  })
  .catch(() => []);

export const BlocklistsSchema = z
  .object({
    global: BlocklistSchema,
    ...PlatformRecordSchema(() => BlocklistSchema).shape,
  })
  .catch(() => ({
    global: [],
    youtube: [],
    twitch: [],
    kick: [],
    mellowfan: [],
    twicas: [],
  }));
