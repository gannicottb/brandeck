import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";

export default function Reference({ data }: { data: CardData }) {
  return (
    <div>
      <div className="text-center">{data.name}</div>
      <hr />
      <div className="text-m">
        <MarkdownWithIcons content={data.text} />
      </div>
    </div>
  )
}