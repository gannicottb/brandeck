import { CardData } from "../parse";
import Image from "next/image"

export default function Room({ data }: { data: CardData }) {
  return <div className="flex flex-col h-[100%] justify-end">
    <div className="text-center bg-white w-[fit-content] mx-auto ml-5 p-1 rounded-t-lg text-lg uppercase">
        {data.name}
    </div>
    
    {/* <Image
      src={data.art}
      fill={true}
      alt={data.name}
      referrerPolicy="no-referrer"
      priority
      sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    /> */}
    <div className="text-center bg-white border-solid border-2 border-black w-[fit-content] mx-auto mt-auto p-1 rounded-t-lg">
        {data.text}
      </div>
  </div>
}