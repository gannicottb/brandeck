import { CardData } from "../parse";
import Image from "next/image"

export default function Action({ data }: { data: CardData }) {
  return <div className="flex flex-col h-[100%] justify-end">
    <div className="text-center mx-auto mb-auto uppercase text-sm">{data.type}</div>
    <div className="mx-auto p-2">
      <Image
        src="https://placehold.co/300x200/png?text=👻"
        width={300}
        height={200}
        alt={data.name}
        referrerPolicy="no-referrer"
        priority
        sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
    </div>
    <div className="text-center bg-white border-solid border-2 border-black w-[fit-content] mx-auto p-1 rounded-lg">
        {data.name}
      </div>
    
    <div className="bg-white border-solid border-2 border-black h-[30%] w-[90%] p-1 rounded-t-lg mx-auto text-sm">
        {data.text}
      </div>
  </div>
}