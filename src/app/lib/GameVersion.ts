import { Version } from "./Version";

export interface GameVersion {
  gameName: string;
  version: Version;
}

export abstract class GameVersion {
  static show(gv: GameVersion): string {
    return `${gv.gameName} v${Version.show(gv.version)}`;
  }
  static fromObject(gv: GameVersion): GameVersion {
    return this.apply(gv.gameName, gv.version);
  }
  static fromStrings(gameName: string, version: string): GameVersion {
    return { gameName, version: Version.fromString(version) };
  }
  static apply(gameName: string, version: Version): GameVersion {
    return { gameName, version };
  }
}
