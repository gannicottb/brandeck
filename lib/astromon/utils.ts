/**
 * Astromon-specific utilities
 */

export const icon = (code: string): string => {
  switch (code.toLowerCase()) {
    case "spd":
      return "๐จ"
    case "str":
      return "๐ช"
    case "fam":
      return "๐ฉโ๐งโ๐ฆ"
    case "psy":
      return "๐ง "
    case "cave":
    case "c":
      return "๐ณ"
    // return "<span class='icon cave'></span>"
    case "desert":
    case "d":
      return "๐"
    // return "<span class='icon desert'></span>"
    case "forest":
    case "f":
      return "๐ฒ"
    // return "<span class='icon forest'></span>"
    case "ocean":
    case "o":
      return "๐"
    // return "<span class='icon ocean'></span>"
    case "summer":
      return "โ๏ธ"
    case "winter":
      return "โ๏ธ"
    case "any":
      return "โ"
    case "action":
      return "โบ"
    default:
      return "unknown"
  }
}