import { CardData } from "../parse";
import Image from "next/image"
import { Check, Iconoir } from 'iconoir-react';
import ReactMarkdown from "react-markdown";

export default function Basic({ data }: { data: CardData }) {
  return (
    <>
      <div className="text-xl font-medium text-black">{data.name} - {data.type}</div>
      <div className="text-xl font-medium text-black">{data.power}</div>
      <div className="relative w-full h-1/2 m-0 bg-gray-400">
        <Image
          className="max-w-full max-h-full mt-auto mb-auto object-contain"
          src={data.art}
          fill={true}
          alt="art"
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        /></div>
      <div className="text-xl font-medium text-black">
        <ReactMarkdown components={{
          code(props) {
            // Get the value of what's in the backticks, pass that to iconFor
            const { children } = props
            return iconFor(String(children))
          }
        }}>{data.text}</ReactMarkdown>
      </div>
    </>
  )
}
//DON'T CALL REACTMARKDOWN MORE THAN ONCE
function iconFor(iconKey: string) {
  switch (iconKey) {
    case "A": return <Iconoir />
    case "B": return <Check />
    default:
      return undefined
  }
}