import { CardData } from "../parse";
import Image from "next/image"
import ReactMarkdown from "react-markdown";
import iconFor from "../icons";
import { ingredientColors } from "../colors";

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
      <div className="relative w-min ml-auto mr-auto mb-auto bg-white bg-opacity-75 text-xl text-center font-medium text-black rounded-lg">
        {data.name}
      </div>
      <div className="relative mb-2 bg-white text-l text-center font-medium text-black rounded-lg p-1">
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
      <div className="relative bg-white mb-2 text-xl text-center font-medium text-black rounded-lg">
        <ReactMarkdown
          components={{
            code(props) {
              //Get the value of what's in the backticks, pass that to iconFor
              const { children } = props
              return iconFor(String(children))
            }
          }}
        >{data.payoutFormula}</ReactMarkdown>
      </div>
      <div className={`relative pt-1 pb-1 ${ingredientColors[data.requirement.toLowerCase()]} text-2xl w-full text-center font-medium text-black rounded-lg`}>
        {iconFor(data.requirement)}
      </div>
    </>
  )
}