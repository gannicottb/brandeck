import { GameVersion } from "./GameVersion"
import { Dict } from "./Utils"

export const CardSizes: Dict = {
  small: "w-[180px] h-[252px]",
  medium: "w-[375px] h-[525px]",
  print: "w-[232.5px] h-[325.5px]",
  full: "w-[750px] h-[1050px]"
}
export interface CardPageProps {
  gameVer: GameVersion
  size: string
}