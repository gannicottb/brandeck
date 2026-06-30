import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image"

export default function Room({ data }: { data: CardData }) {
  return <div className="flex flex-col h-[100%] justify-end">
    <div className="absolute right-[2%] top-[2%] text-lg border-2 border-black border-solid rounded-lg bg-white px-1">{data.cost}</div>
    <div className="text-center mx-auto uppercase text-sm">{data.type}</div>
    <div className="text-center bg-white w-[fit-content] ml-1 mr-auto p-1 rounded-b-lg text-lg uppercase">
        {data.name}
    </div>
    <div className={`absolute left-[5%] top-[6%] w-[90%] h-[90%] m-0 -z-10`}>
      <Image
        src={`https://placehold.co/300x300/mediumpurple/white/png?text=${data.name.split(" ").map(n => n.at(0)).join('')}`}
        fill={true}
        alt={data.name}
        referrerPolicy="no-referrer"
        priority
        sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
    </div>
    <div className="text-center bg-white border-solid border-2 border-black w-[fit-content] mx-auto mt-auto p-1 rounded-t-lg">
      <MarkdownWithIcons content={data.text}/>
    </div>
  </div>
}