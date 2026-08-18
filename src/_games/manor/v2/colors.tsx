export function cssColor(factionCode?: string) {
  switch (factionCode) {
    case "B":
      return "cornflowerblue";
    case "C":
      return "maroon";
    case "R":
      return "gold";
    case "M":
      return "black";
    default:
      return "gray";
  }
}
// These are CSS color names: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/named-color
export function factionColors(factionCode?: string) {
    switch (factionCode) {
    case "B":
      return { css: "cornflowerblue", tw: "blue-500"};
    case "C":
      return { css: "maroon", tw: "rose-600"};
    case "R":
      return { css: "gold", tw: "yellow-500"};
    case "M":
      return { css: "black", tw: "black"};
    default:
      return { css: "gray", tw: "gray-400"};
  }
}

export function tailwindColor(factionCode?: string) {
  switch (factionCode) {
    case "B":
      return "blue-500";
    case "C":
      return "rose-600";
    case "R":
      return "yellow-500";
    case "M":
      return "black";
    default:
      return "gray-400";
  }
}