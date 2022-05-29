import type { NextApiRequest, NextApiResponse } from 'next'
import * as importer from '../../../lib/import'
import * as parser from '../../../lib/parse'

// This endpoint is just testing my ability to read from Drive
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { version } = req.query
  const firstVersionParam = Array.isArray(version) ? version[0] : version
  const versionToUse = firstVersionParam === undefined ? "latest" : firstVersionParam
  console.log(`Importing ${versionToUse}`)
  const raw = await importer.default(versionToUse)

  const data = await parser.default(raw).then((parsed) => parsed)

  // This downloads the file
  // res.status(200).send(Buffer.from(raw))
  res.status(200).json({ result: data })
}