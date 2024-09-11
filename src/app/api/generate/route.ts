import { GameVersion } from "@/app/lib/GameVersion"
import generateAndUpload from "@/app/lib/Generator"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  const res = await request.json()

  const gameVer = GameVersion.fromObject(res)

  // whether we await here determines if the call waits or not, seems like
  await generateAndUpload(gameVer)

  return NextResponse.json({
    message: `Generating cards for ${GameVersion.show(gameVer)}.`
  })
}