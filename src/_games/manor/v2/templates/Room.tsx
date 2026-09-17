import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image";
import { useMemo } from "react";
import { factionColors } from "../colors";
import { FactionBadge } from "../FactionBadge";

export default function Room({ data }: { data: CardData }) {
  const myColor = useMemo(() => {
    return factionColors(data.faction);
  }, [data.faction]);

  const useMinTextHeight = data.name.startsWith("Lair");

  return (
    <div className={`flex flex-col h-[100%] justify-end bg-${myColor.tw}`}>
      {data.cost && (
        <div
          className={`absolute right-[2%] top-[2%] border-2 border-${myColor.tw} border-double rounded-[50%] h-10 w-10 items-center justify-center inline-flex text-2xl bg-white z-20`}
        >
          {data.cost}
        </div>
      )}

      <div className="text-center bg-white w-[fit-content] ml-1 mr-auto p-1 rounded-b-lg rounded-t-lg text-lg uppercase z-10">
        {data.name}
      </div>
      {data.mortals.length > 0 && (
        <div className="absolute left-[7%] top-[10%] text-3xl bg-white z-10">
          <MarkdownWithIcons content={data.mortals} />
          {data.chapter == "2" && (
            <div className="text-xs">
              <MarkdownWithIcons content={"_Chapter II: 3 pts per_ `mortal`"} />
            </div>
          )}
        </div>
      )}
      <div className={`absolute left-[5%] top-[6%] w-[90%] h-[90%] m-0`}>
        <Image
          src={
            data.art
              ? data.art
              : `https://placehold.co/300x300/white/black/png?font=Playfair%20Display&text=${data.name
                  .split(" ")
                  .map((n) => n.at(0))
                  .join("")}`
          }
          fill={true}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      {data.name.startsWith("Lair") && data.marketbox && (
        <div
          className={`mt-auto text-xs p-1 w-fit bg-white border-2 border-${myColor.tw} z-10`}
        >
          <MarkdownWithIcons content={data.marketbox} />
        </div>
      )}
      <div className="absolute right-0 top-[60%]">
        <FactionBadge faction={data.faction} />
      </div>
      <div
        className={`text-center bg-white border-solid border-2 border-${myColor.tw} ${useMinTextHeight ? "h-fit" : "h-[33%]"} w-full mx-auto ${useMinTextHeight ? "" : "mt-auto"} p-1 rounded-t-lg z-10`}
      >
        {(data.text.includes(`dot`) && (
          <span className="text-left">
            <MarkdownWithIcons content={data.text} />
          </span>
        )) || <MarkdownWithIcons content={data.text} />}
      </div>
    </div>
  );
}
