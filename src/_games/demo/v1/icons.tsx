import { FaBeer } from 'react-icons/fa';
import { AiFillClockCircle } from "react-icons/ai";

export default function iconFor(iconKey: string) {
  switch (iconKey) {
    case "A": return <FaBeer style={{ display: "unset" }} />
    case "B": return <AiFillClockCircle color={"gold"} style={{ display: "unset" }} />
    default:
      return undefined
  }
}