import { drive_v3 } from '@googleapis/drive'
import { DriveClient } from '@/app/lib/DriveClient'
import { getRootId, FolderType, getGameNames } from '@/app/lib/Utils'
import { Version, convertVersionToNumber } from '@/app/lib/Version'
import Link from 'next/link'

interface Folder {
  id: string
  name: string
}

async function getVersionsFor(drive: drive_v3.Drive, gameName: string) {
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
  })).then(x => x.flat(1).sort((a, b) => convertVersionToNumber(a) - convertVersionToNumber(b)))
  return allVersions
}
type GameVersionMap = {
  [key: string]: Version[]
}
export default async function Home() {
  const drive = DriveClient.getInstance().drive()

  let gameVersions: GameVersionMap = {} as GameVersionMap
  for (const gameName of getGameNames()) {
    gameVersions[gameName] = await getVersionsFor(drive, gameName)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Brandeck</h1>
      <div>Winding Road Games card preview and generation utility.</div>
      <div>
        {Object.keys(gameVersions).map(gameName => {
          const versions = gameVersions[gameName]
          return (
            <div key={gameName}>
              <h3>{gameName}</h3>
              <div className="flex flex-row">
                {versions.map(v =>
                  <div className="m-1 p-1 border-2 border-white" key={`${v.major}.${v.minor}`}>
                    <Link href={`/${gameName}/cards/${v.major}.${v.minor}`}>{`${v.major}.${v.minor}`}</Link>
                  </div>
                )}
              </div>
            </div>
          )
        }
        )}
      </div>
      <div>Winding Road Games 2024</div>
    </main>
  )
}
