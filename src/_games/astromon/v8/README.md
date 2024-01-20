Look, I tried.

Still need to figure out filters generally.

```
import { GetServerSideProps, NextPage } from "next"
import styles from 'styles/Cards.module.scss'
import { Card as V2Card } from 'components/astromon/v2/Card'
import { Card as V3Card } from 'components/astromon/v3/Card'
import { Card as V4Card } from 'components/astromon/v4/Card'
import { Card as V5Card } from 'components/astromon/v5/Card'
import { Card as V6Card } from 'components/astromon/v6/Card'
import { Card as V7Card } from 'components/astromon/v7/Card'
import { Card as V8Card } from 'components/astromon/v8/Card'
import { getVersion } from 'lib/import'
import { mapArtURL, downloadSheet, first } from "@/app/lib/Utils"
import { parser } from 'lib/astromon/parse'
import { ParsedCard } from 'lib/astromon/parse'
import { Version } from "@/app/lib/Version"
import { RedisRTC } from "@/app/lib/RedisRTC"
import React from "react"
import { FilterProps, Filters, getFilters } from "lib/astromon/utils"

// This can just live here. We'd make another one for each other game.
const artURLCache = new RedisRTC<string>("art", (artName) => mapArtURL("astromon", artName))

// This function gets called at request time
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ver = getVersion(context.params?.version || [])

  const raw = await downloadSheet("astromon", ver)
  // The problem is that this is in pages and can't use 'fs'
  const parsed = await parser(raw, ver)

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
      size: first(context.query.size || []) || null,
      filters: getFilters(context.query)
    },
  }
}
interface CardsProps {
  version: Version,
  cards: ParsedCard[],
  size?: string,
  filters: FilterProps
}

const Cards: NextPage<CardsProps, {}> = ({ version, cards, size, filters }: CardsProps) => {
  const allFilters = new Filters(filters)
  return (
    <div id='container' className={styles.container}>
      {cards
        .filter((c) => allFilters.allows(c))
        .map((c, i) => {
          return <React.Fragment key={i}>
            {(version.major == 2) && <V2Card data={c} size={size} />}
            {(version.major == 3) && <V3Card data={c} size={size} />}
            {(version.major == 4) && <V4Card data={c} size={size} />}
            {(version.major == 5) && <V5Card data={c} size={size} />}
            {(version.major == 6) && <V6Card data={c} size={size} />}
            {(version.major == 7) && <V7Card data={c} size={size} />}
            {(version.major == 8) && <V8Card data={c} size={size} />}
            {(i > 0 && i % 9 == 0) && <div className={styles.print_break} />}
          </React.Fragment>
        })}
    </div>
  )
}
export default Cards
```