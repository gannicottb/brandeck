import { GameVersion } from "@/app/lib/GameVersion";
import generateAndUpload from "@/app/lib/Generator";
import { cardCache } from "@/app/lib/Utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const res = await request.json();

  const gameVer = GameVersion.fromObject(res["gameVer"]);
  const filterQuery = res["filterQuery"];

  // Invalidate the cardCache so we don't accidentally upload stale images
  await cardCache.invalidate(gameVer)

  // whether we await here determines if the call waits or not, seems like
  await generateAndUpload(gameVer, filterQuery);

  return NextResponse.json({
    message: `Generating cards for ${GameVersion.show(gameVer)}.`,
  });
}
