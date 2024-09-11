import { GaxiosPromise } from "@googleapis/drive"
import { DriveClient } from "./DriveClient"
import { RedisRTC } from "./RedisRTC"
import { Version } from "./Version"
import { GameVersion } from "./GameVersion"

interface NameAndParentId {
  name: string
  parentId?: string
}

export type Dict = Record<string, string>

export const FolderType = "application/vnd.google-apps.folder"

export const getRootId = (game: string) => process.env[`${game.toUpperCase()}_ROOT_ID`]

export const getGameNames = (): string[] => {
  return Object.keys(process.env)
    .filter(key => key.endsWith("_ROOT_ID"))
    .map(key => key.replace("_ROOT_ID", "").replace("_", " ").toLowerCase())
}

export const folderIdMap = new RedisRTC<NameAndParentId>("folderIds", async ({ name, parentId }) => {
  const drive = DriveClient.getInstance().drive()
  return await drive.files.list(
    { q: `name = '${name}' and parents in '${parentId}' and mimeType = '${FolderType}'` }
  ).then((r) => {
    const fileId = (r.data.files || [])[0]?.id
    if (fileId) { return fileId } else {
      return Promise.reject(`item ${name} not found in ${parentId}`)
    }
  })
})

export async function downloadSheet(game: string, ver: Version) {
  const drive = DriveClient.getInstance().drive()
  // Dynamically access the root id for the requested game
  const parentId = getRootId(game)

  const major_folder_id = await folderIdMap.get({ name: `v${ver.major}`, parentId })
  console.log(`Major Folder: v${ver.major}: ${major_folder_id}`)

  const minor_folder_id = await folderIdMap.get({ name: `.${ver.minor}`, parentId: major_folder_id })
  console.log(`Minor Folder: .${ver.minor}: ${minor_folder_id}`)

  const sheet = await drive.files.list(
    { q: `name contains 'cards' and parents in '${minor_folder_id}'` })
    .then((r) => (r.data.files || [])[0])

  if (!sheet) throw new Error(`Could not find the sheet for ${ver}`)
  console.log(sheet.name)
  // Weird typing is a workaround as described here
  // https://github.com/googleapis/google-api-nodejs-client/issues/1683
  const sheetId = sheet.id == null ? undefined : sheet.id
  const buf = await ((drive.files.export({
    fileId: sheetId,
    mimeType: "text/csv"
  }) as unknown) as GaxiosPromise<Blob>).then((blob) =>
    blob.data.text()
  )

  return buf
}
export const cardCache = new RedisRTC<GameVersion>("cards", (gameVer) =>
  downloadSheet(gameVer.gameName, gameVer.version)
)

export const mapArtURL = async (game: string, artName: string): Promise<string> => {
  const drive = DriveClient.getInstance().drive()
  const parentId = getRootId(game)
  const art_folder_id = await folderIdMap.get({
    name: "art",
    parentId
  })
  return drive.files.list(
    { q: `name = '${artName}' and parents in '${art_folder_id}'` }
  ).then((r) => {
    const id = (r.data.files || [])[0]?.id
    if (id) { return `https://lh3.googleusercontent.com/d/${id}` } else {
      return Promise.reject(`image '${artName}' not found in ${art_folder_id}`)
    }
  })
}

export const first = (stringOrArray: string | string[] | undefined): string | undefined => {
  return Array.isArray(stringOrArray) ? stringOrArray[0] : stringOrArray
}

export const debugLog = (message?: any, ...optionalParams: any[]): void => {
  if (process.env.NODE_ENV != "production") { console.log(message, optionalParams) }
}

// usage: new ArrayOps(a).???
export class ArrayOps<T> {
  ts: T[]
  constructor(array: T[]) { this.ts = array }
  grouped(size: number): T[][] {
    return this.ts.reduce<T[][]>((result, item, index) => {
      const chunkIndex = Math.floor(index / size)
      if (!result[chunkIndex]) {
        result[chunkIndex] = [] // start a new chunk
      }

      result[chunkIndex].push(item)

      return result
    }, [])
  }
}