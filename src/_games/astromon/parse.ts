import { CardRow } from "@/app/lib/CardRow";
import { parseSheet } from "@/app/lib/ParseSheet";
import { Version } from "@/app/lib/Version";
import { icon, iconCircled } from "./utils";

export interface CardData extends CardRow {
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
  art: string;
  text: string;
}

export interface CardProps {
  data: CardData,
  size: string
}

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

export const customFormat = (text: string) => {
  const fmt = text
    .replaceAll("[columns]", `<div class="columns">`)
    .replaceAll("[col]", `<div class="col">`)
    .replaceAll("[row]", `<div class="row">`)
    .replaceAll(/\[\/.*\]/g, "</div>")

  return fmt
}

export async function _parseSheet(csv: string) {
  return parseSheet<CardData>(csv, (data: CardData) => {
    return {
      name: data.name,
      cost: Number(data.cost),
      type: data.type,
      subtype: data.subtype || "",
      biome: data.biome,
      skillType: data.skillType || "",
      skillValue: Number(data.skillValue),
      bonusSkill: Number(data.bonusSkill),
      evolveCost: interpolateIcons(data.evolveCost || "", { major: 8, minor: 0 }),
      speed: Number(data.speed),
      strength: Number(data.strength),
      family: Number(data.family),
      psychic: Number(data.psychic),
      bonusEffect: interpolateIcons(data.bonusEffect || "", { major: 8, minor: 0 }),
      bonusStars: Number(data.bonusStars),
      bonusStat: Number(data.bonusStat),
      draw: Number(data.draw),
      build: Number(data.build),
      recruit: Number(data.recruit),
      num: data.num,
      art: data.art,
      text: interpolateIcons(customFormat(data.text), { major: 8, minor: 0 })
    }
  })
}