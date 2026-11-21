import { z } from "zod";

export const DisplaySettingsSchema = z.object({
  hideName: PlatformSettingSchema(z.boolean(), false),
  unifyName: PlatformSettingSchema(z.boolean(), false),
  unifyNameValue: PlatformSettingSchema(z.string(), "@"),
  stripe: PlatformSettingSchema(z.boolean(), false),
  stripeColor: PlatformSettingSchema(z.string(), "#2563eb"),
  fontFamily: PlatformSettingSchema(z.string(), ""),
  fontSize: PlatformSettingSchema(z.number().int().min(1), 13),
  nowrap: PlatformSettingSchema(z.boolean(), false),
});

export const FilterSettingsSchema = z.object({
  enable: PlatformSettingSchema(z.boolean(), true),
  subscriberOnly: PlatformSettingSchema(z.boolean(), false),
  characterLimit: PlatformSettingSchema(LimiterSchema, { less: 0, more: 0 }),
  emoteLimit: PlatformSettingSchema(LimiterSchema, { less: 0, more: 0 }),
  requiredFollowDays: PlatformSettingSchema(z.number().int().min(0).max(10000), 0),
  deletionScope: PlatformSettingSchema(z.boolean(), false),
});

export const DanmakuSettingsSchema = z.object({
  enable: PlatformSettingSchema(z.boolean(), true),
  fontFamily: PlatformSettingSchema(z.string(), ""),
  fontSize: PlatformSettingSchema(z.number().int().min(1), 28),
  fontOpacity: PlatformSettingSchema(z.number().int().min(0).max(100), 50),
  displayTime: PlatformSettingSchema(z.number().int().min(1), 10),
  displayLimit: PlatformSettingSchema(z.number().int().min(0), 0),
  displayRange: PlatformSettingSchema(z.number().int().min(10).max(100), 100),
});

export const OtherSettingsSchema = z.object({
  quickBlock: PlatformSettingSchema(z.boolean(), false),
  autoBonus: PlatformSettingSchema(z.boolean(), false),
  countdown: PlatformSettingSchema(z.boolean(), false),
});
