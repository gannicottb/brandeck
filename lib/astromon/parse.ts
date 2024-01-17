import { parseString } from '@fast-csv/parse';
import { icon, iconCircled } from 'lib/astromon/utils';
import { customFormat } from 'lib/utils';
import { Version } from '@/app/lib/Version'

// starting from 2.0
type CardRow = {
  Name: string;
  Cost: string;
  Type: string;
  Subtype: string;
  Biome: string;
  SkillType: string;
  SkillValue: string;
  BonusSkill: string;
  EvolveCost: string;
  Speed: string;
  Strength: string;
  Family: string;
  Psychic: string;
  BonusEffect: string;
  BonusStars: number;
  BonusStat: number;
  Draw: number;
  Build: number;
  Recruit: number;
  Num: string;
  Art: string;
  Text: string;
};

export type ParsedCard = {
  name: string;
  cost: number;
  type: string;
  subtype: string;
  biome: string;
  skillType: string;
  skillValue: number;
  bonusSkill: number;
  evolveCost: string;
  speed: number;
  strength: number;
  family: number;
  psychic: number;
  bonusEffect: string;
  bonusStars: number;
  bonusStat: number;
  draw: number;
  build: number;
  recruit: number;
  num: number;
  art: string;
  text: string;
};

const interpolateIcons = (text: string, version: Version) => {
  return text
    .replaceAll("(Spd)", iconCircled("spd"))
    .replaceAll("(Str)", iconCircled("str"))
    .replaceAll("(Fam)", iconCircled("fam"))
    .replaceAll("(Psy)", iconCircled("psy"))
    .replaceAll("(Spc)", iconCircled("special"))
    .replaceAll("(Cave)", iconCircled("cave"))
    .replaceAll("(Desert)", iconCircled("desert"))
    .replaceAll("(Forest)", iconCircled("forest"))
    .replaceAll("(Ocean)", iconCircled("ocean"))
    .replaceAll("(Tundra)", iconCircled("tundra"))
    .replaceAll("(C)", iconCircled("cave"))
    .replaceAll("(D)", iconCircled("desert"))
    .replaceAll("(F)", iconCircled("forest"))
    .replaceAll("(O)", iconCircled("ocean"))
    .replaceAll("(A)", icon("action"))
    .replaceAll("(S)", icon("side-action"))
    .replaceAll("(Star)", icon("star"))
    .replaceAll(
      "(Draw)",
      version.major == 6 ? icon("draw1st") : (
        version.major == 8 ? icon("draw-icon") : icon("draw")
      )
    )
    .replaceAll(
      "(Retrieve)",
      version.major == 6 ? icon("retrieve1st") : (
        version.major == 8 ? icon("retrieve-icon") : icon("retrieve")
      )
    )
    .replaceAll("(Side)", icon("side"))
    .replaceAll("(Double)", icon("double"))
    .replaceAll(
      "(Discount)",
      version.major == 6 ? icon("discount-energy") : icon("discount")
    )
    .replaceAll("(!)", iconCircled("interrupt"))
    .replaceAll("(E)", icon("energy"))
    .replaceAll("(?)", iconCircled("any"))

}

// could dry this up to allow for other games to easily use the same logic
export const parser = (csv: string, version: Version) => {
  return new Promise<ParsedCard[]>(resolve => {
    let result: ParsedCard[] = []
    parseString<CardRow, ParsedCard>(csv, { headers: true })
      .transform((data: CardRow): ParsedCard => ({
        name: data.Name,
        cost: Number(data.Cost),
        type: data.Type,
        subtype: data.Subtype || "",
        biome: data.Biome,
        skillType: data.SkillType || "",
        skillValue: Number(data.SkillValue),
        bonusSkill: Number(data.BonusSkill),
        evolveCost: interpolateIcons(data.EvolveCost || "", version),
        speed: Number(data.Speed),
        strength: Number(data.Strength),
        family: Number(data.Family),
        psychic: Number(data.Psychic),
        bonusEffect: interpolateIcons(data.BonusEffect || "", version),
        bonusStars: Number(data.BonusStars),
        bonusStat: Number(data.BonusStat),
        draw: Number(data.Draw),
        build: Number(data.Build),
        recruit: Number(data.Recruit),
        num: Number(data.Num),
        art: data.Art,
        text: interpolateIcons(customFormat(data.Text), version)
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