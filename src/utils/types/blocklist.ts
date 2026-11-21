import { z } from "zod";

export type BlocklistEntry = z.output<typeof BlocklistEntrySchema>;
export type Blocklist = z.output<typeof BlocklistSchema>;
export type Blocklists = z.output<typeof BlocklistsSchema>;
