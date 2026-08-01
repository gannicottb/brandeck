import { GaxiosPromise } from "@googleapis/drive";
import { DriveClient } from "./DriveClient";
import { GameVersion } from "./GameVersion";
import { folderIdMap, FolderType, getRootId } from "./Utils";
import { ArrayOps } from "./ArrayOps";

export interface FileSearchParams {
  nameEq?: string;
  nameContains?: string;
  isFolder?: boolean;
}

export class GameDataRepo {
  /*
    Big picture: interactions with the Google Drive side of this project
    are fragmented (downloadSheet, generateAndUpload, etc) and not easily reusable.

    - I would love to be able to automatically create a major or minor version folder from here without
    having to do it myself.
    - I would like to easily add new types of data, like a decks.txt
    - The access should still be cached where appropriate
    */

  driveClient: DriveClient;
  constructor() {
    this.driveClient = DriveClient.getInstance();
  }

  /*
    Starting from configured ROOT_ID for the game,
    drill down to the folder containing the version-specific data
    root_id/v{Major}/.{Minor}
  */
  async getVersionFolderId(gameVer: GameVersion) {
    const { gameName, version } = gameVer;

    // Dynamically access the root id for the requested game
    const parentId = getRootId(gameName);

    const majorFolderId = await folderIdMap.get({
      name: `v${version.major}`,
      parentId,
    });

    const minorFolderId = await folderIdMap.get({
      name: `.${version.minor}`,
      parentId: majorFolderId,
    });

    return minorFolderId;
  }
  // Turn FileSearchParams into a string[] of Google Drive conditions
  translateSearchParams(params: FileSearchParams): string[] {
    return [
      params.isFolder && `mimeType = '${FolderType}'`,
      params.nameContains && `name contains '${params.nameContains}'`,
      params.nameEq && `name = '${params.nameEq}'`,
    ].flatMap((q) => (q ? [q] : []));
  }
  // Deduplicate and join conditions with AND
  makeQueryString(params: string[]) {
    return [...new Set(params)].join(" and ");
  }

  // Public-ish interface

  // list all files for a GameVersion.
  async list(gameVer: GameVersion, searchParams?: FileSearchParams) {
    const versionFolderId = await this.getVersionFolderId(gameVer);
    const queryString = this.makeQueryString([
      `parents in '${versionFolderId}'`,
      ...(searchParams ? this.translateSearchParams(searchParams) : []),
    ]);
    const { data } = await this.driveClient.drive().files.list({
      q: queryString,
    });
    return data.files || [];
  }
  // Just grab the first result or undefined
  async getFirst(gameVer: GameVersion, searchParams?: FileSearchParams) {
    const files = await this.list(gameVer, searchParams);
    return ArrayOps.of(files).first();
  }
  // move a file with files.update (changing parentId)
  // copy a file with files.copy

  // download a file with files.export
  async exportAsText(fileId: string) {
    // Weird stuff here, has to do with the sdk not knowing what types it's returning
    // https://github.com/googleapis/google-api-nodejs-client/issues/1683
    const gaxios = await (this.driveClient.drive().files.export({
      fileId: fileId,
      mimeType: "text/plain",
    }) as unknown as GaxiosPromise<Blob>);

    return new Response(gaxios.data).text();
  }

  async exportAsCsv(fileId: string) {
    // Weird stuff here, has to do with the sdk not knowing what types it's returning
    // https://github.com/googleapis/google-api-nodejs-client/issues/1683
    const gaxios = await (this.driveClient.drive().files.export({
      fileId: fileId,
      mimeType: "text/csv",
    }) as unknown as GaxiosPromise<Blob>);

    return gaxios.data.text();
  }
}
