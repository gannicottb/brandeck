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

export class ReadThroughCache<K, V> {
  cache = require('memory-cache');
  fn: (key: K) => Promise<V>

  constructor(fn: (key: K) => Promise<V>) {
    this.fn = fn
  }

  async get(key: K): Promise<V> {
    const keyString = JSON.stringify(key)
    let cached = this.cache.get(keyString)
    if (cached == null) {
      console.log(`cache miss! for ${keyString}`)
      const fresh = await this.fn(key)
      this.cache.put(keyString, fresh)
      cached = fresh
    } else {
      console.log(`cache hit :) for ${keyString}`)
    }
    return cached
  }
}
