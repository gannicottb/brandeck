import { GetServerSideProps, GetStaticProps, NextPage } from "next"
import styles from '../../styles/Cards.module.css'
import { Card as V2Card } from '../../components/v2/Card'
import { importer, mapArtURL, getVersion } from '../../lib/import'
import { parser } from '../../lib/parse'
import { ParsedCard } from '../../lib/parse'
import { Version } from "../../lib/utils"
import { RedisRTC } from "../../lib/RedisRTC"

const artURLCache = new RedisRTC<string>((artName) => mapArtURL(artName))

// This function gets called at request time
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ver = await getVersion(context.params?.version || [])

  console.log(`key = ${JSON.stringify(ver)}`)

  const raw = await importer(ver)

  const parsed = await parser(raw).then((parsed) => parsed)
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
        return <>
          {(version.major == 2) && <V2Card
            key={i}
            data={c}
          />}
          {(i > 0 && i % 9 == 0) && <div className={styles.print_break} key={`pb-${i}`}></div>}
        </>

      })}
    </div>
  )
}
export default Cards