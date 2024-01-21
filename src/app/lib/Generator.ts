import { DriveClient } from "./DriveClient";
import { GameVersion } from "./GameVersion";
import * as puppeteer from 'puppeteer'
import { FolderType, folderIdMap, getRootId } from "./Utils";
import { Readable } from "stream";
/*
  This function performs a full generation of card images for the given version,
  and automatically uploads them to EXPORT_FOLDER_ID
*/
export default async function generateAndUpload(gameVer: GameVersion) {
  const { gameName, version } = gameVer
  const drive = DriveClient.getInstance().drive()
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1200, height: 2400 },
    args: ['--no-sandbox'],
    executablePath: process.env.NODE_ENV == "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : undefined
  });
  const page = await browser.newPage();
  // redirect error logs
  page.on('console', (msg) => msg.type() == "error" && console.log(msg))
  // Go to the appropriate cards page
  const host = `${process.env.HOST}`
  const cardsUrl = `${host}/${gameName}/cards/${version.major}.${version.minor}?size=full`
  await page.goto(cardsUrl,
    { "waitUntil": "networkidle0" }
  );

  const cardWidth = 750
  const cardHeight = 1050
  const cardsPerRow = 1

  const result = await page.$eval('#container', (e: Element) => {
    const rect = e.getBoundingClientRect()
    const total = e.querySelectorAll("div[class*='card']").length
    return { x: rect.x, y: rect.y, total }
  })

  const now = new Date()

  const exportFolderId = await folderIdMap.get({ name: "generated", parentId: getRootId(gameName) })
  const batchFolder = await drive.files.create({
    requestBody: {
      name: `V${version.major}.${version.minor}-${now.toISOString()}`,
      mimeType: FolderType,
      parents: [exportFolderId]
    }
  })
  const cardIndexRange = Array.from(Array(result.total).keys())

  await Promise.all(cardIndexRange.map(async (i) => {
    const offsetX = cardWidth * (i % cardsPerRow)
    const offsetY = cardHeight * Math.floor(i / cardsPerRow)
    const grabX = result.x + offsetX
    const grabY = result.y + offsetY

    // Take the screenshot
    const buffer = await page.screenshot({
      clip: { x: grabX, y: grabY, width: cardWidth, height: cardHeight }
    });

    // Create a readable stream of the image
    const readable = new Readable()
    readable._read = () => { } // _read is required but you can noop it
    readable.push(buffer)
    readable.push(null)

    // Upload to drive
    await drive.files.create({
      requestBody: {
        name: `card_${i}.png`,
        mimeType: 'image/png',
        parents: batchFolder.data.id ? [batchFolder.data.id] : []
      },
      media: {
        mimeType: 'image/png',
        body: readable
      }
    })
    console.log(`Uploaded card_${i}.png`)
  }))
  await browser.close();
  console.log(`Finished generating images in ${batchFolder.data.name}`)
  return cardIndexRange.length
}
