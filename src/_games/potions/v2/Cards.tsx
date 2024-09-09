import Card from "./Card"
import { _parseSheet } from "./parse"
import { Container } from "@/app/components/Container"
import { downloadSheet } from "@/app/lib/Utils"
import { CardPageProps } from "@/app/lib/CardPageProps"
import { Filters, demo } from "../../../app/lib/Filters"

export default async function Cards({ gameVer, size, filters }: CardPageProps) {
  const raw = await downloadSheet(gameVer.gameName, gameVer.version)
  const parsed = await _parseSheet(raw)
  const allFilters = new Filters(filters)
  const { x, y, yyy, yyyy, zz } = demo
  console.log(x)
  console.log(y(parsed[0]))
  // console.log(z([
  //   parsed[0].type === "Compendium",
  //   parsed[0].type === "Ingredient",
  // ], "OR"))
  // console.log(demo[2])
  return (
    <Container cards={
      parsed
        // .filter(c => allFilters.allows(c))
        .filter(c => zz.check(c))
        .map((r, i) => <Card data={r} key={i} size={size} />)
    } />
  )
}