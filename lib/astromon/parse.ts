import { parseString } from '@fast-csv/parse';
import { icon, iconCircled } from 'lib/astromon/utils';

// starting from 2.0
type CardRow = {
  Name: string;
  Cost: string;
  Type: string;
  Biome: string;
  Speed: string;
  Strength: string;
  Family: string;
  Psychic: string;
  Num: string;
  Art: string;
  Text: string;
};

export type ParsedCard = {
  name: string;
  cost: number;
  type: string;
  biome: string;
  speed: number;
  strength: number;
  family: number;
  psychic: number;
  num: number;
  art: string;
  text: string;
};

const interpolateIcons = (text: string) => {
  return text
    .replaceAll("(Spd)", iconCircled("spd"))
    .replaceAll("(Str)", iconCircled("str"))
    .replaceAll("(Fam)", iconCircled("fam"))
    .replaceAll("(Psy)", iconCircled("psy"))
    .replaceAll("(Cave)", iconCircled("cave"))
    .replaceAll("(Desert)", iconCircled("desert"))
    .replaceAll("(Forest)", iconCircled("forest"))
    .replaceAll("(Ocean)", iconCircled("ocean"))
    .replaceAll("(A)", icon("action"))
  // .replaceAll("Summer", `<span class='circled'>${icon("summer")}</span>`)
  // .replaceAll("Winter", `<span class='circled'>${icon("winter")}</span>`)
}

// could dry this up to allow for other games to easily use the same logic
export const parser = (csv: string) => {
  return new Promise<ParsedCard[]>(resolve => {
    let result: ParsedCard[] = []
    parseString<CardRow, ParsedCard>(csv, { headers: true })
      .transform((data: CardRow): ParsedCard => ({
        name: data.Name,
        cost: Number(data.Cost),
        type: data.Type,
        biome: data.Biome,
        speed: Number(data.Speed),
        strength: Number(data.Strength),
        family: Number(data.Family),
        psychic: Number(data.Psychic),
        num: Number(data.Num),
        art: data.Art,
        text: interpolateIcons(data.Text)
      })

      )
      .on('error', error => console.error(error))
      .on('data', (row: ParsedCard) => [...Array(row.num)].forEach((_, i) => result.push(row)))
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`)
        resolve(result)
      });
  })
}