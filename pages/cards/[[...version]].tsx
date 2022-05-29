import { GetServerSideProps, NextPage } from "next"
import type { NextApiRequest, NextApiResponse } from 'next'
import styles from '../../styles/Cards.module.css'
import { Card as V2Card } from '../../components/v2/Card'
import * as importer from '../../lib/import'
import * as parser from '../../lib/parse'
import { ParsedCard } from '../../lib/parse'
import { Version, parseVersion } from '../../lib/import'

var cache = require('memory-cache');

// This function gets called at request time
export const getServerSideProps: GetServerSideProps = async (context) => {
  // export async function getServerSideProps({ req }: SSPContext) {
  const version = context.params?.version
  const firstVersionParam = Array.isArray(version) ? version[0] : version
  const versionToUse = firstVersionParam === undefined ? "latest" : firstVersionParam
  console.log(`Importing ${versionToUse}`)
  const ver = parseVersion(versionToUse)

  console.log(`key = ${JSON.stringify(ver)}`)
  let cached = cache.get(JSON.stringify(ver))
  if (cached == null) {
    console.log("cache miss!")
    const fresh = await importer.default(ver)
    cache.put(JSON.stringify(ver), fresh)
    cached = fresh
  } else {
    console.log("cache hit :)")
  }

  const cards = await parser.default(cached).then((parsed) => parsed)

  return {
    props: {
      version: ver,
      cards,
    },
  }
}
interface CardsProps {
  version: Version,
  cards: ParsedCard[]
}
const Cards: NextPage<CardsProps, {}> = ({ version, cards }: CardsProps) => {
  return (
    <div id='container' className={styles.container}>
      {cards.map((c, i) => {
        if (version.major == 2) {
          return <V2Card
            key={i}
            {...c}
          />
        }
      }
      )}
    </div>
  )
}
export default Cards