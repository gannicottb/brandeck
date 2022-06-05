import { GetServerSideProps, GetStaticProps, NextPage } from "next"
import styles from '../../styles/Cards.module.css'
import { Card as V2Card } from '../../components/v2/Card'
import { importer, mapArtURL } from '../../lib/import'
import { parser } from '../../lib/parse'
import { ParsedCard } from '../../lib/parse'
import { getVersion, ReadThroughCache, Version } from "../../lib/utils"

const cardsCache = new ReadThroughCache<Version, string>((ver) => importer(ver))
const artURLCache = new ReadThroughCache<string, string>((artName) => mapArtURL(artName))

// This function gets called at request time
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ver = getVersion(context.params?.version || [])

  console.log(`key = ${JSON.stringify(ver)}`)
  let cached = await cardsCache.get(ver)

  const parsed = await parser(cached).then((parsed) => parsed)
  const cards = await Promise.all(parsed.map(async (c) => {
    const artURL = await artURLCache.get(c.art)
    c.art = artURL
    return c;
  }))

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
            data={c}
          />
        }
      }
      )}
    </div>
  )
}
export default Cards