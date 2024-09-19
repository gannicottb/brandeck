import { drive_v3 } from '@googleapis/drive'
import { DriveClient } from '@/app/lib/DriveClient'
import { getRootId, FolderType, getGameNames } from '@/app/lib/Utils'
import { Version } from '@/app/lib/Version'
import { GameVersionPicker } from './components/GameVersionPicker'

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

  const allVersions: Version[] = await Promise.all(majors.map(async major => {
    const minorVersions = await drive.files.list({
      q: `name contains '.' and mimeType = '${FolderType}' and parents in '${major.id}'`
    })

    const names = (minorVersions.data.files || []).map(f => f.name || "").filter(s => s != "")
    return names.map<Version>(minor => {
      return Version.apply(Number(major.name.replace("v", "")), Number(minor.replace(".", "")))
    })
  })).then(x => x.flat(1).sort((a, b) => Version.toNumber(a) - Version.toNumber(b)))
  return allVersions
}
type GameVersionMap = Record<string, Version[]>

export default async function Home() {
  const drive = DriveClient.getInstance().drive()

  const gameVersions: GameVersionMap = await Promise.all(
    getGameNames().map(name =>
      getVersionsFor(drive, name)
        .then(vs => [name, vs])
    )
  ).then(Object.fromEntries)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Brandeck</h1>
      <div>Winding Road Games card preview and generation utility.</div>
      <div className="flex flex-col">
        {Object.keys(gameVersions).map(gameName => {
          const versions = gameVersions[gameName]
          return <GameVersionPicker key={gameName} gameName={gameName} versions={versions} />
        }
        )}
      </div>
      <div>Winding Road Games 2024</div>
    </main>
  )
}
