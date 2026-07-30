import { z } from "zod";
import { GameVersion } from "./GameVersion";
import { RedisClient } from "./RedisClient";
import { Version } from "./Version";

export const TtsCardSheetEntrySchema = z.object({
  fileId: z.string(),
  count: z.number(),
});
export const TtsCardSheetEntriesSchema = z.array(TtsCardSheetEntrySchema);
export type TtsCardSheetEntries = z.infer<typeof TtsCardSheetEntriesSchema>;

export class TtsCache {
  buildKeyString(gameVer: GameVersion) {
    return `brandeck:generated:${gameVer.gameName}:${Version.toString(gameVer.version)}`;
  }

  async set(gameVer: GameVersion, entries: TtsCardSheetEntries): Promise<void> {
    const redis = await RedisClient.getInstance().then((c) => c.redis());

    await redis.set(this.buildKeyString(gameVer), JSON.stringify(entries));
  }

  async get(gameVer: GameVersion): Promise<TtsCardSheetEntries> {
    const redis = await RedisClient.getInstance().then((c) => c.redis());
    const key = this.buildKeyString(gameVer);
    return await redis.get(key).then((s) => {
      if (s == null) {
        throw new Error(`Nothing found in Redis for ${key}`);
      } else {
        const raw = JSON.parse(s);
        return TtsCardSheetEntriesSchema.parse(raw);
      }
    });
  }
}
