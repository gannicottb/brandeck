import { IconBaseProps } from "react-icons";
import * as io5 from "react-icons/io5";
import * as gi from "react-icons/gi";
import * as bs from "react-icons/bs";
import {
  TbMeeple,
  TbPlayCard,
  TbPlayCardOff,
  TbGhost2Filled,
} from "react-icons/tb";
import { FaPlus, FaSquare, FaLock } from "react-icons/fa";

export default function iconFor(iconKey: string, extraProps?: IconBaseProps) {
  const props = { style: { display: "unset" }, ...extraProps };
  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "star":
      return <io5.IoStar {...props} />;
    case "ecto":
      return <gi.GiAbstract013 {...props} />;
    case "fear":
      return <gi.GiGhost {...props} />;
    case "lurk":
      return <gi.GiSunkenEye {...props} />;
    case "dot":
      return <bs.BsDot {...props} />;
    case "draw":
      return <TbPlayCard size={"1.25em"} {...props} />;
    case "discard":
      return <TbPlayCardOff size={"1.25em"} {...props} />;
    case "lock":
      // return <gi.GiPadlock {...props} />;
      return <FaLock {...props} />;
    case "mortal":
      return <TbMeeple fill="green" stroke="black" {...props} />;
    case "exorcist":
      return <TbMeeple color="white" stroke="black" {...props} />;
    case "plus":
      return <FaPlus {...props} />;
    case "blue":
      return <FaSquare fill="blue" {...props} />;
    case "red":
      return <FaSquare fill="red" {...props} />;
    case "yellow":
      return <FaSquare fill="gold" {...props} />;
    case "black":
      return <FaSquare fill="black" {...props} />;
    case "jumpscare":
      return <TbGhost2Filled {...props} />;
    case "hand_reach":
      return <gi.GiHand {...props} />;
    default:
      return <span>⚠️</span>;
  }
}
