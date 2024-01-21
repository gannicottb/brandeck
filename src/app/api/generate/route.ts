import { GameVersion } from "@/app/lib/GameVersion"
import generateAndUpload from "@/app/lib/Generator"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  const res = await request.json()
  const gameVer: GameVersion = { gameName: res["gameName"], version: res["version"] }
  const fullName = `${gameVer.gameName} v${gameVer.version.major}.${gameVer.version.minor}`

  const numGenerated = await generateAndUpload(gameVer)

  return NextResponse.json({
    message: `Rendered cards for ${fullName}. ${numGenerated} generated and uploaded.`
  })
}