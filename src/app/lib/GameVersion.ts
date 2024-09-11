import { Version } from "./Version"

export interface GameVersion {
  gameName: string
  version: Version
}

export abstract class GameVersion {
  static show(gv: GameVersion) {
    return `${gv.gameName} v${Version.toString(gv.version)}`
  }
  static fromObject(gv: GameVersion): GameVersion {
    return this.apply(gv.gameName, gv.version)
  }
  static apply(gameName: string, version: Version) {
    return { gameName, version }
  }
}