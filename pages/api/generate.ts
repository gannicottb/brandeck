// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as puppeteer from 'puppeteer'
import { FolderType, getClient } from '../../lib/import'
import { Readable } from 'stream'
import { ExportFolderId, getVersion } from '../../lib/utils'

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
  const ver = getVersion(req.query.version)
  const drive = getClient()
  const browser = await puppeteer.launch({ defaultViewport: { width: 1200, height: 2400 } });
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/cards/${ver.major}.${ver.minor}`);
  await page.screenshot({ path: "screenshots/full.png" })

  const cardWidth = 375
  const cardHeight = 525
  const cardsPerRow = 3

  const result = await page.$eval('#container', (e: Element) => {
    const rect = e.getBoundingClientRect()
    return { x: rect.x, y: rect.y, total: e.childElementCount }
  })

  const now = Date.now()

  const batchFolder = await drive.files.create({
    requestBody: {
      name: `V${ver.major}.${ver.minor}-${now}`,
      mimeType: FolderType,
      parents: [ExportFolderId]
    }
  })

  await Promise.all(Array.from(Array(result.total).keys()).map(async (i) => {
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
  }))

  await browser.close();
  res.status(200).json({ name: JSON.stringify(result) })
}
