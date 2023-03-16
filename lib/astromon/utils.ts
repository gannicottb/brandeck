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
      return "💜"
    case "psy":
    case "psychic":
      return "🌀"
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
    default:
      return "unknown"
  }
}

export interface FilterProps {
  types: string[],
  names: string[]
}
export interface Filters extends FilterProps { }
export class Filters {
  constructor({ types, names }: FilterProps = { types: [], names: [] }) {
    this.types = types
    this.names = names
  }
  allows(card: ParsedCard): boolean {
    let isAllowed = true

    if (this.types.length > 0) {
      isAllowed &&= this.types.includes(card.type.toLowerCase())
    }

    if (this.names.length > 0) {
      isAllowed &&= this.names.includes(card.name.toLowerCase())
    }

    return isAllowed
  }
}

export const getFilters = (query: ParsedUrlQuery): FilterProps => {
  // Use string delimited lists rather than repeated params
  const types = (first(query.filterType || [])?.split(",") || []).map(t => t.toLowerCase())
  const names = (first(query.filterName || [])?.split(",") || []).map(t => t.toLowerCase())

  return { types, names }
}