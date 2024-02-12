import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";

export default function Reference({ data }: { data: CardData }) {
  return (
    <div>
      <div>{data.name}</div>
      <MarkdownWithIcons content={data.text} />
    </div>
  )
}