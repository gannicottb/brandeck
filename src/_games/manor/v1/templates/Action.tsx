import { CardData } from "../parse";
import Image from "next/image"

export default function Action({ data }: { data: CardData }) {
  return <div className="flex flex-col h-[100%] justify-end">
    <div className="text-center bg-white border-solid border-2 border-black w-[fit-content] ml-3 mr-auto p-1 rounded-t-lg">
        {data.name}
      </div>
    {data.type}
    {/* <Image
      src={data.art}
      fill={true}
      alt={data.name}
      referrerPolicy="no-referrer"
      priority
      sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    /> */}
    <div className="text-center bg-white border-solid border-2 border-black h-[30%] w-[80%] p-1 rounded-t-lg mt-auto mx-auto">
        {data.text}
      </div>
  </div>
}