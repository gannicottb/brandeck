import iconFor from "../icons";
import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardProps } from "../parse";

export default function Reference({ data, gameVer }: CardProps) {
  return (
    <div>
      {!data.name.startsWith("Chapters") && (
        <>
          <div className="text-center">{data.name}</div>
          <hr />
        </>
      )}

      {data.name.startsWith("Chapters") && (
        <div className="flex justify-center">
          {iconFor("triangle", { size: "5rem" })}
        </div>
      )}
      <div className="text-xs p-1">
        <MarkdownWithIcons content={data.text} />
      </div>
    </div>
  );
}
