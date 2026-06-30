import { CardRow } from "@/app/lib/CardRow";
import { parseSheet } from "@/app/lib/ParseSheet";
import { Filterable } from "@/app/lib/Filters"
import { GameVersion } from "@/app/lib/GameVersion";

export interface CardData extends CardRow, Filterable {
  name: string
  type: string
  cost: string
  faction: string
  text: string
  num: string
  art: string
}

export interface CardProps {
  data: CardData
  gameVer: GameVersion
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