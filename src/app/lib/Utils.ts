import { GaxiosPromise } from "@googleapis/drive"
import { DriveClient } from "./DriveClient"
import { RedisRTC } from "./RedisRTC"
import { Version } from "./Version"
// import { CardRow } from "./CardRow"
// import { parseString } from "@fast-csv/parse"
// import camelCase from "lodash.camelcase"

interface NameAndParentId {
  name: string
  parentId?: string
}

export type Dict = {
  [key: string]: string
}

export const FolderType = "application/vnd.google-apps.folder"

export const getRootId = (game: string) => process.env[`${game.toUpperCase()}_ROOT_ID`]

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

// export async function parseSheet<C extends CardRow>(csv: string, transformFn: (c: C) => C) {
//   return new Promise<C[]>(resolve => {
//     let result: C[] = []
//     parseString<C, C>(csv,
//       { headers: headers => headers.map(h => camelCase(h || "")), trim: true }
//     )
//       .transform((data: C) => {
//         return transformFn(data)
//       })
//       .on('error', error => console.error(error))
//       .on('data', (row: C) => [...Array(Number(row.num))].forEach((_, i) => result.push(row)))
//       .on('end', (rowCount: number) => {
//         console.log(`Parsed ${rowCount} rows`)
//         resolve(result)
//       });
//   })
// }

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