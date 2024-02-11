import ReactMarkdown from "react-markdown";
import { ingredientColors } from "../colors";
import iconFor from "../icons";
import { CardData } from "../parse";
import Image from "next/image"



export default function Ingredient({ data }: { data: CardData }) {
  const myColor = ingredientColors[data.subType.toLowerCase()]

  function glyphBubble(iconKey: string) {
    return (
      <div className={`${myColor} rounded-xl`}>
        {iconFor(iconKey)}
      </div>
    )
  }

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
      <div className="relative flex text-4xl justify-between">
        {glyphBubble(data.grade)}{glyphBubble(data.subType)}{glyphBubble(data.grade)}
      </div>
      <div className={`relative mt-1 ml-auto mr-auto p-1 text-m ${myColor} font-medium text-black rounded-lg`}>
        {data.name}
      </div>
      <div className="absolute top-[45%] w-full flex text-4xl justify-between">
        {glyphBubble(data.subType)}{glyphBubble(data.subType)}
      </div>
      <div className="empty:hidden relative mt-auto ml-auto mr-auto p-2 text-3xl bg-white font-medium text-black rounded-lg">
        <ReactMarkdown
          components={{
            code(props) {
              //Get the value of what's in the backticks, pass that to iconFor
              const { children } = props
              return iconFor(String(children))
            }
          }}
        >{data.text}</ReactMarkdown>
      </div>
      <div className="relative flex text-4xl justify-between mt-auto">
        {glyphBubble(data.grade)}{glyphBubble(data.subType)}{glyphBubble(data.grade)}
      </div>
    </>
  )
}