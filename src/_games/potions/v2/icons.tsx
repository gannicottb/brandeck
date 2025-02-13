
import { IconBaseProps } from 'react-icons';
import { FaPlus } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import * as gi from 'react-icons/gi';
import { GrMoney } from 'react-icons/gr';
import { ImCross } from 'react-icons/im';
import * as io5 from 'react-icons/io5';
import * as pi from "react-icons/pi";
import { TbSalt } from 'react-icons/tb';
import { ingredientColors } from './colors';

export default function iconFor(
  iconKey: string,
  withBackground: boolean = false,
  extraProps?: IconBaseProps) {

  const withBackgroundProps = withBackground ? backgroundProps(iconKey) : {} as IconBaseProps
  const props = { style: { display: "unset" }, ...mergeClassNames(withBackgroundProps, extraProps) }

  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "potion": return <gi.GiAcid {...props} />
    case "gold": return <pi.PiCoinBold {...props} />
    case "grade": return <pi.PiQuestionBold {...props} />
    case "grade-1": return <pi.PiNumberCircleOneBold {...props} />
    case "grade-2": return <pi.PiNumberCircleTwoBold {...props} />
    case "grade-3": return <pi.PiNumberCircleThreeBold {...props} />
    case "grade-4": return <pi.PiNumberCircleFourBold {...props} />
    case "grade-5": return <pi.PiNumberCircleFiveBold {...props} />
    case "grade-6": return <pi.PiNumberCircleSixBold {...props} />
    case "fungus": return <gi.GiMushroomGills {...props} />
    case "slime": return <gi.GiAcidBlob {...props} />
    case "viscera": return <gi.GiAnimalHide {...props} />
    case "mineral": return <gi.GiMinerals {...props} />
    case "flora": return <gi.GiAgave {...props} />
    case "soil": return <gi.GiCoalPile {...props} />
    case "antidote": return <FcCancel {...props} />
    case "diff-grades": return <gi.GiCardPick {...props} />
    case "explode": return <gi.GiMineExplosion {...props} />
    case "no": return <ImCross {...props} />
    case "plus": return <FaPlus {...props} />
    case "wholesaler": return <gi.GiHood {...props} />
    case "wild": return <gi.GiCardRandom {...props} />
    case "hold-card": return <gi.GiCardPlay {...props} />
    case "rainbow": return <gi.GiRainbowStar {...props} />
    case "swap-cards": return <gi.GiCardExchange {...props} />
    case "pot": return <gi.GiCauldron {...props} />
    case "shopping": return <gi.GiShoppingCart {...props} />
    case "score": return <gi.GiPolarStar {...props} />
    case "payout": return <GrMoney {...props} />
    case "salt": return <TbSalt {...props} />
    case "square": return <io5.IoSquareSharp {...props} />
    case "triangle": return <io5.IoTriangle {...props} />
    case "flag": return <io5.IoFlag {...props} />
    case "circle": return <io5.IoEllipse {...props} />
    case "spark": return <io5.IoFlash {...props} />
    case "star": return <io5.IoStar {...props} />
    default:
      return <span>⚠️</span>
  }
}

const backgroundProps = (iconKey: string): IconBaseProps => {
  const ingredientColor = ingredientColors[iconKey.toLowerCase()]
  if (!ingredientColor) return {} as IconBaseProps
  const split = ingredientColor.split("-")
  const shade = split.pop()
  const result = [...split, (Number(shade) - 100).toString()].join("-")
  const classNames = ingredientColor ? { className: [result.trim(), "rounded-md"].join(" ") } : {}

  return { ...classNames }
}

const mergeClassNames = (a: IconBaseProps, b?: IconBaseProps) => {
  return { ...a, ...b, className: [a.className, b?.className].join(" ") }
}
