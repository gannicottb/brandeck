import { GiAcid, GiAcidBlob, GiAgave, GiAnimalHide, GiCardDraw, GiCardPick, GiChatBubble, GiCoalPile, GiMinerals, GiMushroomGills } from 'react-icons/gi';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import {
  PiCoinBold,
  PiNumberCircleFiveBold, PiNumberCircleFourBold,
  PiNumberCircleOneBold, PiNumberCircleSixBold,
  PiNumberCircleThreeBold, PiNumberCircleTwoBold
} from "react-icons/pi";

export default function iconFor(iconKey: string) {
  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "potion": return <GiAcid style={{ display: "unset" }} />
    case "ask": return <GiChatBubble style={{ display: "unset" }} />
    case "gold": return <PiCoinBold color={"gold"} style={{ display: "unset" }} />
    case "grade-1": return <PiNumberCircleOneBold style={{ display: "unset" }} />
    case "grade-2": return <PiNumberCircleTwoBold style={{ display: "unset" }} />
    case "grade-3": return <PiNumberCircleThreeBold style={{ display: "unset" }} />
    case "grade-4": return <PiNumberCircleFourBold style={{ display: "unset" }} />
    case "grade-5": return <PiNumberCircleFiveBold style={{ display: "unset" }} />
    case "grade-6": return <PiNumberCircleSixBold style={{ display: "unset" }} />
    case "fungus": return <GiMushroomGills style={{ display: "unset" }} />
    case "slime": return <GiAcidBlob style={{ display: "unset" }} />
    case "offal": return <GiAnimalHide style={{ display: "unset" }} />
    case "mineral": return <GiMinerals style={{ display: "unset" }} />
    case "flora": return <GiAgave style={{ display: "unset" }} />
    case "terroir": return <GiCoalPile style={{ display: "unset" }} />
    case "draw": return <GiCardDraw style={{ display: "unset" }} />
    case "antidote": return <IoArrowUndoCircleOutline style={{ display: "unset" }} />
    case "diff-grades": return <GiCardPick style={{ display: "unset" }} />

    default:
      return <span>No Icon Found</span>
  }
}