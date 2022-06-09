
import { GaxiosPromise } from "gaxios";
import { drive_v3 } from "googleapis";
import { DriveClient } from "./DriveClient";
import { InMemoryRTC } from "./ReadThroughCache";
import { Version } from "./utils";

export const FolderType = "application/vnd.google-apps.folder"
interface NameAndParentId {
  name: string
  parentId?: string
}
const folderIdMap = new InMemoryRTC<NameAndParentId, drive_v3.Schema$File>(async ({ name, parentId }) => {
  const drive = DriveClient.getInstance().drive()
  return await drive.files.list(
    { q: `name = '${name}' and parents in '${parentId}' and mimeType = '${FolderType}'` }
  ).then((r) => {
    return (r.data.files || [])[0]
  })
})

export const mapArtURL = async (artName: string): Promise<string> => {
  const drive = DriveClient.getInstance().drive()

  const art_folder = await folderIdMap.get({
    name: "art",
    parentId: process.env.ROOT_FOLDER_ID
  })
  return drive.files.list(
    { q: `name = '${artName}' and parents in '${art_folder.id}'` }
  ).then((r) => {
    const id = (r.data.files || [])[0]?.id
    return id ? `https://drive.google.com/uc?id=${id}&export=download` : "unknown"
  })
}

export const importer = async (ver: Version): Promise<string> => {
  const drive = DriveClient.getInstance().drive()

  const major_folder = await folderIdMap.get({ name: `v${ver.major}`, parentId: process.env.ROOT_FOLDER_ID })
  console.log(`Major Folder: ${major_folder?.name} ${major_folder?.id}`)

  const minor_folder = await folderIdMap.get({ name: `.${ver.minor}`, parentId: major_folder.id || "" })
  console.log(`Minor Folder: ${minor_folder?.name} ${minor_folder?.id}`)

  const sheet = await drive.files.list(
    { q: `name contains 'cards' and parents in '${minor_folder.id}'` })
    .then((r) => (r.data.files || [])[0])

  if (!sheet) throw new Error(`Could not find the sheet for ${ver}`)

  // Weird typing is a workaround as described here
  // https://github.com/googleapis/google-api-nodejs-client/issues/1683
  const sheetId = sheet.id == null ? undefined : sheet.id
  const buf = await ((drive.files.export({
    fileId: sheetId,
    mimeType: "text/csv"
  }) as unknown) as GaxiosPromise<string>)

  return buf.data
}