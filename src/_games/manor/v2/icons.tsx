import { IconBaseProps } from "react-icons";
import * as io5 from "react-icons/io5";
import * as gi from "react-icons/gi";
import * as bs from "react-icons/bs";
import * as tb from "react-icons/tb";
import { PiHexagonDuotone } from "react-icons/pi";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";
import { FaPlus, FaLock } from "react-icons/fa";
import { SVGAttributes } from "react";

export default function iconFor(
  iconKey: string,
  extraProps?: IconBaseProps & SVGAttributes<SVGElement>,
) {
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
      return <bs.BsFile size={"1.25em"} {...props} />;
    case "discard":
      return <bs.BsFileExcel size={"1.25em"} {...props} />;
    case "lock":
      return <FaLock {...props} />;
    case "mortal":
      return <tb.TbMeeple fill="green" stroke="black" {...props} />;
    case "exorcist":
      return <tb.TbMeeple fill="white" stroke="black" {...props} />;
    case "hunter":
      return <tb.TbMeeple fill="orange" stroke="black" {...props} />;
    case "skeptic":
      return <tb.TbMeeple fill="lightgray" stroke="black" {...props} />;
    case "medium":
      return <tb.TbMeeple fill="cyan" stroke="black" {...props} />;
    case "plus":
      return <FaPlus {...props} />;
    case "blue":
      return (
        <tb.TbCircleLetterB
          stroke="white"
          fill="blue"
          size={"1.4em"}
          {...props}
        />
      );
    case "red":
      return (
        <tb.TbCircleLetterC
          stroke="white"
          fill="red"
          size={"1.4em"}
          {...props}
        />
      );
    case "yellow":
      return (
        <tb.TbCircleLetterR
          stroke="black"
          fill="gold"
          size={"1.4em"}
          {...props}
        />
      );
    case "black":
      return (
        <tb.TbCircleLetterM
          stroke="white"
          fill="black"
          size={"1.4em"}
          {...props}
        />
      );
    case "jumpscare":
      return <tb.TbGhost2Filled {...props} />;
    case "hand_reach":
      return <gi.GiHand {...props} />;
    case "move_left":
      return <ImArrowLeft {...props} />;
    case "move_right":
      return <ImArrowRight {...props} />;
    case "point":
      return <PiHexagonDuotone fill="green" {...props} />;
    case "tuck":
      return <bs.BsFileArrowDown size={"1.25em"} {...props} />;
    case "cycle":
      return <gi.GiCycle {...props} />;
    default:
      return <span>⚠️</span>;
  }
}
