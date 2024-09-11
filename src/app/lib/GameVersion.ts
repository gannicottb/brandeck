import { Version } from "./Version"

export interface GameVersion {
  gameName: string
  version: Version
}

export function prettyPrint(gameVer: GameVersion) {
  `${gameVer.gameName} v${gameVer.version.major}.${gameVer.version.minor}`
}