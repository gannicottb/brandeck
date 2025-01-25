import { Version } from "@/app/lib/Version";
import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardProps } from "../parse";

export default function Reference({ data, gameVer }: CardProps) {
  return (
    <div>
      <div className="text-center">{data.name}</div>
      <hr />
      <div className="text-xs p-1">
        <MarkdownWithIcons content={data.text} />
      </div>
      <div className="text-xs bottom-0 right-1 absolute">{Version.toString(gameVer.version)}</div>
    </div>
  )
}