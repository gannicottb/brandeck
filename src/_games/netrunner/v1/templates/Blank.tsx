import { CardData } from "../parse";
import Image from "next/image"

export default function Blank({ data }: { data: CardData }) {
  console.log(data.art)
  return <div>
    <Image
      src={data.art}
      fill={true}
      alt="art"
      referrerPolicy="no-referrer"
      priority
      sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    />
  </div>
}