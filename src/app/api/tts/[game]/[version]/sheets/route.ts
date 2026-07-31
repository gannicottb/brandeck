import { GameVersion } from "@/app/lib/GameVersion";
import { ttsCache } from "@/app/lib/Utils";
import { Version } from "@/app/lib/Version";
import { NextResponse } from "next/server";

// return info about the uploaded sheets so that TTS can download the latest sheets and merge them into a single asset, in index order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ game: string; version: string }> },
) {
  const { game, version } = await params;

  const gameVer = GameVersion.fromObject({
    gameName: game,
    version: Version.fromString(version),
  });

  const entries = await ttsCache.get(gameVer);

  return NextResponse.json(entries);
}
