import { GetServerSideProps, NextPage } from "next"
import styles from 'styles/Cards.module.css'
import { Card as V2Card } from 'components/astromon/v2/Card'
import { Card as V3Card } from 'components/astromon/v3/Card'
import { importer, mapArtURL, getVersion } from 'lib/import'
import { parser } from 'lib/astromon/parse'
import { ParsedCard } from 'lib/astromon/parse'
import { Version } from "lib/utils"
import { RedisRTC } from "lib/RedisRTC"
import React from "react"

// This can just live here. We'd make another one for each other game.
const artURLCache = new RedisRTC<string>("art", (artName) => mapArtURL("astromon", artName))

// This function gets called at request time
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ver = getVersion(context.params?.version || [])

  const raw = await importer("astromon", ver)

  const parsed = await parser(raw)

  // Resolve art names to urls (cached)
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
        return <React.Fragment key={i}>
          {(version.major == 2) && <V2Card data={c} />}
          {(version.major == 3) && <V3Card data={c} />}
          {(i > 0 && i % 9 == 0) && <div className={styles.print_break} />}
        </React.Fragment>
      })}
    </div>
  )
}
export default Cards