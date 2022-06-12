// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as puppeteer from 'puppeteer'
import { FolderType, folderIdMap } from 'lib/import'
import { Readable } from 'stream'
import { basicAuth, getRootId, sleep } from 'lib/utils'
import { DriveClient } from 'lib/DriveClient'
import { parseVersion } from 'lib/utils'

type Data = {
  name: string
}
/*
  This endpoint performs a full generation of card images for the given version,
  and automatically uploads them to EXPORT_FOLDER_ID
*/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV == "production") await basicAuth(req, res)

  const [game, version] = Object.keys(req.query || {})
    .filter((k) => ["game", "version"].includes(k))
    .map((k: string) => {
      const v = req.query[k]
      return Array.isArray(v) ? v[0] : v
    })
  if (!game || !version) { throw new Error(`Cannot render cards for unparseable game or version: ${req.query}`) }

  const ver = parseVersion(version)

  const drive = DriveClient.getInstance().drive()
  const browser = await puppeteer.launch({ defaultViewport: { width: 1200, height: 2400 } });
  const page = await browser.newPage();
  // redirect error logs
  page.on('console', (msg) => msg.type() == "error" && console.log(msg))
  // Go to the appropriate cards page
  // todo: needs to go to brandeck.herokuapp.com in production
  // todo: /cards needs size controls so that we can ensure correctness
  const cardsUrl = `http://localhost:3000/${game}/cards/${ver.isLatest ? "latest" : `${ver.major}.${ver.minor}`}`
  await page.goto(cardsUrl,
    { "waitUntil": "networkidle0" }
  );

  const cardWidth = 375
  const cardHeight = 525
  const cardsPerRow = 3

  const result = await page.$eval('#container', (e: Element) => {
    const rect = e.getBoundingClientRect()
    return { x: rect.x, y: rect.y, total: e.childElementCount }
  })

  const now = Date.now()

  const exportFolderId = await folderIdMap.get({ name: "generated", parentId: getRootId(game) })
  const batchFolder = await drive.files.create({
    requestBody: {
      name: `V${ver.major}.${ver.minor}-${now}`,
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
    // hack for rate limiting
    await sleep(300);
  }))

  await browser.close();
  console.log(`Finished generating images in ${batchFolder.data.name}`)
  res.status(200).json({ name: JSON.stringify(result) })
}
