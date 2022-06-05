import { parseString } from '@fast-csv/parse';
import { icon } from './utils';

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
    .replaceAll("(Spd)", icon("spd"))
    .replaceAll("(Str)", icon("str"))
    .replaceAll("(Fam)", icon("fam"))
    .replaceAll("(Psy)", icon("psy"))
    .replaceAll("(Cave)", icon("cave"))
    .replaceAll("(Desert)", icon("desert"))
    .replaceAll("(Forest)", icon("forest"))
    .replaceAll("(Ocean)", icon("ocean"))
}

export const parser = async (csv: string) => {
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