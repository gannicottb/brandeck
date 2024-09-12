import { Card } from "./Card"
import { _parseSheet } from "../parse"
import { Container } from "@/app/components/Container"
import { downloadSheet } from "@/app/lib/Utils"
import { CardPageProps } from "@/app/lib/CardPageProps"
import { artURLCache } from "../utils"
import { Condition } from "@/app/lib/Filters"

export default async function Cards({ gameVer, size, filters }: CardPageProps) {
  const raw = await downloadSheet(gameVer.gameName, gameVer.version)
  const parsed = await _parseSheet(raw)
  const filter = Condition.fromString(filters.query)
  const cards = await Promise.all(parsed.map(async (c) => {
    const artURL = await artURLCache.get(c.art)
    c.art = artURL
    return c;
  }))

  return (
    <Container cards={cards.filter(c => filter.test(c)).map((r, i) => <Card data={r} key={i} size={size} />)} />
  )
}