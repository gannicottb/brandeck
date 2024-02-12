
import { FaPlus } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import {
  GiAcid, GiAcidBlob,
  GiAgave, GiAnimalHide,
  GiCardDraw, GiCardPick,
  GiCardPlay, GiCardRandom,
  GiChatBubble, GiCoalPile,
  GiHood, GiMineExplosion,
  GiMinerals, GiMushroomGills,
  GiRainbowStar
} from 'react-icons/gi';
import { ImCross } from 'react-icons/im';
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
    case "gold": return <PiCoinBold style={{ display: "unset" }} />
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
    case "antidote": return <FcCancel style={{ display: "unset" }} />
    case "diff-grades": return <GiCardPick style={{ display: "unset" }} />
    case "explode": return <GiMineExplosion style={{ display: "unset" }} />
    case "no": return <ImCross style={{ display: "unset" }} />
    case "plus": return <FaPlus style={{ display: "unset" }} />
    case "wholesaler": return <GiHood style={{ display: "unset" }} />
    case "wild": return <GiCardRandom style={{ display: "unset" }} />
    case "hold-card": return <GiCardPlay style={{ display: "unset" }} />
    case "rainbow": return <GiRainbowStar style={{ display: "unset" }} />
    default:
      return <span>No Icon Found</span>
  }
}