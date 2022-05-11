import type { NextApiRequest, NextApiResponse } from 'next'
import * as importer from '../../lib/import'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  (async () => {
    const stream = await importer.default("1.2")

    res.status(200).send(stream)
  })()
}