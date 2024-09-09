import Card from "./Card"
import { _parseSheet } from "./parse"
import { Container } from "@/app/components/Container"
import { downloadSheet } from "@/app/lib/Utils"
import { CardPageProps } from "@/app/lib/CardPageProps"
import { Filter } from "@/app/lib/Filters"

export default async function Cards({ gameVer, size, filters }: CardPageProps) {
  const raw = await downloadSheet(gameVer.gameName, gameVer.version)
  const parsed = await _parseSheet(raw)
  const filter = new Filter(filters.query)
  return (
    <Container cards={
      parsed
        .filter(c => filter.allows(c))
        .map((r, i) => <Card data={r} key={i} size={size} />)
    } />
  )
}