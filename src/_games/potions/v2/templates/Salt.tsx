import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";

export default function Salt({ data }: { data: CardData }) {
  return (
    <div className="flex flex-col justify-center items-center h-[100%]">
      <div className="text-8xl p-1">
        <MarkdownWithIcons content={data.text} />
      </div>
    </div>
  )
}