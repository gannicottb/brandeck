import type { NextApiRequest, NextApiResponse } from 'next'
import * as importer from '../../lib/import'

// This endpoint is just testing my ability to read from Drive
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  (async () => {
    const data = await importer.default("2.0")

    // This downloads the file
    res.status(200).send(Buffer.from(data))
  })()
}