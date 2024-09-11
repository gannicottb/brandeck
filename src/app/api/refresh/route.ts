import { GameVersion } from "@/app/lib/GameVersion"
import { cardCache } from "@/app/lib/Utils"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const res = await request.json()

  const gameVer = GameVersion.fromObject(res)

  await cardCache.invalidate(gameVer)

  return NextResponse.json({
    message: `Invalidated cache for ${GameVersion.show(gameVer)}.`
  })
}