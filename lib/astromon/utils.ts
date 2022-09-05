/**
 * Astromon-specific utilities
 */

import { first } from "lib/utils"
import { ParsedUrlQuery } from "querystring"
import { ParsedCard } from "./parse"

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
      return "🫂"
    case "psy":
    case "psychic":
      return "🧠"
    case "cave":
    case "c":
      return "🕳"
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
    default:
      return "unknown"
  }
}

export interface FilterProps {
  types: string[]
}
export interface Filters extends FilterProps { }
export class Filters {
  constructor({ types }: FilterProps = { types: [] }) {
    this.types = types
  }
  allows(card: ParsedCard): boolean {
    let isAllowed = true

    if (this.types.length > 0) {
      isAllowed &&= this.types.includes(card.type.toLowerCase())
    }

    return isAllowed
  }
}

export const getFilters = (query: ParsedUrlQuery): FilterProps => {
  const types = (first(query.filterType || [])?.split(",") || []).map(t => t.toLowerCase())

  return { types }
}