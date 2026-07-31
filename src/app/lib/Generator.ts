import { DriveClient } from "./DriveClient";
import { GameVersion } from "./GameVersion";
import * as puppeteer from "puppeteer";
import { FolderType, folderIdMap, getRootId, ttsCache } from "./Utils";
import { Readable } from "stream";
import { TtsCardSheetEntries, TtsCardSheetEntrySchema } from "./TtsCache";

interface BrandeckSheetElement {
  x: number;
  y: number;
  w: number;
  h: number;
  total: number;
}

// This is quite similar to the previous version in the end, I think they can be merged
export default async function generateAndUpload(
  gameVer: GameVersion,
  filterQuery: string, // probably not needed but technically interesting.
): Promise<TtsCardSheetEntries> {
  const { gameName, version } = gameVer;
  const drive = DriveClient.getInstance().drive();
  const browser = await puppeteer.launch({
    defaultViewport: { width: 4096, height: 4096 },
    args: ["--no-sandbox"],
    executablePath:
      process.env.NODE_ENV == "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : undefined,
  });
  const page = await browser.newPage();
  // redirect error logs
  page.on("console", (msg) => msg.type() == "error" && console.log(msg));
  // Go to the appropriate cards page
  const host = `${process.env.HOST}`;
  const cardsUrl = `${host}/${gameName}/cards/${version.major}.${version.minor}?renderMode=tts&q=${filterQuery}`;
  await page.goto(cardsUrl, { waitUntil: "networkidle0" });

  const sheets: BrandeckSheetElement[] = await page.$eval(
    "#container",
    (container: Element) => {
      const sheetDivs = container.querySelectorAll("div[class*='sheet']");
      return Array.from(sheetDivs.entries())
        .map(([_, sheet]) => {
          const rect = sheet.getBoundingClientRect();
          const cardsInSheet =
            sheet.querySelectorAll("div[class*='card']").length;
          return {
            x: rect.x,
            y: rect.y,
            w: rect.width,
            h: rect.height,
            total: cardsInSheet,
          };
        })
    },
  );

  const now = new Date();
  // I think it doesn't matter where these files go because we return fileIds via the api
  const exportFolderId = await folderIdMap.get({
    name: "generated",
    parentId: getRootId(gameName),
  });
  const batchFolder = await drive.files.create({
    requestBody: {
      name: `V${version.major}.${version.minor}-${now.toISOString()}`,
      mimeType: FolderType,
      parents: [exportFolderId],
    },
  });
  // The order is preserved with Promise.all, so the fileIds will be returned in render order
  const results: TtsCardSheetEntries = await Promise.all(
    sheets.map(async (sheet, sheetIdx) => {
      // Take the screenshot
      const buffer = await page.screenshot({
        clip: {
          x: sheet.x,
          y: sheet.y,
          width: sheet.w,
          height: sheet.h,
        },
      });

      // Create a readable stream of the image
      const readable = new Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(buffer);
      readable.push(null);

      // To make it easier to import manually into TTS, output as sheet-{index}-{width}x{height}-{numCards}.png
      const filename = `sheet-${sheetIdx}-10x7-${sheet.total}.png`;

      // Upload to drive
      const uploadResult = await drive.files.create({
        requestBody: {
          name: filename,
          mimeType: "image/png",
          parents: batchFolder.data.id ? [batchFolder.data.id] : [],
        },
        media: {
          mimeType: "image/png",
          body: readable,
        },
      });
      // Kind of gnarly but I don't know a better way to do this in TS
      if (!uploadResult.data.id) {
        throw new Error(`File ${filename} was not given a fileId!`);
      } else {
        console.log(`Uploaded ${filename}`);
        return TtsCardSheetEntrySchema.parse({
          fileId: uploadResult.data.id,
          count: sheet.total,
        });
      }
    }),
  );

  await browser.close();
  console.log(
    `Finished generating and uploading images in ${batchFolder.data.name}`,
  );
  await ttsCache.set(gameVer, results);
  console.log("Updated the TTS cache");
  return results;
}

/*
  This is the Tabletopia/single-card-image style uploader
*/
export async function generateAndUploadIndividualCards(
  gameVer: GameVersion,
  filterQuery: string,
) {
  const { gameName, version } = gameVer;
  const drive = DriveClient.getInstance().drive();
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1200, height: 2400 }, // fudge factor to fit a 750x1050 "full" size card
    args: ["--no-sandbox"],
    executablePath:
      process.env.NODE_ENV == "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : undefined,
  });
  const page = await browser.newPage();
  // redirect error logs
  page.on("console", (msg) => msg.type() == "error" && console.log(msg));
  // Go to the appropriate cards page
  const host = `${process.env.HOST}`;
  const cardsUrl = `${host}/${gameName}/cards/${version.major}.${version.minor}?size=full&q=${filterQuery}`;
  await page.goto(cardsUrl, { waitUntil: "networkidle0" });

  const cardWidth = 750;
  const cardHeight = 1050;
  const cardsPerRow = 1;

  const result = await page.$eval("#container", (e: Element) => {
    const rect = e.getBoundingClientRect();
    const total = e.querySelectorAll("div[class*='card']").length;
    return { x: rect.x, y: rect.y, total };
  });

  const now = new Date();

  const exportFolderId = await folderIdMap.get({
    name: "generated",
    parentId: getRootId(gameName),
  });
  const batchFolder = await drive.files.create({
    requestBody: {
      name: `V${version.major}.${version.minor}-${now.toISOString()}`,
      mimeType: FolderType,
      parents: [exportFolderId],
    },
  });
  const cardIndexRange = Array.from(Array(result.total).keys());

  await Promise.all(
    cardIndexRange.map(async (i) => {
      const offsetX = cardWidth * (i % cardsPerRow);
      const offsetY = cardHeight * Math.floor(i / cardsPerRow);
      const grabX = result.x + offsetX;
      const grabY = result.y + offsetY;

      // Take the screenshot
      const buffer = await page.screenshot({
        clip: { x: grabX, y: grabY, width: cardWidth, height: cardHeight },
      });

      // Create a readable stream of the image
      const readable = new Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(buffer);
      readable.push(null);

      // Upload to drive
      await drive.files.create({
        requestBody: {
          name: `card_${i}.png`,
          mimeType: "image/png",
          parents: batchFolder.data.id ? [batchFolder.data.id] : [],
        },
        media: {
          mimeType: "image/png",
          body: readable,
        },
      });
      console.log(`Uploaded card_${i}.png`);
    }),
  );
  await browser.close();
  console.log(`Finished generating images in ${batchFolder.data.name}`);
  return cardIndexRange.length;
}
