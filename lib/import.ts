import { GaxiosPromise } from "@googleapis/drive";
import { DriveClient } from "./DriveClient";
import { RedisRTC } from "./RedisRTC";
import { first, getRootId, parseVersion, Version } from "./utils";

export const FolderType = "application/vnd.google-apps.folder"
interface NameAndParentId {
  name: string
  parentId?: string
}

// Too useful not to share
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

export const importer = async (game: string, ver: Version): Promise<string> => {
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

export const getVersion = (query: string | string[]): Version => {
  const firstVersionParam = first(query) || "1.0"
  return parseVersion(firstVersionParam)
}