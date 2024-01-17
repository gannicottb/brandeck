import { CardRow } from "@/app/lib/CardRow";
import { parseSheet } from "@/app/lib/Utils";

export interface CardData extends CardRow {
  name: string
  type: string
  power: number // this is a lie until we mutate the object in transform
  art: string
  text: string
}

export interface CardProps {
  data: CardData
}

export async function _parseSheet(csv: string) {
  return parseSheet<CardData>(csv, (data: CardData) => {
    data.power = Number(data.power)
    // Translate from reg link to direct link
    if (data.art.startsWith("http")) {
      data.art = data.art
        .replace("https://drive.google.com/file", "https://lh3.googleusercontent.com")
        .replace("/view?usp=drive_link", "")
    }
    return data
  })
}