import initializeBasicAuth from 'nextjs-basic-auth'

export interface Version {
  major: Number,
  minor: Number
}

export const RootFolderId = process.env.ROOT_FOLDER_ID || "UNDEFINED"
export const ExportFolderId = process.env.EXPORT_FOLDER_ID || "UNDEFINED"

export const parseVersion = (version: String): Version => {
  if (version === "latest") return { major: 2, minor: 0 } // this is a hack, should be smarter
  const [major, minor] = version.split(".").map((s) => Number(s))
  return { major, minor }
}

export const getVersion = (query: string | string[]): Version => {
  const firstVersionParam = Array.isArray(query) ? query[0] : query
  const versionToUse = firstVersionParam === undefined ? "latest" : firstVersionParam
  return parseVersion(versionToUse)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const users = process.env.ADMIN_SECRET ? [
  { user: 'admin', password: process.env.ADMIN_SECRET }
] : []

export const basicAuth = initializeBasicAuth({
  users: users
})
