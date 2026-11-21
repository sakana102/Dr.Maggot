import { z } from "zod";

export type DisplaySettings = z.output<typeof DisplaySettingsSchema>;
export type FilterSettings = z.output<typeof FilterSettingsSchema>;
export type DanmakuSettings = z.output<typeof DanmakuSettingsSchema>;
export type OtherSettings = z.output<typeof OtherSettingsSchema>;
