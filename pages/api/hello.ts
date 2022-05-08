// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const puppeteer = require('puppeteer');

  (async () => {
    const browser = await puppeteer.launch({ defaultViewport: { width: 1200, height: 2400 } });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/grid');
    await page.screenshot({ path: "screenshots/full.png" })

    const cardWidth = 375
    const cardHeight = 525
    const cardsPerRow = 3

    const result = await page.$eval('#container', (e: Element) => {
      const rect = e.getBoundingClientRect()
      return { x: rect.x, y: rect.y, total: e.childElementCount }
    })

    await Promise.all(Array.from(Array(result.total).keys()).map(async (i) => {
      const offsetX = cardWidth * (i % cardsPerRow)
      const offsetY = cardHeight * Math.floor(i / cardsPerRow)
      const grabX = result.x + offsetX
      const grabY = result.y + offsetY
      console.log(`${i}: ${offsetX},${offsetY} -> ${grabX},${grabY}`)
      const promise = await page.screenshot({
        path: `screenshots/card_${i}.png`,
        clip: { x: grabX, y: grabY, width: cardWidth, height: cardHeight }
      });
      return promise
    }
    ))

    // It should be possible to skip saving to local fs and upload to Google Drive directly
    await browser.close();
    res.status(200).json({ name: result })
  })();
}
