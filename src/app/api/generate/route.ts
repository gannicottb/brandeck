import { GameVersion, prettyPrint } from "@/app/lib/GameVersion"
import generateAndUpload from "@/app/lib/Generator"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  const res = await request.json()
  const gameVer: GameVersion = { gameName: res["gameName"], version: res["version"] }

  generateAndUpload(gameVer)

  return NextResponse.json({
    message: `Generating cards for ${prettyPrint(gameVer)}.`
  })
}