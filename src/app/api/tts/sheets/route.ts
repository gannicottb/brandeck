import { GameVersion } from "@/app/lib/GameVersion";
import { ttsCache } from "@/app/lib/Utils";
import { NextResponse } from "next/server";

// return info about the uploaded sheets so that TTS can download the latest sheets and merge them into a single asset, in index order
export async function POST(request: Request) {
  const res = await request.json();

  const gameVer = GameVersion.fromObject(res);

  const entries = await ttsCache.get(gameVer)

  return NextResponse.json(entries);
}
