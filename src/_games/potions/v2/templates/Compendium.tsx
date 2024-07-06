import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { ingredientColors } from "../colors";
import iconFor from "../icons";
import { CardData } from "../parse";

export default function Compendium({ data }: { data: CardData }) {
  const myColor = ingredientColors[data.subType.toLowerCase()]
  return (
    <div className="flex flex-col h-full">
      <div className={`text-center text-xl ${myColor}`}>{data.name}</div>
      <hr />
      <div className="text-md p-1">
        <MarkdownWithIcons content={data.text} iconFn={(s: string) => iconFor(s, { size: "1.5em" })} />
      </div>
      <div className={`text-center ${myColor} text-4xl mt-auto`}>{iconFor(data.subType)}</div>
    </div>
  )
}