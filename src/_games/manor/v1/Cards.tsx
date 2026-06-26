import Card from "./Card"
import { _parseSheet } from "./parse"
import { Container } from "@/app/components/Container"
import { cardCache } from "@/app/lib/Utils"
import { CardPageProps } from "@/app/lib/CardPageProps"
import { Condition } from "@/app/lib/Filters"

export default async function Cards({ gameVer, size, filters }: CardPageProps) {
  const raw = await cardCache.get(gameVer)
  const parsed = await _parseSheet(raw)
  const filter = Condition.fromString(filters.query)
  return (
    <Container cards={
      parsed
        .filter(c => filter.test(c))
        .map((r, i) => <Card data={r} key={i} size={size} />)
    } />
  )
}