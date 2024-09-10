import { GameVersion, prettyPrint } from "@/app/lib/GameVersion"
import { RedisClient } from "@/app/lib/RedisClient"
import { cardCache } from "@/app/lib/Utils"
import { NextResponse } from "next/server"
// export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  const res = await request.json()
  const gameVer: GameVersion = { gameName: res["gameName"], version: res["version"] }

  // problem: duplicates logic from RTC, would have to make it global
  // const keyString = `brandeck:cards:${JSON.stringify(gameVer)}`
  // const redis = await RedisClient.getInstance().then((c) => c.redis())
  // redis.del(keyString)
  cardCache.invalidate(gameVer)

  return NextResponse.json({
    message: `Invalidated cache for ${prettyPrint(gameVer)}.`
  })
}