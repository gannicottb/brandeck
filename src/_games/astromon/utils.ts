import { ParsedUrlQuery } from "querystring"
import { CardData } from "./parse"
import { first, mapArtURL } from "@/app/lib/Utils"
import { RedisRTC } from "@/app/lib/RedisRTC"
import { FilterProps } from "@/app/lib/Filters"

export const artURLCache = new RedisRTC<string>("art", (artName) => mapArtURL("astromon", artName))

export const iconCircled = (code: string): string => {
  return `<span class='circled'>${icon(code)}</span>`
}
export const icon = (code: string): string => {
  switch (code.toLowerCase()) {
    case "spd":
    case "speed":
      return "🏁"
    case "str":
    case "strength":
      return "💪"
    case "fam":
    case "family":
      return "💜"
    case "psy":
    case "psychic":
      return "🌀"
    case "spc":
    case "special":
      return "🌟"
    case "cave":
    case "c":
      return "🦇"
    // return "🕳"
    // return "<span class='icon cave'></span>"
    case "desert":
    case "d":
      return "🏜"
    // return "<span class='icon desert'></span>"
    case "forest":
    case "f":
      return "🌲"
    // return "<span class='icon forest'></span>"
    case "ocean":
    case "o":
      return "💧"
    // return "<span class='icon ocean'></span>"
    case "tundra":
    case "t":
      return "❄️"
    case "summer":
      return "☀️"
    case "winter":
      return "☃️"
    case "any":
      return "❓"
    case "action":
      return "▶"
    case "star":
      return "⭐️"
    case "side-action":
      return "♢"
    case "energy":
      return "♦︎"
    case "draw":
      return "▶3🃏"
    case "retrieve":
      return "♢🚮🚮"
    case "side":
      return "♢♢"
    case "discount":
      return "[-1]"
    case "interrupt":
      return "❗️"
    case "double":
      return "✌️"
    case "draw1st":
      return "+🃏!"
    case "retrieve1st":
      return "+🚮!"
    case "discount-energy":
      return "[-♦︎]"
    case "draw-icon":
      return "🃏"
    case "retrieve-icon":
      return "🚮"
    case "build":
      return "🛠"
    default:
      return "unknown"
  }
}

export const getFilters = (query: ParsedUrlQuery): FilterProps => {
  // Use string delimited lists rather than repeated params
  const types = (first(query.filterType || [])?.split(",") || []).map(t => t.toLowerCase())
  const names = (first(query.filterName || [])?.split(",") || []).map(t => t.toLowerCase())

  return { types, names }
}