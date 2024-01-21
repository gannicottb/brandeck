import { Card } from "./Card"
import { _parseSheet } from "../parse"
import { Container } from "@/app/components/Container"
import { downloadSheet } from "@/app/lib/Utils"
import { CardPageProps } from "@/app/lib/CardPageProps"
import { artURLCache } from "../utils"

export default async function Cards({ gameVer, size }: CardPageProps) {
  const raw = await downloadSheet(gameVer.gameName, gameVer.version)
  const parsed = await _parseSheet(raw)

  const cards = await Promise.all(parsed.map(async (c) => {
    const artURL = await artURLCache.get(c.art)
    c.art = artURL
    return c;
  }))

  return (
    <Container cards={cards.map((r, i) => <Card data={r} key={i} size={size} />)} />
  )
}