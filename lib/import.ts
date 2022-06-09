import { GaxiosPromise } from "gaxios";
import { drive_v3 } from "googleapis";
import { DriveClient } from "./DriveClient";
import { InMemoryRTC } from "./ReadThroughCache";
import { parseVersion, RootFolderId, Version } from "./utils";

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

export const findLatest = async (): Promise<Version> => {
  let maxBy = require("lodash.maxby")
  const parseMajor = (name: string | null | undefined) => Number(name?.split("v")[1])
  const parseMinor = (name: string | null | undefined) => Number(name?.split(".")[1])
  const drive = DriveClient.getInstance().drive()
  // find all of the folders in ROOT_FOLDER_ID that start with "v"
  const majorFolders = await drive.files.list({
    q: `name contains 'v' and parents in '${RootFolderId}' and mimeType = '${FolderType}'`
  })
  // Choose the one with the highest v[n]
  const highestMajor = maxBy(majorFolders.data.files, (f: drive_v3.Schema$File) => parseMajor(f.name))
  // Then find all of the folders in that folder that start with "."
  const minorFolders = await drive.files.list({
    q: `name contains '.' and parents in '${highestMajor?.id}' and mimeType = '${FolderType}'`
  })
  // Choose the one with the highest .[n]
  const highestMinor = maxBy(minorFolders.data.files, (f: drive_v3.Schema$File) => parseMinor(f.name))
  // return the Version
  return {
    major: parseMajor(highestMajor?.name),
    minor: parseMinor(highestMinor?.name),
    isLatest: true
  }
}

export const getVersion = async (query: string | string[]): Promise<Version> => {
  const firstVersionParam = Array.isArray(query) ? query[0] : query
  if (firstVersionParam != "latest") {
    return new Promise<Version>((res) => res(parseVersion(firstVersionParam)))
  } else {
    return findLatest()
  }
}