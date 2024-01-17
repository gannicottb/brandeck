import { drive_v3 } from '@googleapis/drive'
import { DriveClient } from 'lib/DriveClient'
import { FolderType } from 'lib/import'
import { Dict, Version, getRootId } from 'lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Folder {
  id: string
  name: string
}

async function getVersionsFor(drive: drive_v3.Drive, gameName: string) {
  console.log("gVF gN: " + gameName)
  // find the latest version for the game
  const allMajorVersions = await drive.files.list({
    q: `name contains 'v' and mimeType = '${FolderType}' and parents in '${getRootId(gameName)}'`
  })

  const majors: Folder[] = (allMajorVersions.data.files || []).map(f => {
    return { id: f.id || "", name: f.name || "" }
  })

  const allVersions = await Promise.all(majors.map(async major => {
    const minorVersions = await drive.files.list({
      q: `name contains '.' and mimeType = '${FolderType}' and parents in '${major.id}'`
    })

    const names = (minorVersions.data.files || []).map(f => f.name || "").filter(s => s != "")
    return names.map<Version>(minor => {
      return { major: Number(major.name.replace("v", "")), minor: Number(minor.replace(".", "")) }
    })
  })).then(x => x.flat(1).sort((a, b) => a.major - b.major))

  return allVersions
}
type GameVersionMap = {
  [key: string]: Version[]
}
export default async function Home() {
  const drive = DriveClient.getInstance().drive()

  let gameVersions: GameVersionMap = {} as GameVersionMap
  // ["astromon", "demo"].forEach(async (gameName) => {
  for (const gameName of ["astromon", "demo"]) {
    gameVersions[gameName] = await getVersionsFor(drive, gameName)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Brandeck</h1>
      <div>Winding Road Games card preview/generation utility.</div>
      <div>
        {Object.keys(gameVersions).map(gameName => {
          const versions = gameVersions[gameName]
          return (
            <>
              <h3>{gameName}</h3>
              {versions.map(v =>
                <div key={`${v.major}.${v.minor}`}>
                  <h2><Link href={`/${gameName}/cards/${v.major}.${v.minor}`}>{`${v.major}.${v.minor}`}</Link></h2>
                </div>)}
            </>
          )
        }
        )}
      </div>


    </main>
  )
}
