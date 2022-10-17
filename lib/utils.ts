import initializeBasicAuth from 'nextjs-basic-auth'

/**
 * Shared utilities for all of brandeck
 */
export interface Version {
  major: number,
  minor: number
}
export type Dict = {
  [key: string]: string
}

export const getRootId = (game: string) => process.env[`${game.toUpperCase()}_ROOT_ID`]

export const parseVersion = (version: string): Version => {
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

export const first = (stringOrArray: string | string[]): string | undefined => {
  return Array.isArray(stringOrArray) ? stringOrArray[0] : stringOrArray
}
