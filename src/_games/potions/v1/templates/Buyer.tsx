import { CardData } from "../parse";
import Image from "next/image"
import iconFor from "../icons";
import { ingredientColors } from "../colors";
import { MarkdownWithIcons } from "../MarkdownWithIcons";

export default function Buyer({ data }: { data: CardData }) {
  return (
    <>
      <div className="absolute top-0 w-full h-full m-0 -z-10 bg-black">
        <Image
          className="max-w-full max-h-full mb-auto object-cover"
          src={data.art}
          fill={true}
          alt="art"
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      <div className="relative w-min ml-auto mr-auto mb-auto bg-white text-xl text-center font-medium text-black rounded-lg">
        {data.name}
      </div>
      <div className="relative p-1 mb-1 bg-white text-lg text-center font-medium text-black rounded-lg">
        <MarkdownWithIcons content={data.text} />
      </div>
      <div className="relative bg-white mb-1 text-xl text-center font-medium text-black rounded-lg">
        <MarkdownWithIcons content={data.payoutFormula} />
      </div>
      <div className={`relative pt-1 pb-1 ${ingredientColors[data.requirement.toLowerCase()]} text-2xl w-full text-center font-medium text-black rounded-lg`}>
        <div className="absolute left-1 bottom-0 text-lg">{iconFor("ask")}</div>{iconFor(data.requirement)}
      </div>
    </>
  )
}