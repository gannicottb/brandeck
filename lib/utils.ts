import initializeBasicAuth from 'nextjs-basic-auth'

export interface Version {
  major: Number,
  minor: Number,
  isLatest?: boolean
}

export const RootFolderId = process.env.ROOT_FOLDER_ID || "UNDEFINED"
export const ExportFolderId = process.env.EXPORT_FOLDER_ID || "UNDEFINED"

export const parseVersion = (version: String): Version => {
  const [major, minor] = version.split(".").map((s) => Number(s))
  return { major, minor }
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

export const icon = (code: string): string => {
  switch (code.toLowerCase()) {
    case "spd":
      return "💨"
    case "str":
      return "💪"
    case "fam":
      return "👩‍👧‍👦"
    case "psy":
      return "🧠"
    case "cave":
    case "c":
      return "🕳"
    // return "<span class='icon cave'></span>"
    case "desert":
    case "d":
      return "🏜"
    // return "<span class='icon desert'></span>"
    case "forest":
    case "f":
      return "🌲"
    // return "<span class='icon forest'></span>"
    case "ocean":
    case "o":
      return "🌊"
    // return "<span class='icon ocean'></span>"
    default:
      return "unknown"
  }
}
