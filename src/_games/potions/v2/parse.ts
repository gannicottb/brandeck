import { CardRow } from "@/app/lib/CardRow";
import { parseSheet } from "@/app/lib/ParseSheet";
import { Filterable } from "@/app/lib/Filters"

export interface CardData extends CardRow, Filterable {
  name: string
  type: string
  subType: string
  text: string
  grade: string
  starterDeck: string | undefined
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
  }).then(cardData => { // Traverse the cards again because fast-csv.transform only takes one operand
    return cardData.reduce<[Record<string, string[]>, CardData[]]>(
      ([remainingCodes, result], card) => {
        const codesForCard = card.starterDeck?.split(",")
        // set the codes for a new id
        const currCodes =
          (remainingCodes[card.name] === undefined && codesForCard !== undefined) ?
            { ...remainingCodes, [card.name]: codesForCard } :
            remainingCodes

        // look up the next code for the current card, 
        // then put the card with that code into the result
        const code = currCodes[card.name]?.shift()
        return [currCodes, result.concat([{ ...card, starterDeck: code }])]
      }, [{}, []])[1]
  })
}