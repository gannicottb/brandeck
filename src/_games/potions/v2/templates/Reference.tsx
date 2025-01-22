import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardProps } from "../parse";

export default function Reference({ data }: CardProps) {
  return (
    <div>
      <div className="text-center">{data.name}</div>
      <hr />
      <div className="text-xs p-1">
        <MarkdownWithIcons content={data.text} />
      </div>
    </div>
  )
}