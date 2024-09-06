
import { IconBaseProps } from 'react-icons';
import { FaPlus } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import {
  GiAcid, GiAcidBlob,
  GiAgave, GiAnimalHide,
  GiCauldron,
  GiCardExchange, GiCardPick,
  GiCardPlay, GiCardRandom,
  GiCoalPile,
  GiHood, GiMineExplosion,
  GiMinerals, GiMushroomGills,
  GiRainbowStar,
  GiShoppingCart,
  GiPolarStar
} from 'react-icons/gi';
import { GrMoney } from 'react-icons/gr';
import { ImCross } from 'react-icons/im';
import { IoSquareSharp, IoStar, IoTriangle } from 'react-icons/io5';
import {
  PiCoinBold,
  PiNumberCircleFiveBold, PiNumberCircleFourBold,
  PiNumberCircleOneBold, PiNumberCircleSixBold,
  PiNumberCircleThreeBold, PiNumberCircleTwoBold, PiQuestionBold
} from "react-icons/pi";
import { TbSalt } from 'react-icons/tb';

export default function iconFor(iconKey: string, extraProps?: IconBaseProps) {
  const props = { style: { display: "unset" }, ...extraProps }
  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "potion": return <GiAcid {...props} />
    case "gold": return <PiCoinBold {...props} />
    case "grade": return <PiQuestionBold {...props} />
    case "grade-1": return <PiNumberCircleOneBold {...props} />
    case "grade-2": return <PiNumberCircleTwoBold {...props} />
    case "grade-3": return <PiNumberCircleThreeBold {...props} />
    case "grade-4": return <PiNumberCircleFourBold {...props} />
    case "grade-5": return <PiNumberCircleFiveBold {...props} />
    case "grade-6": return <PiNumberCircleSixBold {...props} />
    case "fungus": return <GiMushroomGills {...props} />
    case "slime": return <GiAcidBlob {...props} />
    case "viscera": return <GiAnimalHide {...props} />
    case "mineral": return <GiMinerals {...props} />
    case "flora": return <GiAgave {...props} />
    case "soil": return <GiCoalPile {...props} />
    case "antidote": return <FcCancel {...props} />
    case "diff-grades": return <GiCardPick {...props} />
    case "explode": return <GiMineExplosion {...props} />
    case "no": return <ImCross {...props} />
    case "plus": return <FaPlus {...props} />
    case "wholesaler": return <GiHood {...props} />
    case "wild": return <GiCardRandom {...props} />
    case "hold-card": return <GiCardPlay {...props} />
    case "rainbow": return <GiRainbowStar {...props} />
    case "swap-cards": return <GiCardExchange {...props} />
    case "pot": return <GiCauldron {...props} />
    case "shopping": return <GiShoppingCart {...props} />
    case "score": return <GiPolarStar {...props} />
    case "payout": return <GrMoney {...props} />
    case "salt": return <TbSalt {...props} />
    case "square": return <IoSquareSharp {...props} />
    case "triangle": return <IoTriangle {...props} />
    case "star": return <IoStar {...props} />
    default:
      return <span>X</span>
  }
}