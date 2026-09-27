import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image";
import { useMemo } from "react";
import { factionColors } from "../colors";
import { FactionBadge } from "../FactionBadge";
import { PointsBadge } from "../PointsBadge";

export default function Room({ data }: { data: CardData }) {
  const myColor = useMemo(() => {
    return factionColors(data.faction);
  }, [data.faction]);

  const useMinTextHeight = data.name.startsWith("Lair");

  const useHighlightedText = data.name.startsWith("Dungeon");

  return (
    <div className={`flex flex-col h-[100%] justify-end bg-${myColor.tw}`}>
      {data.cost && (
        <div
          className={`absolute right-[2%] top-[1%] border-2 border-${myColor.tw} border-double rounded-[50%] h-10 w-10 items-center justify-center inline-flex text-2xl bg-white z-20`}
        >
          {data.cost}
        </div>
      )}

      <div className="text-center bg-white w-[fit-content] ml-1 mr-auto p-1 rounded-lg text-lg uppercase z-10">
        {data.name}
      </div>
      {data.mortals.length > 0 && (
        <div className="absolute left-[7%] top-[10%] text-4xl bg-white z-10">
          <MarkdownWithIcons content={data.mortals} />
          {data.chapter == "2" && (
            <div className="text-xs">
              <MarkdownWithIcons content={"_Chapter II: 3 pts per_ `mortal`"} />
            </div>
          )}
        </div>
      )}
      {data.marketbox && !data.name.startsWith("Lair") && (
        <div
          className={`absolute left-0 top-[70%] text-center text-4xl w-full z-10`}
        >
          <MarkdownWithIcons content={data.marketbox} />
        </div>
      )}
      <div
        className={`absolute left-[5%] top-[5%] w-[90%] ${useMinTextHeight ? "h-[70%]" : "h-[90%]"} m-0`}
      >
        <Image
          src={
            data.art
              ? data.art
              : `https://placehold.co/300x300/white/white/png?text=-`
          }
          fill={true}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      {data.name.startsWith("Lair") && (
        <div className={`flex mt-auto text-[.5rem] w-fit bg-white  z-10`}>
          {data.marketbox.split("---").map((t, i) => (
            <div
              className={`border-2 border-${myColor.tw} w-[50%]`}
              key={`lair-${i}`}
            >
              <MarkdownWithIcons content={t} />
            </div>
          ))}
        </div>
      )}

      <div className="absolute right-0 top-[11%]">
        <FactionBadge faction={data.faction} />
      </div>

      <div
        className={`text-center ${data.text == "" ? "invisible" : "visible"} ${useHighlightedText ? "bg-yellow-400" : "bg-white"} border-solid border-2 border-${myColor.tw} ${useMinTextHeight ? "h-[20%]" : "h-[33%]"} w-full mx-auto ${useMinTextHeight ? "" : "mt-auto"} p-1 rounded-t-lg z-10`}
      >
        {(data.text.includes(`dot`) && (
          <span className="text-left">
            <MarkdownWithIcons content={data.text} />
          </span>
        )) || <MarkdownWithIcons content={data.text} />}
      </div>
      {data.points && (
        <div className="absolute right-0 bottom-[4.5%] z-20">
          <PointsBadge color={myColor.tw} points={data.points} />
        </div>
      )}
    </div>
  );
}
