import { drive_v3, GaxiosPromise } from "@googleapis/drive";
import { DriveClient } from "./DriveClient";
import { GameVersion } from "./GameVersion";
import { Folder, folderIdMap, FolderType, getRootId } from "./Utils";
import { ArrayOps } from "./ArrayOps";
import { Readable } from "stream";
import { err, ok } from "neverthrow";
import { Version } from "./Version";

export interface FileSearchParams {
  nameEq?: string;
  nameContains?: string;
  isFolder?: boolean;
  parentsIn?: string;
  idEq?: string;
}

export class GameDataRepo {
  private static instance: GameDataRepo;
  /*
    Big picture: interactions with the Google Drive side of this project
    are fragmented (downloadSheet, generateAndUpload, etc) and not easily reusable.

    - I would love to be able to automatically create a major or minor version folder from here without
    having to do it myself.
    - I would like to easily add new types of data, like a decks.txt
    - The access should still be cached where appropriate
    */

  driveClient: DriveClient;

  gameVer?: GameVersion;

  constructor(gameVer?: GameVersion) {
    this.driveClient = DriveClient.getInstance();

    this.gameVer = gameVer;
  }

  public static getInstance(): GameDataRepo {
    if (!GameDataRepo.instance) {
      GameDataRepo.instance = new GameDataRepo();
    }
    return GameDataRepo.instance;
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

  // recursive builder to allow for .atVersion(gv).list() semantics
  atVersion(gameVer: GameVersion): GameDataRepo {
    return new GameDataRepo(gameVer);
  }

  // Turn FileSearchParams into a string[] of Google Drive conditions
  translateSearchParams(params: FileSearchParams): string[] {
    return [
      params.isFolder && `mimeType = '${FolderType}'`,
      params.nameContains && `name contains '${params.nameContains}'`,
      params.nameEq && `name = '${params.nameEq}'`,
      params.parentsIn && `parents in '${params.parentsIn}'`,
    ].flatMap((q) => (q ? [q] : []));
  }
  // Deduplicate and join conditions with AND
  makeQueryString(params: string[]) {
    return [...new Set(params)].join(" and ");
  }
  // if we have a GameVersion set, use that as the working folder for our operations
  async addVersionFolderAsParent(searchParams?: FileSearchParams) {
    return this.gameVer
      ? await this.getVersionFolderId(this.gameVer).then((id) => {
          return { parentsIn: id, ...searchParams };
        })
      : searchParams;
  }

  // Public-ish interface

  // list all files given FileSearchParams
  async list(searchParams?: FileSearchParams) {
    const params = await this.addVersionFolderAsParent(searchParams);

    const queryString = this.makeQueryString(
      params ? this.translateSearchParams(params) : [],
    );
    const { data } = await this.driveClient.drive().files.list({
      q: queryString,
    });
    return data.files || [];
  }
  async listV({
    searchParams,
    gameVer,
  }: {
    searchParams?: FileSearchParams;
    gameVer?: GameVersion;
  }) {
    // override parentsIn if gameVer is provided
    const params = gameVer
      ? await this.getVersionFolderId(gameVer).then((id) => {
          return { parentsIn: id, ...searchParams };
        })
      : searchParams;

    const queryString = this.makeQueryString(
      params ? this.translateSearchParams(params) : [],
    );
    const { data } = await this.driveClient.drive().files.list({
      q: queryString,
    });
    return data.files || [];
  }

  // Just grab the first result or undefined
  async getFirst(searchParams?: FileSearchParams) {
    const files = await this.list(searchParams);

    return ArrayOps.of(files).first();
  }
  // move a file with files.update (changing parentId)
  async moveFile(
    fileId: string,
    currentParents: string[],
    destinationParent: string,
  ) {
    const { data } = await this.driveClient.drive().files.update({
      fileId,
      removeParents: currentParents.join(","),
      addParents: destinationParent,
    });
    return data;
  }
  // copy a file with files.copy
  async copyFile(fileId: string, rename?: string) {
    const { data } = await this.driveClient.drive().files.copy({
      fileId,
      fields: "id, parents",
      ...(rename && {
        requestBody: {
          name: rename,
        },
      }),
    });
    return data;
  }
  // create a file
  // create a folder
  async createFolder(name: string, parent: string) {
    const { data } = await this.driveClient.drive().files.create({
      requestBody: {
        name: name,
        mimeType: FolderType,
        parents: [parent],
      },
    });
    return data;
    //return data.id ? ok(data) : err(`Folder ${name} not created (no id returned)`);
  }

  async getLatestVersionFolder(folders: drive_v3.Schema$File[]) {
    const majors: Folder[] = folders.reduce((valid, folder) => {
      if (folder.id && folder.name) {
        valid.push({ id: folder.id, name: folder.name });
      }
      return valid;
    }, [] as Folder[]);
    return ArrayOps.of(
      majors.sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    ).last();
  }

  async getLatestVersion(gameName: string): Promise<Version> {
    const allMajorVersions = await this.list({
      nameContains: "v",
      isFolder: true,
      parentsIn: getRootId(gameName),
    });
    const latestMajor = await this.getLatestVersionFolder(allMajorVersions);
    if (!latestMajor)
      throw new Error(`Couldn't find the latest major version for ${gameName}`);

    const minorVersions = await this.list({
      nameContains: ".",
      isFolder: true,
      parentsIn: latestMajor.id,
    });
    const latestMinor = await this.getLatestVersionFolder(minorVersions);
    if (!latestMinor)
      throw new Error(`Couldn't find the latest minor version for ${gameName}`);

    return Version.apply(
      Number(latestMajor.name.replace("v", "")),
      Number(latestMinor.name.replace(".", "")),
    );
  }

  // create a new version (major or minor) by copying all of the files in PREV then creating NEXT folder then updating copies to live in NEXT then renaming files
  // TODO: this is supposed to automatically start from latest
  async makeNextMinorVersion(gameName: string) {
    // todo: implement .atVersion differently, this is a confusing hack
    const latestVersion = await this.getLatestVersion(gameName);
    const nextVersion = Version.modify(latestVersion, (maj, min) => [
      maj,
      min + 1,
    ]);

    const currentFiles = await this.listV({
      gameVer: GameVersion.apply(gameName, latestVersion),
    });
    const filesToCopy = currentFiles.filter(
      (f) =>
        f.name?.startsWith("cards") ||
        f.name?.startsWith("rules") ||
        f.name?.startsWith("decks"),
    );

    const copies = await Promise.all(
      filesToCopy.map(async (f) => {
        // todo: hate this arghhh
        if (!f.id) {
          throw new Error("Copy didn't have an id");
        }
        return this.copyFile(
          f.id,
          f.name?.replace(
            Version.show(latestVersion),
            Version.show(nextVersion),
          ),
        );
      }),
    );
    // TODO: we look up the id of the major folder but only to get minor
    // we actually would like to get them both to make this operation easy
    const parentId = getRootId(gameName);

    const majorFolderId = await folderIdMap.get({
      name: `v${latestVersion.major}`,
      parentId,
    });

    const nextFolder = await this.createFolder(
      `.${nextVersion.minor}`,
      majorFolderId,
    );

    const moved = await Promise.all(
      copies.map(async (f) => {
        // todo: hate this arghhh
        if (!f.id || !f.parents || !nextFolder.id) {
          console.error(f);
          throw new Error(
            `Copy didn't have an id or parents, or maybe the nextFolder id was missing`,
          );
        }
        return this.moveFile(f.id, f.parents, nextFolder.id);
      }),
    );
    
    return moved;
  }
  // upload a png
  async uploadPng(buffer: Buffer, filename: string, parent: string) {
    // Create a readable stream of the image
    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(buffer);
    readable.push(null);

    // Upload to drive
    const uploadResult = await this.driveClient.drive().files.create({
      requestBody: {
        name: filename,
        mimeType: "image/png",
        parents: [parent],
      },
      media: {
        mimeType: "image/png",
        body: readable,
      },
    });
    if (uploadResult.data.id) {
      return ok(uploadResult.data);
    } else {
      return err(`Upload of ${filename} failed (no id returned).`);
    }
  }

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
