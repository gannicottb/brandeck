import { parseString } from '@fast-csv/parse';
import { icon } from 'lib/astromon/utils';

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
    .replaceAll("(Spd)", `<span class='circled'>${icon("spd")}</span>`)
    .replaceAll("(Str)", `<span class='circled'>${icon("str")}</span>`)
    .replaceAll("(Fam)", `<span class='circled'>${icon("fam")}</span>`)
    .replaceAll("(Psy)", `<span class='circled'>${icon("psy")}</span>`)
    .replaceAll("(Cave)", `<span class='circled'>${icon("cave")}</span>`)
    .replaceAll("(Desert)", `<span class='circled'>${icon("desert")}</span>`)
    .replaceAll("(Forest)", `<span class='circled'>${icon("forest")}</span>`)
    .replaceAll("(Ocean)", `<span class='circled'>${icon("ocean")}</span>`)
    .replaceAll("(Any)", `<span class='circled'>${icon("any")}</span>`)
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
      .on('data', row => result.push(row))
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`)
        resolve(result)
      });
  })
}