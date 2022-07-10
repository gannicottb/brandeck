/**
 * Astromon-specific utilities
 */

export const icon = (code: string): string => {
  switch (code.toLowerCase()) {
    case "spd":
      return "💨"
    case "str":
      return "💪"
    case "fam":
      return "👩‍👧‍👦"
    case "psy":
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
      return "🌊"
    // return "<span class='icon ocean'></span>"
    case "summer":
      return "☀️"
    case "winter":
      return "☃️"
    case "any":
      return "❓"
    default:
      return "unknown"
  }
}