import { z } from "zod";

export const PlatformSchema = z.enum([
  "youtube",
  "twitch",
  "kick",
  "mellowfan",
  "twicas",
]);

export function PlatformRecordSchema<T extends z.ZodType>(
  createSchema: () => T,
) {
  return z.object(
    Object.fromEntries(
      PlatformSchema.options.map((platform) => [platform, createSchema()]),
    ) as Record<Platform, T>,
  );
}

export function PlatformSettingSchema<T extends z.ZodType>(
  schema: T,
  defaultValue: z.util.NoUndefined<z.output<T>>,
) {
  const record = PlatformRecordSchema(() => schema.catch(defaultValue));
  return record.catch(() => record.parse({}));
}
