import { CardData } from "../parse";
import Image from "next/image"

export default function Blank({ data }: { data: CardData }) {
  return <div>
    <Image
      src={data.art}
      fill={true}
      alt={data.name}
      referrerPolicy="no-referrer"
      priority
      sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    />
  </div>
}