
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

const props = { style: { display: "unset" } }

export default function iconFor(iconKey: string) {
  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "potion": return <GiAcid {...props} />
    case "ask": return <GiChatBubble {...props} />
    case "gold": return <PiCoinBold {...props} />
    case "grade-1": return <PiNumberCircleOneBold {...props} />
    case "grade-2": return <PiNumberCircleTwoBold {...props} />
    case "grade-3": return <PiNumberCircleThreeBold {...props} />
    case "grade-4": return <PiNumberCircleFourBold {...props} />
    case "grade-5": return <PiNumberCircleFiveBold {...props} />
    case "grade-6": return <PiNumberCircleSixBold {...props} />
    case "fungus": return <GiMushroomGills {...props} />
    case "slime": return <GiAcidBlob {...props} />
    case "offal": return <GiAnimalHide {...props} />
    case "mineral": return <GiMinerals {...props} />
    case "flora": return <GiAgave {...props} />
    case "terroir": return <GiCoalPile {...props} />
    case "draw": return <GiCardDraw {...props} />
    case "antidote": return <FcCancel {...props} />
    case "diff-grades": return <GiCardPick {...props} />
    case "explode": return <GiMineExplosion {...props} />
    case "no": return <ImCross {...props} />
    case "plus": return <FaPlus {...props} />
    case "wholesaler": return <GiHood {...props} />
    case "wild": return <GiCardRandom {...props} />
    case "hold-card": return <GiCardPlay {...props} />
    case "rainbow": return <GiRainbowStar {...props} />
    default:
      return <span>No Icon Found</span>
  }
}