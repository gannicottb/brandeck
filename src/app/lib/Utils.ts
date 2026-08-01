import { DriveClient } from "./DriveClient";
import { RedisRTC } from "./RedisRTC";
import { Version } from "./Version";
import { GameVersion } from "./GameVersion";
import { TtsCache } from "./TtsCache";
import { GameDataRepo } from "./GameDataRepo";
import { notFound } from "next/navigation";

interface NameAndParentId {
  name: string;
  parentId?: string;
}

export type Dict = Record<string, string>;

export const FolderType = "application/vnd.google-apps.folder";
export const SpreadsheetType = "application/vnd.google-apps.spreadsheet";
export const DocumentType = "application/vnd.google-apps.document";

export const ttsCache = new TtsCache();
// TODO: how to share GameDataRepo without increasing number of JWT authorizations

export const getRootId = (game: string) =>
  process.env[`${game.toUpperCase()}_ROOT_ID`];

export const getGameNames = (): string[] => {
  const names = Object.keys(process.env)
    .filter((key) => key.endsWith("_ROOT_ID"))
    .map((key) => key.replace("_ROOT_ID", "").replace("_", " ").toLowerCase());
  console.log(`All game names: ${names.join(",")}`);
  return names;
};

export const folderIdMap = new RedisRTC<NameAndParentId>(
  "folderIds",
  async ({ name, parentId }) => {
    const drive = DriveClient.getInstance().drive();
    return await drive.files
      .list({
        q: `name = '${name}' and parents in '${parentId}' and mimeType = '${FolderType}'`,
      })
      .then((r) => {
        const fileId = (r.data.files || [])[0]?.id;
        if (fileId) {
          return fileId;
        } else {
          return Promise.reject(`item ${name} not found in ${parentId}`);
        }
      });
  },
);

export async function downloadSheet(game: string, ver: Version) {
  const repo = GameDataRepo.getInstance();
  const sheet = await repo.getFirst(GameVersion.apply(game, ver), {
    nameContains: "cards",
  });

  if (!sheet?.id) notFound();

  return await repo.exportAsCsv(sheet.id);
}
export const cardCache = new RedisRTC<GameVersion>("cards", (gameVer) =>
  downloadSheet(gameVer.gameName, gameVer.version),
);

export const mapArtURL = async (
  game: string,
  artName: string,
): Promise<string> => {
  const drive = DriveClient.getInstance().drive();
  const parentId = getRootId(game);
  const art_folder_id = await folderIdMap.get({
    name: "art",
    parentId,
  });
  return drive.files
    .list({ q: `name = '${artName}' and parents in '${art_folder_id}'` })
    .then((r) => {
      const id = (r.data.files || [])[0]?.id;
      if (id) {
        return `https://lh3.googleusercontent.com/d/${id}`;
      } else {
        return Promise.reject(
          `image '${artName}' not found in ${art_folder_id}`,
        );
      }
    });
};

export const first = (
  stringOrArray: string | string[] | undefined,
): string | undefined => {
  return Array.isArray(stringOrArray) ? stringOrArray[0] : stringOrArray;
};

export const debugLog = (message?: any, ...optionalParams: any[]): void => {
  if (process.env.NODE_ENV != "production") {
    optionalParams.length > 0
      ? console.log(message, optionalParams)
      : console.log(message);
  }
};
