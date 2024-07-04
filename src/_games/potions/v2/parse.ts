import { CardRow } from "@/app/lib/CardRow";
import { parseSheet } from "@/app/lib/ParseSheet";
import { FilterableCard } from "@/app/lib/Filters"

export interface CardData extends CardRow, FilterableCard {
  name: string
  type: string
  subType: string
  text: string
  grade: string
  upgrade1: string
  upgrade2: string
  upgrade3: string
  upgrade4: string
  art: string
}

export interface CardProps {
  data: CardData
}

export async function _parseSheet(csv: string) {
  return parseSheet<CardData>(csv, (data: CardData) => {
    // Translate from reg link to direct link
    if (data.art.startsWith("http")) {
      data.art = data.art
        .replace("https://drive.google.com/file", "https://lh3.googleusercontent.com")
        .replace("/view?usp=drive_link", "")
    }
    return data
  })
}