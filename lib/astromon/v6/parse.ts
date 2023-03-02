import { parseString } from '@fast-csv/parse';
import { icon, iconCircled } from 'lib/astromon/utils';
import { customFormat } from 'lib/utils';

// starting from 2.0
type CardRow = {
  Name: string;
  Cost: string;
  Type: string;
  Biome: string;
  SkillType: string;
  SkillValue: string;
  BonusSkill: string;
  BonusEffect: string;
  BonusStars: number;
  Num: string;
  Art: string;
  Text: string;
};

export type ParsedCard = {
  name: string;
  cost: number;
  type: string;
  biome: string;
  skillType: string;
  skillValue: number;
  bonusSkill: number;
  bonusEffect: string;
  bonusStars: number;
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
    .replaceAll("(Star)", icon("star"))
    .replaceAll("(Draw)", icon("draw"))
    .replaceAll("(Retrieve)", icon("retrieve"))
    .replaceAll("(Side)", icon("side"))
    .replaceAll("(Discount)", icon("discount"))
    .replaceAll("(!)", iconCircled("interrupt"))
    .replaceAll("(E)", icon("energy"))
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
        skillType: data.SkillType,
        skillValue: Number(data.SkillValue),
        bonusSkill: Number(data.BonusSkill),
        bonusEffect: interpolateIcons(data.BonusEffect || ""),
        bonusStars: Number(data.BonusStars),
        num: Number(data.Num),
        art: data.Art,
        text: interpolateIcons(customFormat(data.Text))
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